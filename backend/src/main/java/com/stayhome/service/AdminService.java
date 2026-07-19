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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private NewsletterSubscriberRepository newsletterSubscriberRepository;

    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long totalAdmins = userRepository.countByRole(Role.ADMIN);
        long totalCategories = categoryRepository.count();
        long totalProducts = productRepository.count();
        long activeProducts = productRepository.countByIsActiveTrue();
        long totalOrders = orderRepository.count();
        LocalDateTime dayStart = LocalDate.now().atStartOfDay();
        long todayOrders = orderRepository.countByOrderDateBetween(dayStart, dayStart.plusDays(1));
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();

        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long processingOrders = orderRepository.countByStatus(OrderStatus.PROCESSING);
        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);

        long lowStockProducts = productRepository.countByStockLessThanEqualAndStockGreaterThan(5, 0);
        long outOfStockProducts = productRepository.countByStock(0);

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalCustomers(totalCustomers)
                .totalAdmins(totalAdmins)
                .totalCategories(totalCategories)
                .totalProducts(totalProducts)
                .activeProducts(activeProducts)
                .totalOrders(totalOrders)
                .todayOrders(todayOrders)
                .totalRevenue(totalRevenue)
                .pendingOrders(pendingOrders)
                .processingOrders(processingOrders)
                .deliveredOrders(deliveredOrders)
                .cancelledOrders(cancelledOrders)
                .lowStockProducts(lowStockProducts)
                .outOfStockProducts(outOfStockProducts)
                .build();
    }

    // ========= User Management =========

    public List<UserResponse> searchAndFilterUsers(String search, Role role) {
        return userRepository.searchAndFilterUsers(search, role).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse blockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setBlocked(true);
        return mapToUserResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse unblockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setBlocked(false);
        return mapToUserResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse changeUserRole(Long id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setRole(role);
        return mapToUserResponse(userRepository.save(user));
    }

    // ========= Product Management Helpers =========

    @Transactional
    public ProductResponse updateProductStock(Long productId, Integer stock) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        product.setStock(stock);
        return mapToProductResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse activateProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        product.setIsActive(true);
        return mapToProductResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse deactivateProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        product.setIsActive(false);
        return mapToProductResponse(productRepository.save(product));
    }

    // ========= Order Management =========

    public List<OrderResponse> searchAndFilterOrders(OrderStatus status, Long customerId, String search) {
        return orderRepository.searchAndFilterOrders(status, customerId, search).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return mapToOrderResponse(order);
    }

    // ========= Payment Management =========

    public List<PaymentResponse> searchAndFilterPayments(PaymentStatus status, PaymentMethod method) {
        return paymentRepository.searchAndFilterPayments(status, method).stream()
                .map(this::mapToPaymentResponse)
                .collect(Collectors.toList());
    }

    public PaymentResponse getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found with id: " + paymentId));
        return mapToPaymentResponse(payment);
    }

    // ========= Contact Messages / Tickets =========

    public List<ContactMessageResponse> getAllContactMessages() {
        return contactMessageRepository.findAll().stream()
                .map(this::mapToContactMessageResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ContactMessageResponse markContactMessageRead(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found with id: " + id));
        message.setIsRead(true);
        return mapToContactMessageResponse(contactMessageRepository.save(message));
    }

    @Transactional
    public void deleteContactMessage(Long id) {
        if (!contactMessageRepository.existsById(id)) throw new ResourceNotFoundException("Contact message not found with id: " + id);
        contactMessageRepository.deleteById(id);
    }

    @Transactional
    public void deleteNewsletterSubscriber(Long id) {
        if (!newsletterSubscriberRepository.existsById(id)) throw new ResourceNotFoundException("Subscriber not found with id: " + id);
        newsletterSubscriberRepository.deleteById(id);
    }

    public List<NewsletterSubscriberResponse> getAllNewsletterSubscribers() {
        return newsletterSubscriberRepository.findAll().stream()
                .map(this::mapToNewsletterSubscriberResponse)
                .collect(Collectors.toList());
    }

    // ========= Mapping Helpers =========

    private UserResponse mapToUserResponse(User user) {
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

    private ProductResponse mapToProductResponse(Product product) {
        List<String> imageUrls = new ArrayList<>();
        if (product.getImages() != null) {
            imageUrls = product.getImages().stream()
                    .map(ProductImage::getImageUrl)
                    .collect(Collectors.toList());
        }

        CategoryResponse categoryResponse = CategoryResponse.builder()
                .id(product.getCategory().getId())
                .name(product.getCategory().getName())
                .description(product.getCategory().getDescription())
                .build();

        String availability = (product.getStock() != null && product.getStock() > 0) ? "In Stock" : "Out of Stock";

        return ProductResponse.builder()
                .id(product.getId())
                .category(categoryResponse)
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .sizes(product.getSizes())
                .rating(product.getRating())
                .availability(availability)
                .isActive(product.getIsActive())
                .imageUrls(imageUrls)
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

    private ContactMessageResponse mapToContactMessageResponse(ContactMessage msg) {
        return ContactMessageResponse.builder()
                .id(msg.getId())
                .name(msg.getName())
                .emailOrPhone(msg.getEmailOrPhone())
                .message(msg.getMessage())
                .isRead(msg.getIsRead())
                .createdAt(msg.getCreatedAt())
                .build();
    }

    private NewsletterSubscriberResponse mapToNewsletterSubscriberResponse(NewsletterSubscriber sub) {
        return NewsletterSubscriberResponse.builder()
                .id(sub.getId())
                .email(sub.getEmail())
                .subscribedAt(sub.getSubscribedAt())
                .build();
    }
}
