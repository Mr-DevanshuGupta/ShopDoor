package com.devanshu.ecommerce.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.devanshu.ecommerce.entity.ProductCategory;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Integer> {

	ProductCategory findByName(String name);

	@Query("SELECT c FROM ProductCategory c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
	Page<ProductCategory> searchCategories(String keyword, Pageable pageable);

	@Query("SELECT COUNT(c) FROM ProductCategory c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
	long countCategoriesByKeyword(String keyword);

	@Query("SELECT COUNT(c) FROM ProductCategory c")
	long countCategories();
}
