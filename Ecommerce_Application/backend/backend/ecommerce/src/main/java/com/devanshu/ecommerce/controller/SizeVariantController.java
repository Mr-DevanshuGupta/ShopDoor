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

import com.devanshu.ecommerce.dto.SizeVariantDTO;
import com.devanshu.ecommerce.entity.SizeCategory;
import com.devanshu.ecommerce.entity.SizeVariant;
import com.devanshu.ecommerce.services.SizeCategoryService;
import com.devanshu.ecommerce.services.SizeVariantService;

@RestController
@RequestMapping("/sizes")
public class SizeVariantController {

	@Autowired
	private SizeVariantService sizeVariantService;

	@Autowired
	private SizeCategoryService sizeCategoryService;

	@GetMapping("/{sizeCategoryId}")
	public List<SizeVariant> getSizesByCategoryId(@PathVariable Integer sizeCategoryId) {
		return sizeVariantService.getSizes(sizeCategoryId);
	}

	@PostMapping("/add/sizeCategory")
	public ResponseEntity<SizeCategory> addSizeCategory(@RequestBody SizeCategory sizeCategory) {
		return sizeCategoryService.addSizeCategory(sizeCategory);
	}

	@PostMapping("/add/sizeValues")
	public ResponseEntity<SizeVariant> addSizeValues(@RequestBody SizeVariant sizeVariant) {
		return sizeVariantService.addSizeValues(sizeVariant);
	}

	@GetMapping("/getAll")
	public ResponseEntity<List<SizeCategory>> getAll() {
		return sizeVariantService.getAll();
	}
}
