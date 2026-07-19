package com.stayhome.repository;

import com.stayhome.entity.Order;
import com.stayhome.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByOrderDateDesc(User user);
    List<Order> findAllByOrderByOrderDateDesc();

    long countByStatus(com.stayhome.entity.OrderStatus status);
    long countByOrderDateBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != 'CANCELLED'")
    java.math.BigDecimal calculateTotalRevenue();

    @org.springframework.data.jpa.repository.Query("SELECT o FROM Order o WHERE " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:userId IS NULL OR o.user.id = :userId) AND " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(o.shippingAddress) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(o.phone) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "CAST(o.id AS string) LIKE CONCAT('%', :search, '%'))")
    List<Order> searchAndFilterOrders(
            @org.springframework.data.repository.query.Param("status") com.stayhome.entity.OrderStatus status,
            @org.springframework.data.repository.query.Param("userId") Long userId,
            @org.springframework.data.repository.query.Param("search") String search
    );
}
