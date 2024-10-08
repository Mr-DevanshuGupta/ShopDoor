package com.devanshu.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devanshu.ecommerce.dto.PaymentDTORequest;
import com.devanshu.ecommerce.entity.Payment;
import com.devanshu.ecommerce.services.PaymentService;

@RestController
@RequestMapping("/payment")
public class PaymentController {

	@Autowired
	private PaymentService paymentService;

	@PostMapping("/place")
	public ResponseEntity<HttpStatus> placeOrder(@RequestBody PaymentDTORequest request) {
		return paymentService.placeOrder(request);
	}

	@PostMapping("/addCard")
	public ResponseEntity<Payment> addCard(@RequestBody Payment payment) {
		return paymentService.addCard(payment);
	}

	@GetMapping("/allCards")
	public ResponseEntity<List<Payment>> getAll() {
		return paymentService.getAll();
	}
}
