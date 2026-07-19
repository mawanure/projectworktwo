package com.stayhome.controller;

import com.stayhome.dto.*;
import com.stayhome.entity.OrderStatus;
import com.stayhome.entity.PaymentMethod;
import com.stayhome.entity.PaymentStatus;
import com.stayhome.entity.Role;
import com.stayhome.service.AdminService;
import com.stayhome.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private OrderService orderService;

    // ========= Dashboard Stats =========

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    // ========= User Management =========

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> searchAndFilterUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role
    ) {
        List<UserResponse> users = adminService.searchAndFilterUsers(search, role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/users/{id}/block")
    public ResponseEntity<UserResponse> blockUser(@PathVariable Long id) {
        UserResponse user = adminService.blockUser(id);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/users/{id}/unblock")
    public ResponseEntity<UserResponse> unblockUser(@PathVariable Long id) {
        UserResponse user = adminService.unblockUser(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> changeUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {
        Role role = Role.valueOf(request.get("role").toUpperCase());
        UserResponse user = adminService.changeUserRole(id, role);
        return ResponseEntity.ok(user);
    }

    // ========= Product Management Helpers =========

    @PatchMapping("/products/{id}/stock")
    public ResponseEntity<ProductResponse> updateProductStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request
    ) {
        Integer stock = request.get("stock");
        ProductResponse product = adminService.updateProductStock(id, stock);
        return ResponseEntity.ok(product);
    }

    @PatchMapping("/products/{id}/activate")
    public ResponseEntity<ProductResponse> activateProduct(@PathVariable Long id) {
        ProductResponse product = adminService.activateProduct(id);
        return ResponseEntity.ok(product);
    }

    @PatchMapping("/products/{id}/deactivate")
    public ResponseEntity<ProductResponse> deactivateProduct(@PathVariable Long id) {
        ProductResponse product = adminService.deactivateProduct(id);
        return ResponseEntity.ok(product);
    }

    // ========= Order Management =========

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> searchAndFilterOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) String search
    ) {
        List<OrderResponse> orders = adminService.searchAndFilterOrders(status, customerId, search);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        OrderResponse order = adminService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        OrderResponse order = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/orders/{id}/payment")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(@PathVariable Long id) {
        PaymentResponse payment = orderService.getPaymentByOrderId(id);
        return ResponseEntity.ok(payment);
    }

    // ========= Payment Management =========

    @GetMapping("/payments")
    public ResponseEntity<List<PaymentResponse>> searchAndFilterPayments(
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) PaymentMethod method
    ) {
        List<PaymentResponse> payments = adminService.searchAndFilterPayments(status, method);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/payments/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id) {
        PaymentResponse payment = adminService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }

    // ========= Contact Messages & Subscribers =========

    @GetMapping("/contact-messages")
    public ResponseEntity<List<ContactMessageResponse>> getContactMessages() {
        List<ContactMessageResponse> messages = adminService.getAllContactMessages();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/newsletter-subscribers")
    public ResponseEntity<List<NewsletterSubscriberResponse>> getNewsletterSubscribers() {
        List<NewsletterSubscriberResponse> subscribers = adminService.getAllNewsletterSubscribers();
        return ResponseEntity.ok(subscribers);
    }
}
