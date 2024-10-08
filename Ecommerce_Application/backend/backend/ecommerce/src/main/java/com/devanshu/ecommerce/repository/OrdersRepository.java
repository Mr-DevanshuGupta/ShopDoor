package com.devanshu.ecommerce.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.devanshu.ecommerce.Enum.Status;
import com.devanshu.ecommerce.entity.Orders;
import com.devanshu.ecommerce.entity.User;

public interface OrdersRepository extends JpaRepository<Orders, Integer> {

	Page<Orders> findAll(Pageable p);

	@Query("SELECT o FROM Orders o WHERE o.user = :user AND (:statusEnum IS NULL OR o.status = :statusEnum)")
	List<Orders> findAllByUserAndStatus(User user, Status statusEnum, Pageable p);

	@Query("SELECT o FROM Orders o JOIN o.user u WHERE (:statusEnum IS NULL OR o.status = :statusEnum) "
			+ "AND (:keyword IS NULL OR u.email LIKE %:keyword% "
			+ "OR u.firstName LIKE %:keyword% OR u.lastName LIKE %:keyword% "
			+ "OR CAST(o.totalAmount AS string) LIKE %:keyword% " + "OR CAST(o.id AS string) LIKE %:keyword%)")
	Page<Orders> findAllByStatus(Pageable p, Status statusEnum, String keyword);

	@Query("SELECT COUNT(o) FROM Orders o JOIN o.user u WHERE (:statusEnum IS NULL OR o.status = :statusEnum) "
			+ "AND (:keyword IS NULL OR u.email LIKE %:keyword% "
			+ "OR u.firstName LIKE %:keyword% OR u.lastName LIKE %:keyword% "
			+ "OR CAST(o.totalAmount AS string) LIKE %:keyword% " + "OR CAST(o.id AS string) LIKE %:keyword%)")
	long countAllByStatus(Status statusEnum, String keyword);

}
