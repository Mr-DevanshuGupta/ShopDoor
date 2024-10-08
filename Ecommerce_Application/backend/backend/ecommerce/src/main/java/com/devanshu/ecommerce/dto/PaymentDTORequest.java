package com.devanshu.ecommerce.dto;

import lombok.Data;

@Data
public class PaymentDTORequest {
	private Long amount;
	private String cardNumber;
	private Integer cvv;
}
