package com.devanshu.ecommerce.dto;

import java.time.LocalDate;

import com.devanshu.ecommerce.Enum.Status;

import lombok.Data;

@Data
public class OrderUpdateDTO {
	
	private Status status;
	private Integer orderId;
	private LocalDate deliveredDate;
}
