package com.devanshu.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devanshu.ecommerce.dto.OrderItemRequestDTO;
import com.devanshu.ecommerce.entity.OrderItems;
import com.devanshu.ecommerce.services.OrderItemsService;

@RestController
@RequestMapping("/order/items")
public class OrderItemsController {

	@Autowired
	private OrderItemsService orderItemsService;

	@GetMapping("/{orderId}")
	public ResponseEntity<List<OrderItems>> getAll(@PathVariable Integer orderId) {
		return orderItemsService.getAll(orderId);
	}

	@PostMapping("/")
	public ResponseEntity<OrderItems> addItem(@RequestBody OrderItemRequestDTO request) {
		return orderItemsService.addItem(request);
	}

	@DeleteMapping("/{orderId}")
	public ResponseEntity<HttpStatus> deleteItems(@PathVariable Integer orderId) {
		return orderItemsService.delete(orderId);
	}
}
