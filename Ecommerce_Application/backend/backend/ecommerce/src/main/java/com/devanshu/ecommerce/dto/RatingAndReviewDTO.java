package com.devanshu.ecommerce.dto;

import lombok.Data;

@Data
public class RatingAndReviewDTO {
	private Integer productId;
    private Integer userId;
    private Integer ratingValue;
    private String review;
}
