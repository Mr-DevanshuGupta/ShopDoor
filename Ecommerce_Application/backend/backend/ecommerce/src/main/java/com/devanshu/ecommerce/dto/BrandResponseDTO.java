package com.devanshu.ecommerce.dto;

import java.util.List;

import com.devanshu.ecommerce.entity.Brand;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BrandResponseDTO {
	private List<Brand> brands;
	private long totalItems;
}
