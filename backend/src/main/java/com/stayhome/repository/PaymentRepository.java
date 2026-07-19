package com.stayhome.repository;

import com.stayhome.entity.Payment;
import com.stayhome.entity.PaymentMethod;
import com.stayhome.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(Long orderId);

    @Query("SELECT p FROM Payment p WHERE " +
            "(:status IS NULL OR p.paymentStatus = :status) AND " +
            "(:method IS NULL OR p.paymentMethod = :method)")
    List<Payment> searchAndFilterPayments(
            @Param("status") PaymentStatus status,
            @Param("method") PaymentMethod method
    );
}
