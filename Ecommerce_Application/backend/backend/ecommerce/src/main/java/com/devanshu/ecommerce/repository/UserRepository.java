package com.devanshu.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.devanshu.ecommerce.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

	Optional<User> findByEmail(String username);

	Page<User> findByIsActive(boolean b, Pageable pageable);

	@Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
	long countActiveUsers();

	@Query("SELECT u FROM User u WHERE u.isActive = true AND "
			+ "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
	Page<User> searchActiveUsers(String keyword, Pageable pageable);

	@Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true AND "
			+ "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
	long countActiveUsersByKeyword(String keyword);
}
