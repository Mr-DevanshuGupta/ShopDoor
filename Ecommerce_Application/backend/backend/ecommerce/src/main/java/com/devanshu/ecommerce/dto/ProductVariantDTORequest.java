package com.devanshu.ecommerce.dto;

import lombok.Data;

@Data
public class ProductVariantDTORequest {
	private Integer productId;
	private Integer sizeVariantId;
	private Integer colorVariantId;
}
