package com.stayhome.service;

import com.stayhome.dto.CartItemRequest;
import com.stayhome.dto.CartItemResponse;
import com.stayhome.dto.CartResponse;
import com.stayhome.dto.ProductSummaryResponse;
import com.stayhome.entity.CartItem;
import com.stayhome.entity.Product;
import com.stayhome.entity.ProductImage;
import com.stayhome.entity.User;
import com.stayhome.exception.ResourceConflictException;
import com.stayhome.exception.ResourceNotFoundException;
import com.stayhome.repository.CartItemRepository;
import com.stayhome.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    public CartResponse getCart(User user) {
        List<CartItem> items = cartItemRepository.findByUser(user);
        return buildCartResponse(items);
    }

    @Transactional
    public CartResponse addItemToCart(User user, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        // Check if item already exists in user's cart
        CartItem cartItem = cartItemRepository.findByUserAndProductAndSize(user, product, request.getSize())
                .orElse(null);

        int newQuantity = request.getQuantity();
        if (cartItem != null) {
            newQuantity += cartItem.getQuantity();
        }

        // Validate stock level
        if (newQuantity > product.getStock()) {
            throw new ResourceConflictException("Cannot add requested quantity. Only " + product.getStock() + " units available in stock.");
        }

        if (cartItem != null) {
            cartItem.setQuantity(newQuantity);
            cartItemRepository.save(cartItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .size(request.getSize())
                    .quantity(newQuantity)
                    .build();
            cartItemRepository.save(newItem);
        }

        return getCart(user);
    }

    @Transactional
    public CartResponse updateCartItemQuantity(User user, Long cartItemId, int quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Cart item does not belong to the current authenticated user.");
        }

        // Validate stock level
        if (quantity > cartItem.getProduct().getStock()) {
            throw new ResourceConflictException("Cannot update quantity. Only " + cartItem.getProduct().getStock() + " units available in stock.");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        return getCart(user);
    }

    @Transactional
    public CartResponse removeItemFromCart(User user, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Cart item does not belong to the current authenticated user.");
        }

        cartItemRepository.delete(cartItem);

        return getCart(user);
    }

    private CartResponse buildCartResponse(List<CartItem> items) {
        List<CartItemResponse> mappedItems = items.stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());

        BigDecimal totalPrice = mappedItems.stream()
                .map(CartItemResponse::getSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .items(mappedItems)
                .totalPrice(totalPrice)
                .build();
    }

    private CartItemResponse mapToCartItemResponse(CartItem item) {
        Product prod = item.getProduct();
        String primaryImageUrl = null;
        if (prod.getImages() != null && !prod.getImages().isEmpty()) {
            primaryImageUrl = prod.getImages().stream()
                    .filter(ProductImage::getIsPrimary)
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElse(prod.getImages().get(0).getImageUrl());
        }

        ProductSummaryResponse prodSummary = ProductSummaryResponse.builder()
                .id(prod.getId())
                .name(prod.getName())
                .price(prod.getPrice())
                .primaryImageUrl(primaryImageUrl)
                .build();

        BigDecimal subTotal = prod.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        return CartItemResponse.builder()
                .id(item.getId())
                .product(prodSummary)
                .size(item.getSize())
                .quantity(item.getQuantity())
                .subTotal(subTotal)
                .build();
    }
}
