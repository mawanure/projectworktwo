package com.stayhome.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private String status;
    private BigDecimal subtotal;
    private BigDecimal deliveryCharge;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private String phone;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime orderDate;
    private LocalDateTime updatedAt;
    private List<OrderItemResponse> items;
}
