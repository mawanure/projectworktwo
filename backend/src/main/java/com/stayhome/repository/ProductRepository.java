package com.stayhome.repository;

import com.stayhome.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Public-facing: active products only
    List<Product> findByIsActiveTrue();
    List<Product> findByIsFeaturedTrueAndIsActiveTrue();
    List<Product> findByIsNewArrivalTrueAndIsActiveTrueOrderByCreatedAtDesc();
    Optional<Product> findByIdAndIsActiveTrue(Long id);
    List<Product> findTop4ByCategoryIdAndIdNotAndIsActiveTrue(Long categoryId, Long productId);

    // Admin-facing: all products regardless of active state
    List<Product> findByIsFeaturedTrue();
    List<Product> findByIsNewArrivalTrueOrderByCreatedAtDesc();
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<Product> findTop4ByCategoryIdAndIdNot(Long categoryId, Long productId);

    // Public search: active only
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId)")
    Page<Product> searchActiveProducts(@Param("search") String search, @Param("categoryId") Long categoryId, Pageable pageable);

    // Admin search: all products
    @Query("SELECT p FROM Product p WHERE " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId)")
    Page<Product> searchProducts(@Param("search") String search, @Param("categoryId") Long categoryId, Pageable pageable);

    long countByStockLessThanEqualAndStockGreaterThan(Integer maxStock, Integer minStock);
    long countByStock(Integer stock);
}
