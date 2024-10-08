package com.devanshu.ecommerce.Enum;

import java.util.Set;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Status {
	Ordered,
	Dispatched,
	Delivered, 
	Cancelled
}
