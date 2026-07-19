package com.stayhome.repository;

import com.stayhome.entity.Role;
import com.stayhome.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> searchUsers(@Param("keyword") String keyword);

    long countByRole(Role role);

    List<User> findByRole(Role role);

    @Query("SELECT u FROM User u WHERE " +
            "(:role IS NULL OR u.role = :role) AND " +
            "(:keyword IS NULL OR :keyword = '' OR " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<User> searchAndFilterUsers(
            @Param("keyword") String keyword,
            @Param("role") Role role
    );
}
