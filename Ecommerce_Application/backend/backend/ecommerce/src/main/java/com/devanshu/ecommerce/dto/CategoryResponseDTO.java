package com.devanshu.ecommerce.dto;

import java.util.List;

import com.devanshu.ecommerce.entity.ProductCategory;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryResponseDTO {
	private List<ProductCategory> categories;
	private long totalItems;
}
