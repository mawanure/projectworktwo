package com.stayhome.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistItemResponse {
    private Long id;
    private ProductSummaryResponse product;
    private LocalDateTime addedAt;
}
