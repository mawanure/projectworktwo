package com.stayhome.controller;

import com.stayhome.dto.CartItemRequest;
import com.stayhome.dto.CartResponse;
import com.stayhome.entity.User;
import com.stayhome.repository.UserRepository;
import com.stayhome.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        User user = getAuthenticatedUser();
        CartResponse cart = cartService.getCart(user);
        return ResponseEntity.ok(cart);
    }

    @PostMapping
    public ResponseEntity<CartResponse> addItemToCart(@Valid @RequestBody CartItemRequest request) {
        User user = getAuthenticatedUser();
        CartResponse cart = cartService.addItemToCart(user, request);
        return ResponseEntity.ok(cart);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartResponse> updateCartItemQuantity(
            @PathVariable Long id,
            @RequestParam int quantity
    ) {
        User user = getAuthenticatedUser();
        CartResponse cart = cartService.updateCartItemQuantity(user, id, quantity);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CartResponse> removeItemFromCart(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        CartResponse cart = cartService.removeItemFromCart(user, id);
        return ResponseEntity.ok(cart);
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new com.stayhome.exception.ResourceNotFoundException("User not found with email: " + email));
    }
}
