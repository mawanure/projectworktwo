package com.stayhome.repository;

import com.stayhome.entity.CartItem;
import com.stayhome.entity.Product;
import com.stayhome.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProductAndSize(User user, Product product, String size);
}
