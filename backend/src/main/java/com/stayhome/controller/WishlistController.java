package com.stayhome.controller;

import com.stayhome.dto.WishlistItemRequest;
import com.stayhome.dto.WishlistResponse;
import com.stayhome.entity.User;
import com.stayhome.exception.ResourceNotFoundException;
import com.stayhome.repository.UserRepository;
import com.stayhome.service.WishlistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<WishlistResponse> getWishlist() {
        User user = getAuthenticatedUser();
        WishlistResponse wishlist = wishlistService.getWishlist(user);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping
    public ResponseEntity<WishlistResponse> addItemToWishlist(@Valid @RequestBody WishlistItemRequest request) {
        User user = getAuthenticatedUser();
        WishlistResponse wishlist = wishlistService.addItemToWishlist(user, request);
        return ResponseEntity.ok(wishlist);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<WishlistResponse> removeItemFromWishlist(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        WishlistResponse wishlist = wishlistService.removeItemFromWishlist(user, id);
        return ResponseEntity.ok(wishlist);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> clearWishlist() {
        User user = getAuthenticatedUser();
        wishlistService.clearWishlist(user);
        return ResponseEntity.ok(Map.of("message", "Wishlist cleared successfully."));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkProductInWishlist(@PathVariable Long productId) {
        User user = getAuthenticatedUser();
        boolean exists = wishlistService.isProductInWishlist(user, productId);
        return ResponseEntity.ok(Map.of("inWishlist", exists));
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
