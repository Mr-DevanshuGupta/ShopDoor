package com.devanshu.ecommerce.dto;

import lombok.Data;

@Data
public class CategoryDTORequest {
private String name;
private String description;
private Integer parent_id;
}
