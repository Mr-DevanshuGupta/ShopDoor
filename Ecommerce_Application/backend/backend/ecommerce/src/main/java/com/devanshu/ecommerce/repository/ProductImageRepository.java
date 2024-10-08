package com.devanshu.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.ProductImages;

public interface ProductImageRepository extends JpaRepository<ProductImages, Integer> {
	List<ProductImages> findByProductId(Integer productId);

	List<ProductImages> findByProduct(Product product);

	void deleteAllByProduct(Product product);
}
