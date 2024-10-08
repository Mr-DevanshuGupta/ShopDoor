package com.devanshu.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.devanshu.ecommerce.dto.RatingAndReviewDTO;
import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.RatingAndReview;

public interface RatingAndReviewRepository extends JpaRepository<RatingAndReview, Integer> {

	RatingAndReview save(RatingAndReviewDTO review);

	List<RatingAndReview> findByProduct(Product product);

	@Query("Select AVG(e.ratingValue) from RatingAndReview e where e.product = ?1")
	Double getAverage(Product productToFind);

	void deleteAllByProduct(Product product);

}
