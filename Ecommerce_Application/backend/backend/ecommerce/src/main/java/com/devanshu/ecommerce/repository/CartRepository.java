package com.devanshu.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devanshu.ecommerce.entity.Cart;
import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.ProductVariant;
import com.devanshu.ecommerce.entity.User;

public interface CartRepository extends JpaRepository<Cart, Integer> {

	List<Cart> findByUser(User user);

	Cart findByUserAndProductVariant(User user, ProductVariant variant);

	Cart findByUserAndProduct(User user, Product product);

	Cart findByUserAndProductVariantAndProduct(User user, ProductVariant variant, Product product);

	void deleteAllByProduct(Product product);

}
