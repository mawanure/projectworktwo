package com.stayhome.controller;

import com.stayhome.dto.*;
import com.stayhome.entity.User;
import com.stayhome.exception.ResourceNotFoundException;
import com.stayhome.repository.UserRepository;
import com.stayhome.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/api/orders/checkout-preview")
    public ResponseEntity<CheckoutPreviewResponse> getCheckoutPreview() {
        User user = getAuthenticatedUser();
        CheckoutPreviewResponse preview = orderService.getCheckoutPreview(user);
        return ResponseEntity.ok(preview);
    }

    @PostMapping("/api/orders")
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody CheckoutRequest request) {
        User user = getAuthenticatedUser();
        OrderResponse order = orderService.placeOrder(user, request);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/api/orders/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        User user = getAuthenticatedUser();
        List<OrderResponse> orders = orderService.getMyOrders(user);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/api/orders/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        OrderResponse order = orderService.getMyOrderById(user, id);
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/api/orders/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        OrderResponse order = orderService.cancelOrder(user, id);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/api/orders/{id}/payment")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable Long id) {
        // Only the order owner can see their payment record (ownership check is inside service)
        orderService.getMyOrderById(getAuthenticatedUser(), id); // ownership check
        PaymentResponse payment = orderService.getPaymentByOrderId(id);
        return ResponseEntity.ok(payment);
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
