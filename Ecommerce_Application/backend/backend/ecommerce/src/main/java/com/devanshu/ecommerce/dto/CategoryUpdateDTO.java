package com.devanshu.ecommerce.dto;

import lombok.Data;

@Data
public class CategoryUpdateDTO {
	private String name;
	private String description;
	private Integer parent_id;
	
}
