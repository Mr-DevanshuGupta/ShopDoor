package com.devanshu.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devanshu.ecommerce.config.AppConstants;
import com.devanshu.ecommerce.dto.CategoryDTORequest;
import com.devanshu.ecommerce.dto.CategoryResponseDTO;
import com.devanshu.ecommerce.dto.CategoryUpdateDTO;
import com.devanshu.ecommerce.entity.ProductCategory;
import com.devanshu.ecommerce.services.ProductCategoryService;

@RestController
@RequestMapping("/categories")
public class ProductCategoryController {
	@Autowired
	private ProductCategoryService service;

	@PostMapping("/")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ProductCategory> addCategory(@RequestBody CategoryDTORequest category) {
		ProductCategory createdCategory = service.addCategory(category);
		return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProductCategory> getCategory(@PathVariable Integer id) {
		ProductCategory category = service.getCategory(id);
		if (category != null) {

			return new ResponseEntity<ProductCategory>(category, HttpStatus.FOUND);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/")
	public ResponseEntity<CategoryResponseDTO> getAll(
			@RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) Integer pageSize,
			@RequestParam(value = "pageNumber", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) Integer pageNumber,
			@RequestParam(value = "keyword", required = false) String keyword) {
		return service.getAll(pageSize, pageNumber - 1, keyword);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProductCategory> updateCategory(@PathVariable Integer id,
			@RequestBody CategoryUpdateDTO dto) {
		ProductCategory category = service.updateCategory(dto, id);
		return new ResponseEntity<>(category, HttpStatus.OK);
	}

	@GetMapping("/name/{name}")
	public ResponseEntity<ProductCategory> getCategoryByName(@PathVariable String name) {
		ProductCategory category = service.getCategoryByName(name);
		return new ResponseEntity<>(category, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ProductCategory> deleteCategory(@PathVariable Integer id) {
		return service.deleteCategory(id);
	}

	@GetMapping("/brand/{brandId}")
	public ResponseEntity<List<ProductCategory>> getCategoriesByBrand(@PathVariable Integer brandId) {
		return service.getCategoriesByBrand(brandId);
	}

	@GetMapping("/all")
	public ResponseEntity<List<ProductCategory>> getAll() {
		return service.getAllCategories();
	}
}
