package com.devanshu.ecommerce.exceptions;

import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import jakarta.persistence.NonUniqueResultException;

@ControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(AlreadyExists.class)
	public ResponseEntity<String> handleUserAlreadyExists(AlreadyExists ex, WebRequest request) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
	}

	@ExceptionHandler(NoSuchExists.class)
	public ResponseEntity<String> handleNoSuchExists(NoSuchExists ex, WebRequest request) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
	}
	
	@ExceptionHandler(QuantityExceeds.class)
	public ResponseEntity<String> handleQuantityExceeds(QuantityExceeds ex, WebRequest request){
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}

	@ExceptionHandler(NonUniqueResultException.class)
	public ResponseEntity<String> handleNoUnique(NonUniqueResultException ex, WebRequest request) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}
	
	@ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(BadCredentialsException ex, WebRequest request) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }

	@ExceptionHandler(IncorrectResultSizeDataAccessException.class)
	public ResponseEntity<String> handleNoUnique(IncorrectResultSizeDataAccessException ex, WebRequest request) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}
}
