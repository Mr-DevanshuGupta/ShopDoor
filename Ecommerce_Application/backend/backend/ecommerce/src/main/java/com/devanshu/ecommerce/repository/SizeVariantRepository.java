package com.devanshu.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devanshu.ecommerce.entity.ProductCategory;
import com.devanshu.ecommerce.entity.SizeCategory;
import com.devanshu.ecommerce.entity.SizeVariant;

public interface SizeVariantRepository extends JpaRepository<SizeVariant, Integer> {

	List<SizeVariant> findBySizeCategory(SizeCategory sizeCategory);

}
