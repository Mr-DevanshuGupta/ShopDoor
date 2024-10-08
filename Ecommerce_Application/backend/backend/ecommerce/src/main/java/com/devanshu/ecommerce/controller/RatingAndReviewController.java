package com.devanshu.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devanshu.ecommerce.dto.RatingAndReviewDTO;
import com.devanshu.ecommerce.dto.RatingAndReviewUpdateDTO;
import com.devanshu.ecommerce.entity.RatingAndReview;
import com.devanshu.ecommerce.services.RatingAndReviewService;

@RestController
@RequestMapping("/ratings")
public class RatingAndReviewController {

	@Autowired
	private RatingAndReviewService ratingAndReviewService;

	@GetMapping("/{id}")
	public ResponseEntity<RatingAndReview> getRatingAndReviews(@PathVariable Integer id) {
		RatingAndReview ratings = ratingAndReviewService.getRatings(id);
		return new ResponseEntity<RatingAndReview>(ratings, HttpStatus.FOUND);
	}

	@PostMapping("/")
	public ResponseEntity<RatingAndReview> addRating(@RequestBody RatingAndReviewDTO ratingAndReview) {
		RatingAndReview rating = ratingAndReviewService.saveReview(ratingAndReview);
		return new ResponseEntity<RatingAndReview>(rating, HttpStatus.OK);
	}

	@GetMapping("/all/{productId}")
	public ResponseEntity<List<RatingAndReview>> getAllRatingsOfProduct(@PathVariable Integer productId) {
		List<RatingAndReview> ratings = ratingAndReviewService.getAllFromProductId(productId);
		return new ResponseEntity<>(ratings, HttpStatus.OK);
	}

	@PutMapping("/{id}")
	public ResponseEntity<RatingAndReview> updateRatings(@PathVariable Integer id,
			@RequestBody RatingAndReviewUpdateDTO ratingAndReviewUpdateDTO) {
		RatingAndReview rating = ratingAndReviewService.update(id, ratingAndReviewUpdateDTO);
		return new ResponseEntity<RatingAndReview>(rating, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Object> deleteRatings(@PathVariable Integer id) {
		return ratingAndReviewService.delete(id);
	}

	@GetMapping("/average/{productId}")
	public ResponseEntity<Double> averageRating(@PathVariable Integer productId) {
		return ratingAndReviewService.getAverageRating(productId);
	}

}
