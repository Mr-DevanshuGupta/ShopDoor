package com.devanshu.ecommerce.dto;

import com.devanshu.ecommerce.Enum.PaymentENUM;
import com.devanshu.ecommerce.Enum.Status;

import lombok.Data;


@Data
public class OrderRequestDTO {
	
	private Integer totalAmount;
	private Integer addressId;
	private PaymentENUM payment;
}
