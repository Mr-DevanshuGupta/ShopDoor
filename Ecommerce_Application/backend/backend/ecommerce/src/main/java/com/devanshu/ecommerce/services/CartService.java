package com.devanshu.ecommerce.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.dto.CartDTORequest;
import com.devanshu.ecommerce.entity.Cart;
import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.ProductVariant;
import com.devanshu.ecommerce.entity.User;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.exceptions.QuantityExceeds;
import com.devanshu.ecommerce.repository.CartRepository;
import com.devanshu.ecommerce.repository.ProductRepository;
import com.devanshu.ecommerce.repository.ProductVariantRepository;
import com.devanshu.ecommerce.repository.UserRepository;

@Service
public class CartService {

	@Autowired
	private CartRepository cartRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private ProductVariantRepository productVariantRepository;

	public ResponseEntity<List<Cart>> getAllProducts(Integer userId) {
		try {
			User user = userRepository.findById(userId).orElse(null);
			List<Cart> cartItems = cartRepository.findByUser(user);
			return new ResponseEntity<List<Cart>>(cartItems, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("User with this id is not exists");
		}

	}

	public ResponseEntity<HttpStatus> deleteFromCart(Integer userId, Integer variantId, Integer productId) {
		try {
			User user = userRepository.findById(userId).orElse(null);
			if (variantId != 0) {
				ProductVariant variant = productVariantRepository.findById(variantId).orElse(null);
				Product product = productRepository.findById(productId).orElse(null);
				Cart cart = cartRepository.findByUserAndProductVariantAndProduct(user, variant, product);
				System.out.println("This is the card tod elete " + cart);
				cartRepository.delete(cart);
				return new ResponseEntity<HttpStatus>(HttpStatus.ACCEPTED);
			} else {
				Product product = productRepository.findById(productId).orElse(null);
				Cart cart = cartRepository.findByUserAndProduct(user, product);
				cartRepository.delete(cart);
				return new ResponseEntity<HttpStatus>(HttpStatus.ACCEPTED);
			}
		} catch (Exception e) {
			System.out.println(e);
			throw new NoSuchExists("Product with this id does not found");
		}
	}

	public ResponseEntity<Cart> updateCart(CartDTORequest cartDTORequest) {
		try {
			User user = userRepository.findById(cartDTORequest.getUserId()).orElse(null);
			if (cartDTORequest.getVariantId() == 0) {
				Product product = productRepository.findById(cartDTORequest.getProductId()).orElse(null);
				Cart cart = cartRepository.findByUserAndProduct(user, product);
				cart.setQuantity(cartDTORequest.getQuantity());
				cartRepository.save(cart);
				return new ResponseEntity<Cart>(cart, HttpStatus.ACCEPTED);
			} else {
				ProductVariant productVariant = productVariantRepository.findById(cartDTORequest.getVariantId())
						.orElse(null);
				Product product = productRepository.findById(cartDTORequest.getProductId()).orElse(null);
				Cart cart = cartRepository.findByUserAndProductVariantAndProduct(user, productVariant, product);
				cart.setQuantity(cartDTORequest.getQuantity());
				cartRepository.save(cart);
				return new ResponseEntity<Cart>(cart, HttpStatus.ACCEPTED);
			}
		} catch (Exception e) {
			throw new NoSuchExists("Product or User with this id does not found");
		}
	}

	public ResponseEntity<Cart> addToCart(CartDTORequest cartDTORequest) {
		try {
			User user = userRepository.findById(cartDTORequest.getUserId()).orElse(null);
//	        Product product = productRepository.findById(cartDTORequest.getProductId()).orElse(null);
			if (cartDTORequest.getVariantId() == 0) {
				Product product = productRepository.findById(cartDTORequest.getProductId()).orElse(null);
				if (product.getStockQuantity() < cartDTORequest.getQuantity()) {
					throw new QuantityExceeds("This musch quantity is not present in stock");
				}

				Cart existingCart = cartRepository.findByUserAndProduct(user, product);
				Cart newCart = new Cart();

				if (existingCart != null) {
					int newQuantity = existingCart.getQuantity() + cartDTORequest.getQuantity();
					if (product.getStockQuantity() < newQuantity) {
						throw new QuantityExceeds("This much quantity is not present in stock");
					} else {
						existingCart.setQuantity(newQuantity);
						cartRepository.save(existingCart);
					}
				} else {
//		        	newCart.setProductVariant(variant);
					newCart.setProduct(product);
					newCart.setUser(user);
					newCart.setQuantity(cartDTORequest.getQuantity());
					cartRepository.save(newCart);

				}
				Cart updatedCart = existingCart != null ? existingCart : newCart;
				return new ResponseEntity<>(updatedCart, HttpStatus.ACCEPTED);
			} else {

				Product product = productRepository.findById(cartDTORequest.getProductId()).orElse(null);
				ProductVariant variant = productVariantRepository.findById(cartDTORequest.getVariantId()).orElse(null);

				if (variant == null || user == null) {
					throw new NoSuchExists("Product or User with this id does not exist");
				}

				if (variant.getQuantity() < cartDTORequest.getQuantity()) {
					throw new QuantityExceeds("This much quantity of this variant is not present in stock");
				}

				Cart existingCart = cartRepository.findByUserAndProductVariantAndProduct(user, variant, product);
				Cart newCart = new Cart();

				if (existingCart != null) {
					int newQuantity = existingCart.getQuantity() + cartDTORequest.getQuantity();
					if (variant.getQuantity() < newQuantity) {
						throw new QuantityExceeds("This much quantity is not present in stock");
					} else {
						existingCart.setQuantity(newQuantity);
						cartRepository.save(existingCart);
					}
				} else {
					newCart.setProductVariant(variant);
					newCart.setProduct(product);
					newCart.setUser(user);
					newCart.setQuantity(cartDTORequest.getQuantity());
					cartRepository.save(newCart);

				}
				Cart updatedCart = existingCart != null ? existingCart : newCart;
				return new ResponseEntity<>(updatedCart, HttpStatus.ACCEPTED);
			}

		} catch (NoSuchExists e) {
			throw e;
		} catch (QuantityExceeds e) {
			throw e;
		}
	}

}
