package com.stayhome.service;

import com.stayhome.entity.CartItem;
import com.stayhome.entity.Product;
import com.stayhome.entity.User;
import com.stayhome.exception.ResourceConflictException;
import com.stayhome.repository.CartItemRepository;
import com.stayhome.repository.OrderRepository;
import com.stayhome.repository.PaymentRepository;
import com.stayhome.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private CartItemRepository cartItemRepository;
    @Mock private ProductRepository productRepository;
    @Mock private PaymentRepository paymentRepository;
    @InjectMocks private OrderService orderService;

    @Test
    void addsDeliveryChargeBelowFreeDeliveryThreshold() {
        User user = User.builder().id(1L).build();
        Product product = Product.builder().id(1L).name("T-Shirt").price(new BigDecimal("300.00")).build();
        when(cartItemRepository.findByUser(user)).thenReturn(List.of(CartItem.builder().product(product).size("M").quantity(2).build()));

        var preview = orderService.getCheckoutPreview(user);

        assertEquals(0, new BigDecimal("600.00").compareTo(preview.getSubtotal()));
        assertEquals(0, new BigDecimal("60.00").compareTo(preview.getDeliveryCharge()));
        assertEquals(0, new BigDecimal("660.00").compareTo(preview.getTotalAmount()));
    }

    @Test
    void doesNotChargeDeliveryForOrdersAtThreshold() {
        User user = User.builder().id(1L).build();
        Product product = Product.builder().id(1L).name("Jacket").price(new BigDecimal("500.00")).build();
        when(cartItemRepository.findByUser(user)).thenReturn(List.of(CartItem.builder().product(product).size("L").quantity(2).build()));

        var preview = orderService.getCheckoutPreview(user);

        assertEquals(0, BigDecimal.ZERO.compareTo(preview.getDeliveryCharge()));
        assertEquals(0, new BigDecimal("1000.00").compareTo(preview.getTotalAmount()));
    }

    @Test
    void rejectsCheckoutPreviewForEmptyCart() {
        User user = User.builder().id(1L).build();
        when(cartItemRepository.findByUser(user)).thenReturn(List.of());

        assertThrows(ResourceConflictException.class, () -> orderService.getCheckoutPreview(user));
    }
}
