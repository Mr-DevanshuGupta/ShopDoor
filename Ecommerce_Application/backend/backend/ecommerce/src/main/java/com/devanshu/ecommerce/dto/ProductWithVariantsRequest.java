package com.devanshu.ecommerce.dto;

import java.util.List;

import com.devanshu.ecommerce.entity.Brand;

import lombok.Data;

@Data
public class ProductWithVariantsRequest {
	private String name;
    private double price;
    private String description;
    private Integer stockQuantity;
    private Brand brand;
    private ProductCategoryRequest category;

    private List<ProductSizeColorInventoryRequest> variants;

}
