package com.stayhome.controller;

import com.stayhome.dto.*;
import com.stayhome.entity.BlogPost;
import com.stayhome.entity.OrderStatus;
import com.stayhome.entity.PaymentMethod;
import com.stayhome.entity.PaymentStatus;
import com.stayhome.entity.Role;
import com.stayhome.repository.BlogPostRepository;
import com.stayhome.service.AdminService;
import com.stayhome.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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

    @Autowired
    private BlogPostRepository blogPostRepository;

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

    @PutMapping("/payments/{id}/status")
    public ResponseEntity<PaymentResponse> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {
        PaymentStatus status = PaymentStatus.valueOf(request.get("status").toUpperCase());
        PaymentResponse payment = adminService.updatePaymentStatus(id, status);
        return ResponseEntity.ok(payment);
    }

    // ========= Contact Messages & Subscribers =========

    @GetMapping("/contact-messages")
    public ResponseEntity<List<ContactMessageResponse>> getContactMessages() {
        List<ContactMessageResponse> messages = adminService.getAllContactMessages();
        return ResponseEntity.ok(messages);
    }

    @PatchMapping("/contact-messages/{id}/read")
    public ResponseEntity<ContactMessageResponse> markContactMessageRead(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.markContactMessageRead(id));
    }

    @DeleteMapping("/contact-messages/{id}")
    public ResponseEntity<Void> deleteContactMessage(@PathVariable Long id) {
        adminService.deleteContactMessage(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/newsletter-subscribers")
    public ResponseEntity<List<NewsletterSubscriberResponse>> getNewsletterSubscribers() {
        List<NewsletterSubscriberResponse> subscribers = adminService.getAllNewsletterSubscribers();
        return ResponseEntity.ok(subscribers);
    }

    @DeleteMapping("/newsletter-subscribers/{id}")
    public ResponseEntity<Void> deleteNewsletterSubscriber(@PathVariable Long id) {
        adminService.deleteNewsletterSubscriber(id);
        return ResponseEntity.noContent().build();
    }

    // ========= Blog Post Management =========

    @GetMapping("/blogs")
    public ResponseEntity<Page<BlogPostResponse>> getAdminBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 100));
        return ResponseEntity.ok(blogPostRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toBlogResponse));
    }

    @PostMapping("/blogs")
    public ResponseEntity<BlogPostResponse> createBlog(@Valid @RequestBody BlogPostRequest request) {
        BlogPost post = BlogPost.builder()
                .title(request.getTitle().trim())
                .content(request.getContent().trim())
                .imageUrl(request.getImageUrl())
                .author(request.getAuthor() != null && !request.getAuthor().isBlank() ? request.getAuthor().trim() : "Admin")
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(toBlogResponse(blogPostRepository.save(post)));
    }

    @PutMapping("/blogs/{id}")
    public ResponseEntity<BlogPostResponse> updateBlog(@PathVariable Long id, @Valid @RequestBody BlogPostRequest request) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new com.stayhome.exception.ResourceNotFoundException("Blog post not found with id: " + id));
        post.setTitle(request.getTitle().trim());
        post.setContent(request.getContent().trim());
        post.setImageUrl(request.getImageUrl());
        if (request.getAuthor() != null && !request.getAuthor().isBlank()) {
            post.setAuthor(request.getAuthor().trim());
        }
        return ResponseEntity.ok(toBlogResponse(blogPostRepository.save(post)));
    }

    @DeleteMapping("/blogs/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        if (!blogPostRepository.existsById(id)) {
            throw new com.stayhome.exception.ResourceNotFoundException("Blog post not found with id: " + id);
        }
        blogPostRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private BlogPostResponse toBlogResponse(BlogPost post) {
        return BlogPostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .author(post.getAuthor())
                .createdAt(post.getCreatedAt())
                .build();
    }
}
