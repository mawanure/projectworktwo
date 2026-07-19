package com.stayhome.service;

import com.stayhome.dto.*;
import com.stayhome.entity.*;
import com.stayhome.exception.ResourceConflictException;
import com.stayhome.exception.ResourceNotFoundException;
import com.stayhome.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final BigDecimal DELIVERY_CHARGE = BigDecimal.valueOf(60.00);
    private static final BigDecimal FREE_DELIVERY_THRESHOLD = BigDecimal.valueOf(1000.00);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * Generate a checkout preview from the user's current cart without placing the order.
     */
    public CheckoutPreviewResponse getCheckoutPreview(User user) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new ResourceConflictException("Your cart is empty. Add items before proceeding to checkout.");
        }

        List<CheckoutPreviewResponse.OrderItemPreview> previews = cartItems.stream().map(item -> {
            Product product = item.getProduct();
            BigDecimal subTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            return CheckoutPreviewResponse.OrderItemPreview.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .size(item.getSize())
                    .quantity(item.getQuantity())
                    .unitPrice(product.getPrice())
                    .subTotal(subTotal)
                    .build();
        }).collect(Collectors.toList());

        BigDecimal subtotal = previews.stream()
                .map(CheckoutPreviewResponse.OrderItemPreview::getSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal deliveryCharge = subtotal.compareTo(FREE_DELIVERY_THRESHOLD) >= 0
                ? BigDecimal.ZERO : DELIVERY_CHARGE;

        BigDecimal totalAmount = subtotal.add(deliveryCharge);

        return CheckoutPreviewResponse.builder()
                .items(previews)
                .subtotal(subtotal)
                .deliveryCharge(deliveryCharge)
                .totalAmount(totalAmount)
                .build();
    }

    /**
     * Place order: validate cart + stock, create order, deduct stock, clear cart.
     */
    @Transactional
    public OrderResponse placeOrder(User user, CheckoutRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new ResourceConflictException("Your cart is empty. Add items before placing an order.");
        }

        // Validate stock for all items before creating the order
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (!product.getIsActive()) {
                throw new ResourceConflictException("Product '" + product.getName() + "' is currently inactive and cannot be ordered.");
            }
            if (product.getStock() < cartItem.getQuantity()) {
                throw new ResourceConflictException(
                        "Insufficient stock for product '" + product.getName() +
                        "'. Available: " + product.getStock() + ", Requested: " + cartItem.getQuantity()
                );
            }
        }

        // Calculate totals
        BigDecimal subtotal = cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal deliveryCharge = subtotal.compareTo(FREE_DELIVERY_THRESHOLD) >= 0
                ? BigDecimal.ZERO : DELIVERY_CHARGE;

        BigDecimal totalAmount = subtotal.add(deliveryCharge);

        // Build order
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .subtotal(subtotal)
                .deliveryCharge(deliveryCharge)
                .totalAmount(totalAmount)
                .shippingAddress(request.getShippingAddress())
                .phone(request.getPhone())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.UNPAID)
                .build();

        // Map cart items to order items and deduct stock
        for (CartItem cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found."));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .size(cartItem.getSize())
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())  // Snapshot price at order time
                    .build();

            order.getOrderItems().add(orderItem);

            // Deduct stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        Order savedOrder = orderRepository.save(order);

        // Create initial payment record
        Payment payment = Payment.builder()
                .order(savedOrder)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.UNPAID)
                .amount(totalAmount)
                .build();
        paymentRepository.save(payment);

        // Clear the cart
        cartItemRepository.deleteAll(cartItems);

        return mapToOrderResponse(savedOrder);
    }

    /**
     * Retrieve all orders for the authenticated customer.
     */
    public List<OrderResponse> getMyOrders(User user) {
        return orderRepository.findByUserOrderByOrderDateDesc(user).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieve a specific order by ID for the authenticated customer.
     */
    public OrderResponse getMyOrderById(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order not found with id: " + orderId);
        }

        return mapToOrderResponse(order);
    }

    /**
     * Cancel an order — only PENDING orders can be cancelled. Stock is restored.
     */
    @Transactional
    public OrderResponse cancelOrder(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order not found with id: " + orderId);
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new ResourceConflictException(
                    "Only PENDING orders can be cancelled. Current status: " + order.getStatus()
            );
        }

        // Restore stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found."));
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELLED);

        // Update payment record
        paymentRepository.findByOrderId(orderId).ifPresent(payment -> {
            payment.setPaymentStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);
        });

        return mapToOrderResponse(orderRepository.save(order));
    }

    // ========= Admin Methods =========

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResourceConflictException("Invalid order status: " + request.getStatus());
        }

        order.setStatus(newStatus);

        // Auto-mark payment as PAID when order is confirmed (for COD or admin override)
        if (newStatus == OrderStatus.CONFIRMED && order.getPaymentStatus() == PaymentStatus.UNPAID) {
            if (order.getPaymentMethod() == PaymentMethod.COD) {
                order.setPaymentStatus(PaymentStatus.PAID);
                paymentRepository.findByOrderId(orderId).ifPresent(payment -> {
                    payment.setPaymentStatus(PaymentStatus.PAID);
                    payment.setPaidAt(LocalDateTime.now());
                    paymentRepository.save(payment);
                });
            }
        }

        return mapToOrderResponse(orderRepository.save(order));
    }

    public PaymentResponse getPaymentByOrderId(Long orderId) {
        orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for order: " + orderId));
        return mapToPaymentResponse(payment);
    }

    // ========= Mapping Helpers =========

    private UserResponse mapToUserResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .role(user.getRole())
                .blocked(user.getBlocked())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getOrderItems().stream()
                .map(this::mapToOrderItemResponse)
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .subtotal(order.getSubtotal())
                .deliveryCharge(order.getDeliveryCharge())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .phone(order.getPhone())
                .paymentMethod(order.getPaymentMethod().name())
                .paymentStatus(order.getPaymentStatus().name())
                .orderDate(order.getOrderDate())
                .updatedAt(order.getUpdatedAt())
                .user(mapToUserResponse(order.getUser()))
                .items(items)
                .build();
    }

    private OrderItemResponse mapToOrderItemResponse(OrderItem item) {
        Product prod = item.getProduct();
        String primaryImageUrl = null;
        if (prod.getImages() != null && !prod.getImages().isEmpty()) {
            primaryImageUrl = prod.getImages().stream()
                    .filter(ProductImage::getIsPrimary)
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElse(prod.getImages().get(0).getImageUrl());
        }

        ProductSummaryResponse productSummary = ProductSummaryResponse.builder()
                .id(prod.getId())
                .name(prod.getName())
                .price(prod.getPrice())
                .primaryImageUrl(primaryImageUrl)
                .build();

        BigDecimal subTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        return OrderItemResponse.builder()
                .id(item.getId())
                .product(productSummary)
                .size(item.getSize())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subTotal(subTotal)
                .build();
    }

    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .transactionId(payment.getTransactionId())
                .paymentMethod(payment.getPaymentMethod().name())
                .paymentStatus(payment.getPaymentStatus().name())
                .amount(payment.getAmount())
                .paidAt(payment.getPaidAt())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
