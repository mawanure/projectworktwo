package com.stayhome.service;

import com.stayhome.dto.WishlistItemRequest;
import com.stayhome.dto.WishlistItemResponse;
import com.stayhome.dto.WishlistResponse;
import com.stayhome.dto.ProductSummaryResponse;
import com.stayhome.entity.Product;
import com.stayhome.entity.ProductImage;
import com.stayhome.entity.User;
import com.stayhome.entity.WishlistItem;
import com.stayhome.exception.ResourceConflictException;
import com.stayhome.exception.ResourceNotFoundException;
import com.stayhome.repository.ProductRepository;
import com.stayhome.repository.WishlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private ProductRepository productRepository;

    public WishlistResponse getWishlist(User user) {
        List<WishlistItem> items = wishlistItemRepository.findByUser(user);
        return buildWishlistResponse(items);
    }

    @Transactional
    public WishlistResponse addItemToWishlist(User user, WishlistItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (wishlistItemRepository.existsByUserAndProduct(user, product)) {
            throw new ResourceConflictException("Product is already in your wishlist.");
        }

        WishlistItem wishlistItem = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();

        wishlistItemRepository.save(wishlistItem);
        return getWishlist(user);
    }

    @Transactional
    public WishlistResponse removeItemFromWishlist(User user, Long wishlistItemId) {
        WishlistItem wishlistItem = wishlistItemRepository.findById(wishlistItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist item not found with id: " + wishlistItemId));

        if (!wishlistItem.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Wishlist item does not belong to the current authenticated user.");
        }

        wishlistItemRepository.delete(wishlistItem);
        return getWishlist(user);
    }

    @Transactional
    public void clearWishlist(User user) {
        wishlistItemRepository.deleteByUser(user);
    }

    public boolean isProductInWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        return wishlistItemRepository.existsByUserAndProduct(user, product);
    }

    private WishlistResponse buildWishlistResponse(List<WishlistItem> items) {
        List<WishlistItemResponse> mappedItems = items.stream()
                .map(this::mapToWishlistItemResponse)
                .collect(Collectors.toList());

        return WishlistResponse.builder()
                .items(mappedItems)
                .totalItems(mappedItems.size())
                .build();
    }

    private WishlistItemResponse mapToWishlistItemResponse(WishlistItem item) {
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

        return WishlistItemResponse.builder()
                .id(item.getId())
                .product(productSummary)
                .addedAt(item.getCreatedAt())
                .build();
    }
}
