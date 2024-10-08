package com.devanshu.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devanshu.ecommerce.dto.ProductVariantDTORequest;
import com.devanshu.ecommerce.entity.ColorVariant;
import com.devanshu.ecommerce.entity.ProductVariant;
import com.devanshu.ecommerce.services.ProductVariantService;

@RestController
@RequestMapping("/variant")
public class ProductVariantController {
	@Autowired
	private ProductVariantService productVariantService;

	@PostMapping("/find")
	public ResponseEntity<ProductVariant> findProductVariant(@RequestBody ProductVariantDTORequest request) {
		return productVariantService.findProductVariant(request);
	}

	@GetMapping("/{variantId}")
	public ResponseEntity<ProductVariant> findByProductVariant(@PathVariable Integer variantId) {
		return productVariantService.findProductByVariant(variantId);
	}

	@GetMapping("/allColors")
	public ResponseEntity<List<ColorVariant>> getAllColors() {
		return productVariantService.findAllColors();
	}

	@GetMapping("/product/{productId}")
	public ResponseEntity<List<ProductVariant>> findAllVariants(@PathVariable Integer productId) {
		return productVariantService.findAllVariant(productId);
	}
}
