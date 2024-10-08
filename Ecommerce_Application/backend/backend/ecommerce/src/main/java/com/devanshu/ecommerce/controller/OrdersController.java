package com.devanshu.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devanshu.ecommerce.config.AppConstants;
import com.devanshu.ecommerce.dto.OrderRequestDTO;
import com.devanshu.ecommerce.dto.OrderResponseDTO;
import com.devanshu.ecommerce.dto.OrderUpdateDTO;
import com.devanshu.ecommerce.entity.Orders;
import com.devanshu.ecommerce.services.OrdersService;

@RestController
@RequestMapping("/orders")
public class OrdersController {

	@Autowired
	private OrdersService ordersService;

	@GetMapping("/{userId}")
	public ResponseEntity<List<Orders>> getAllOrders(@PathVariable Integer userId,
			@RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) Integer pageSize,
			@RequestParam(value = "pageNumber", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) Integer pageNumber,
			@RequestParam(value = "sortDescending", defaultValue = "false", required = false) Boolean sortDescending,
			@RequestParam(value = "status", required = false) String status,
			@RequestParam(value = "email", required = false) String email) {
		return ordersService.getAll(userId, pageSize, pageNumber - 1, sortDescending, status, email);
	}

	@PostMapping("/{userId}")
	public ResponseEntity<Orders> addOrder(@PathVariable Integer userId, @RequestBody OrderRequestDTO request) {
		return ordersService.add(userId, request);
	}

	@PutMapping("/")
	public ResponseEntity<Orders> updateOrder(@RequestBody OrderUpdateDTO request) {
		return ordersService.update(request);
	}

	@DeleteMapping("/{orderId}")
	public ResponseEntity<Orders> deleteOrder(@PathVariable Integer orderId) {
		return ordersService.delete(orderId);
	}

	@GetMapping("/")
	public ResponseEntity<OrderResponseDTO> getAll(
			@RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) Integer pageSize,
			@RequestParam(value = "pageNumber", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) Integer pageNumber,
			@RequestParam(value = "sortDescending", defaultValue = "false", required = false) Boolean sortDescending,
			@RequestParam(value = "status", required = false) String status,
			@RequestParam(value = "keyword", required = false) String keyword) {
		return ordersService.getAllOrders(pageSize, pageNumber - 1, sortDescending, status, keyword);
	}
}
