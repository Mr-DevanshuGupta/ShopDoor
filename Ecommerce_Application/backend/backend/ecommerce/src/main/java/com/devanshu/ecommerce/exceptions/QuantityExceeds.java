package com.devanshu.ecommerce.exceptions;

public class QuantityExceeds extends RuntimeException {
	private String message;

	public QuantityExceeds() {
		super();
	}

	public QuantityExceeds(String message) {
		super(message);
		this.message = message;
	}
}
