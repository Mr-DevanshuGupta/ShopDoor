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

import com.devanshu.ecommerce.dto.WishlistDTO;
import com.devanshu.ecommerce.entity.Wishlist;
import com.devanshu.ecommerce.services.WishlistService;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {

	@Autowired
	private WishlistService wishlistService;

	@GetMapping("/add/{productId}/{userId}")
	public ResponseEntity<Wishlist> addToWishlist(@PathVariable Integer productId, @PathVariable Integer userId) {
		return wishlistService.addToWishlist(productId, userId);
	}

	@GetMapping("/{userId}")
	public ResponseEntity<List<Wishlist>> getAllOfUser(@PathVariable Integer userId) {
		return wishlistService.getAllProducts(userId);
	}

	@DeleteMapping("/{productId}/{userId}")
	public ResponseEntity<Wishlist> deleteWishlistItem(@PathVariable Integer productId, @PathVariable Integer userId) {
		return wishlistService.delete(productId, userId);
	}

	@GetMapping("/{productId}/{userId}")
	public boolean checkWishlistProduct(@PathVariable Integer productId, @PathVariable Integer userId) {
		return wishlistService.checkProduct(productId, userId);
	}

}
