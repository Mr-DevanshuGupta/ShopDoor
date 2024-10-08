package com.devanshu.ecommerce.exceptions;

public class AlreadyExists extends RuntimeException {
	private String message;

	public AlreadyExists() {
		super();
	}

	public AlreadyExists(String message) {
		super(message);
		this.message = message;
	}
}
