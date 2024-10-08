package com.devanshu.ecommerce.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.devanshu.ecommerce.Enum.Colors;
import com.devanshu.ecommerce.entity.ColorVariant;
import com.devanshu.ecommerce.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {

	List<Product> findByCategoryIdAndPriceBetween(Integer categoryId, double minPrice, double maxPrice, Pageable p);

	List<Product> findByCategoryId(Integer categoryId, Pageable p);

	List<Product> findByPriceBetween(double minPrice, double maxPrice, Pageable p);

	@Query("SELECT DISTINCT p FROM Product p " + "JOIN p.category c " + "JOIN p.variants pv "
			+ "JOIN pv.colorVariant cv " + "JOIN p.brand b " + "WHERE p.isActive = true " + "AND (:keyword IS NULL OR "
			+ "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
			+ "AND (:categoryId IS NULL OR p.category.id = :categoryId OR p.category.parent_id = :categoryId) "
			+ "AND (:brandId IS NULL OR p.brand.id = :brandId ) " + "AND (:minPrice IS NULL OR p.price >= :minPrice) "
			+ "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " + "AND (:color IS NULL OR cv.name = :color)")
	List<Product> findProductsWithFilters(Integer categoryId, Double minPrice, Double maxPrice, Pageable pageable,
			String color, String keyword, Integer brandId);

	@Query("SELECT p FROM Product p " + "JOIN p.category c " + "JOIN p.brand b " + "WHERE p.isActive = true "
			+ "AND (:keyword IS NULL OR " + "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
			+ "AND (:categoryId IS NULL OR p.category.id = :categoryId OR p.category.parent_id = :categoryId) "
			+ "AND (:brandId IS NULL OR p.brand.id = :brandId ) " + "AND (:minPrice IS NULL OR p.price >= :minPrice) "
			+ "AND (:maxPrice IS NULL OR p.price <= :maxPrice)")
	List<Product> findProductWithFiltersWithoutColor(Integer categoryId, Double minPrice, Double maxPrice,
			Pageable pageable, String keyword, Integer brandId);

	@Query("SELECT p FROM Product p " + "JOIN p.category c " + "WHERE p.isActive = true "
			+ "AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
	List<Product> searchByKeyword(String keyword, Pageable pageable);

	void deleteAllById(Integer id);

	Page<Product> findByActive(boolean b, Pageable p);

	@Query("SELECT COUNT(DISTINCT p.id) FROM Product p " + "JOIN p.category c " + "JOIN p.brand b "
			+ "WHERE p.isActive = true " + "AND (:keyword IS NULL OR "
			+ "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR "
			+ "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
			+ "AND (:categoryId IS NULL OR p.category.id = :categoryId OR p.category.parent_id = :categoryId) "
			+ "AND (:brandId IS NULL OR p.brand.id = :brandId) " + "AND (:minPrice IS NULL OR p.price >= :minPrice) "
			+ "AND (:maxPrice IS NULL OR p.price <= :maxPrice) ")
	long countFilteredProducts(Integer categoryId, Double minPrice, Double maxPrice, String keyword, Integer brandId);

}
