package com.devanshu.ecommerce.dto;

import lombok.Data;

@Data
public class ProductSizeColorInventoryRequest {
	private Integer sizeVariantId; 
    private Integer colorVariantId;
    private Integer quantity;
}
