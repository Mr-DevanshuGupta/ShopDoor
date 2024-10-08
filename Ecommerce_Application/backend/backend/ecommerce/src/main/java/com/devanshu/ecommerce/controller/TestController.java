package com.devanshu.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {
	@GetMapping("/d")
	public ResponseEntity<String> sayHello() {
		return ResponseEntity.ok("hello from test controller");
	}
}
