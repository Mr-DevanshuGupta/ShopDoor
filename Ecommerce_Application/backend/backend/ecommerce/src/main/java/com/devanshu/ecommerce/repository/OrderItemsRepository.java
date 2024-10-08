package com.devanshu.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devanshu.ecommerce.entity.OrderItems;
import com.devanshu.ecommerce.entity.Orders;

public interface OrderItemsRepository extends JpaRepository<OrderItems, Integer> {

	List<OrderItems> findAllByOrder(Orders order);

	void deleteAllByOrder(Orders order);

}
