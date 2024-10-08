package com.devanshu.ecommerce.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.dto.WishlistDTO;
import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.User;
import com.devanshu.ecommerce.entity.Wishlist;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.repository.ProductRepository;
import com.devanshu.ecommerce.repository.UserRepository;
import com.devanshu.ecommerce.repository.WishlistRepository;

@Service
public class WishlistService {

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private WishlistRepository wishlistRepository;

	public ResponseEntity<Wishlist> addToWishlist(Integer productId, Integer userId) {
		try {

			Product product = productRepository.findById(productId).orElse(null);
			if (product == null) {
				throw new NoSuchExists("Product with this id does not exists");
			}
			Wishlist wishlist = new Wishlist();
			User user = userRepository.findById(userId).orElse(null);
			wishlist.setProduct(product);
			wishlist.setUser(user);
			wishlistRepository.save(wishlist);
			return new ResponseEntity<Wishlist>(wishlist, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			throw new NoSuchExists("Product with this id does not found");
		}
	}

	public ResponseEntity<List<Wishlist>> getAllProducts(Integer userId) {
		try {
			User user = userRepository.findById(userId).orElse(null);
			List<Wishlist> wishlistedItems = wishlistRepository.findByUser(user);
			return new ResponseEntity<List<Wishlist>>(wishlistedItems, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("User with this id is not exists");
		}
	}

	public ResponseEntity<Wishlist> delete(Integer productId, Integer userId) {
		try {
			Product product = productRepository.findById(productId).orElse(null);
			User user = userRepository.findById(userId).orElse(null);
			Wishlist wishlist = wishlistRepository.findByUserAndProduct(user, product);
			wishlistRepository.delete(wishlist);
			return new ResponseEntity<Wishlist>(wishlist, HttpStatus.ACCEPTED);
		} catch (Exception e) {
			throw new NoSuchExists("This wishlist item does not exists");
		}
	}

	public boolean checkProduct(Integer productId, Integer userId) {
		Product product = productRepository.findById(productId).orElse(null);
		User user = userRepository.findById(userId).orElse(null);
		Wishlist wishlist = wishlistRepository.findByUserAndProduct(user, product);
		if (wishlist != null) {
			return true;
		} else {
			return false;
		}
	}

}
