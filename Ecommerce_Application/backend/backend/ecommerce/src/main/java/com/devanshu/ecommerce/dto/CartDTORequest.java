package com.devanshu.ecommerce.dto;

import lombok.Data;

@Data
public class CartDTORequest {
	private Integer userId;
	private Integer quantity;
	private Integer productId;
	private Integer variantId;
}
