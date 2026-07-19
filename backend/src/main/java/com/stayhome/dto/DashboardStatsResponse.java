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
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalCustomers;
    private long totalAdmins;
    private long totalCategories;
    private long totalProducts;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long pendingOrders;
    private long processingOrders;
    private long deliveredOrders;
    private long cancelledOrders;
    private long lowStockProducts;
    private long outOfStockProducts;
}
