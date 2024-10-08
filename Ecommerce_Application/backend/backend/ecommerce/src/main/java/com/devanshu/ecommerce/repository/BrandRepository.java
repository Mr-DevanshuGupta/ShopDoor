package com.devanshu.ecommerce.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.devanshu.ecommerce.entity.Brand;
import com.devanshu.ecommerce.entity.ProductCategory;

public interface BrandRepository extends JpaRepository<Brand, Integer> {

	List<Brand> findAllByIsActive(boolean b);

	@Query("SELECT b FROM Brand b JOIN b.categories c WHERE c.id = :categoryId")
	List<Brand> findByCategoryId(Integer categoryId);

	@Query("SELECT c FROM ProductCategory c JOIN c.brands b WHERE b.id = :brandId")
	List<ProductCategory> findByBrandId(Integer brandId);

	@Query("SELECT COUNT(b) FROM Brand b")
	long countCategories();

	Page<Brand> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

}
