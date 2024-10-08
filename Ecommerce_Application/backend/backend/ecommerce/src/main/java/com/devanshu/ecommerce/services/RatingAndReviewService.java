package com.devanshu.ecommerce.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.dto.RatingAndReviewDTO;
import com.devanshu.ecommerce.dto.RatingAndReviewUpdateDTO;
import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.RatingAndReview;
import com.devanshu.ecommerce.entity.User;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.repository.ProductRepository;
import com.devanshu.ecommerce.repository.RatingAndReviewRepository;
import com.devanshu.ecommerce.repository.UserRepository;

@Service
public class RatingAndReviewService {

	@Autowired
	public RatingAndReviewRepository ratingAndReviewRepository;

	@Autowired
	public ProductRepository productRepository;

	@Autowired
	public UserRepository userRepository;

	public RatingAndReview saveReview(RatingAndReviewDTO requestDTO) {

		Product product = productRepository.findById(requestDTO.getProductId()).orElse(null);

		User user = userRepository.findById(requestDTO.getUserId()).orElse(null);

		RatingAndReview ratingAndReview = new RatingAndReview();
		ratingAndReview.setProduct(product);
		ratingAndReview.setUser(user);
		ratingAndReview.setRatingValue(requestDTO.getRatingValue());
		ratingAndReview.setReview(requestDTO.getReview());

		return ratingAndReviewRepository.save(ratingAndReview);
	}

	public RatingAndReview getRatings(Integer id) {
		return ratingAndReviewRepository.findById(id).orElse(null);
	}

	public List<RatingAndReview> getAllFromProductId(Integer productId) {
		Product product = productRepository.findById(productId).orElse(null);
		return ratingAndReviewRepository.findByProduct(product);
	}

	public RatingAndReview update(Integer id, RatingAndReviewUpdateDTO ratingAndReviewUpdateDTO) {
		RatingAndReview rating = ratingAndReviewRepository.findById(id).orElse(null);
		rating.setRatingValue(ratingAndReviewUpdateDTO.getRatingValue());
		rating.setReview(ratingAndReviewUpdateDTO.getReview());
		return ratingAndReviewRepository.save(rating);
	}

	public ResponseEntity<Object> delete(Integer id) {
		RatingAndReview rating = ratingAndReviewRepository.findById(id).orElse(null);
		if (rating == null) {
			return new ResponseEntity<Object>(HttpStatus.BAD_REQUEST);
		} else {
			ratingAndReviewRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.ACCEPTED);
		}
	}

	public ResponseEntity<Double> getAverageRating(Integer productId) {
		Product productToFind = productRepository.findById(productId).orElse(null);
		if (productToFind != null) {
			Double average = ratingAndReviewRepository.getAverage(productToFind);
			return new ResponseEntity<Double>(average, HttpStatus.OK);
		} else {
			throw new NoSuchExists("Product with this id does not exists");
		}
	}

}
