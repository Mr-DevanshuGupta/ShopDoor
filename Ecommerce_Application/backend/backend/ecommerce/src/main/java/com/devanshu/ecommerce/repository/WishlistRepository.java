package com.devanshu.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.User;
import com.devanshu.ecommerce.entity.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {

	List<Wishlist> findByUser(User user);

	Wishlist findByUserAndProduct(User user, Product product);

	void deleteAllByProduct(Product product);

}
