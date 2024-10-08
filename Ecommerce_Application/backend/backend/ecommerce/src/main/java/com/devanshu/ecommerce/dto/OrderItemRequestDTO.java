package com.devanshu.ecommerce.dto;

import lombok.Data;

@Data
public class OrderItemRequestDTO {
	private Integer productId;
	private Integer variantId;
	private Integer orderId;
	private Integer quantity;
}
