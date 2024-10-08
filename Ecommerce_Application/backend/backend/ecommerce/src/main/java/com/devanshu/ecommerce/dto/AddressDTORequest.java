package com.devanshu.ecommerce.dto;

import lombok.Data;

@Data
public class AddressDTORequest {
	private String street_address;
	private Integer cityId;
	private Integer stateId;
	private Integer countryId;
}
