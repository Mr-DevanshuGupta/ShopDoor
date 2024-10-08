package com.devanshu.ecommerce.dto;

import java.util.Set;

import lombok.Data;

@Data
public class AddBrandDTO {
	private String name; 
	private String tagLine;
	private Set<Integer> categoryIds;
}
