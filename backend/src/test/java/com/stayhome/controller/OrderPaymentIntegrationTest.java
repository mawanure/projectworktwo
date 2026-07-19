package com.stayhome.controller;

import com.stayhome.dto.CheckoutPreviewResponse;
import com.stayhome.dto.CheckoutRequest;
import com.stayhome.dto.OrderResponse;
import com.stayhome.entity.User;
import com.stayhome.repository.UserRepository;
import com.stayhome.service.OrderService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderPaymentIntegrationTest {

    @Mock private OrderService orderService;
    @Mock private UserRepository userRepository;
    @InjectMocks private OrderController orderController;

    @Mock private SecurityContext securityContext;
    @Mock private Authentication authentication;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void checkoutPreviewIntegratesWithOrderService() {
        User user = User.builder().id(1L).email("user@example.com").build();
        when(authentication.getName()).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        CheckoutPreviewResponse previewResponse = CheckoutPreviewResponse.builder().build();
        when(orderService.getCheckoutPreview(user)).thenReturn(previewResponse);

        ResponseEntity<CheckoutPreviewResponse> response = orderController.getCheckoutPreview();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(previewResponse, response.getBody());
        verify(orderService).getCheckoutPreview(user);
    }

    @Test
    void placeOrderIntegratesWithOrderService() {
        User user = User.builder().id(1L).email("user@example.com").build();
        when(authentication.getName()).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        CheckoutRequest request = CheckoutRequest.builder().phone("01700000000").shippingAddress("Dhaka").build();
        OrderResponse orderResponse = OrderResponse.builder().id(100L).build();
        when(orderService.placeOrder(user, request)).thenReturn(orderResponse);

        ResponseEntity<OrderResponse> response = orderController.placeOrder(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(orderResponse, response.getBody());
        verify(orderService).placeOrder(user, request);
    }
}
