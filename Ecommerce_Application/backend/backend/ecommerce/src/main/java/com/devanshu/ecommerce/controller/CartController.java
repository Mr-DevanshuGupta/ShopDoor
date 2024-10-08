package com.devanshu.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devanshu.ecommerce.dto.CartDTORequest;
import com.devanshu.ecommerce.entity.Cart;
import com.devanshu.ecommerce.services.CartService;

@RestController
@RequestMapping("/Cart")
public class CartController {

	@Autowired
	private CartService cartService;

	@GetMapping("/{userId}")
	public ResponseEntity<List<Cart>> getAllOfUser(@PathVariable Integer userId) {
		return cartService.getAllProducts(userId);
	}

	@DeleteMapping("/{userId}/{variantId}/{productId}")
	public ResponseEntity<HttpStatus> deleteFromCartItems(@PathVariable Integer userId, @PathVariable Integer variantId,
			@PathVariable Integer productId) {
		return cartService.deleteFromCart(userId, variantId, productId);
	}

	@PostMapping("/")
	public ResponseEntity<Cart> addToCartVariant(@RequestBody CartDTORequest cartDTORequest) {
		return cartService.addToCart(cartDTORequest);
	}

	@PutMapping("/")
	public ResponseEntity<Cart> updateCart(@RequestBody CartDTORequest cartDTORequest) {
		return cartService.updateCart(cartDTORequest);
	}
}
