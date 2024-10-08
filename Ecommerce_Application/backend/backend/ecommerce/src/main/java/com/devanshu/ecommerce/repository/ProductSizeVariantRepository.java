package com.devanshu.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devanshu.ecommerce.entity.SizeVariant;
import com.devanshu.ecommerce.entity.ProductVariant;

public interface ProductSizeVariantRepository extends JpaRepository<ProductVariant, Integer> {

	void save(SizeVariant sizeVariant);

}
