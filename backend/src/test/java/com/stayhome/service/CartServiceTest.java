package com.stayhome.service;

import com.stayhome.dto.CartItemRequest;
import com.stayhome.dto.CartResponse;
import com.stayhome.entity.CartItem;
import com.stayhome.entity.Product;
import com.stayhome.entity.User;
import com.stayhome.exception.ResourceConflictException;
import com.stayhome.repository.CartItemRepository;
import com.stayhome.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock private CartItemRepository cartItemRepository;
    @Mock private ProductRepository productRepository;

    @InjectMocks private CartService cartService;

    @Test
    void addItemToCartSuccessful() {
        User user = User.builder().id(1L).build();
        Product product = Product.builder().id(1L).name("T-Shirt").price(BigDecimal.valueOf(200.00)).stock(10).build();
        CartItemRequest req = CartItemRequest.builder().productId(1L).size("M").quantity(2).build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByUserAndProductAndSize(user, product, "M")).thenReturn(Optional.empty());

        CartItem savedItem = CartItem.builder().id(1L).user(user).product(product).size("M").quantity(2).build();
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(savedItem);
        when(cartItemRepository.findByUser(user)).thenReturn(List.of(savedItem));

        CartResponse res = cartService.addItemToCart(user, req);

        assertNotNull(res);
        assertEquals(1, res.getItems().size());
        assertEquals(0, BigDecimal.valueOf(400.00).compareTo(res.getTotalPrice()));
    }

    @Test
    void addItemToCartThrowsStockException() {
        User user = User.builder().id(1L).build();
        Product product = Product.builder().id(1L).name("T-Shirt").price(BigDecimal.valueOf(200.00)).stock(1).build();
        CartItemRequest req = CartItemRequest.builder().productId(1L).size("M").quantity(2).build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByUserAndProductAndSize(user, product, "M")).thenReturn(Optional.empty());

        assertThrows(ResourceConflictException.class, () -> cartService.addItemToCart(user, req));
    }
}
