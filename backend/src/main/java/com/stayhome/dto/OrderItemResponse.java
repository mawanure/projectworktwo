package com.stayhome.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {
    private Long id;
    private ProductSummaryResponse product;
    private String size;
    private Integer quantity;
    private BigDecimal price;       // Snapshotted unit price at order time
    private BigDecimal subTotal;
}
