package com.devanshu.ecommerce.dto;

import java.util.List;

import com.devanshu.ecommerce.entity.Orders;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderResponseDTO {
	private List<Orders> orders;
	private long totalItems;
}
