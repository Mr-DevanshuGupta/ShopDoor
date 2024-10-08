package com.devanshu.ecommerce.dto;

import java.util.List;

import com.devanshu.ecommerce.entity.Product;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductResponseDTO {
	private List<Product> products;
    private long totalItems;
}
