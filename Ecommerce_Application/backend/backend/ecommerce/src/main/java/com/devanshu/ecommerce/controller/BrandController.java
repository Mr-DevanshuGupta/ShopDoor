package com.devanshu.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.devanshu.ecommerce.dto.AddBrandDTO;
import com.devanshu.ecommerce.dto.BrandResponseDTO;
import com.devanshu.ecommerce.entity.Brand;
import com.devanshu.ecommerce.services.BrandService;

@RequestMapping("/brand")
@RestController
public class BrandController {

	@Autowired
	private BrandService brandService;

	@GetMapping("/")
	public ResponseEntity<List<Brand>> getAll() {
		return brandService.getAll();
	}

	@GetMapping("/paginated")
	public ResponseEntity<BrandResponseDTO> getAllPaginated(
			@RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) Integer pageSize,
			@RequestParam(value = "pageNumber", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) Integer pageNumber,
			@RequestParam(value = "keyword", required = false) String keyword) {
		return brandService.getAllPaginated(pageNumber - 1, pageSize, keyword);
	}

	@PostMapping("/")
	public ResponseEntity<Brand> add(@RequestBody AddBrandDTO request) {
		return brandService.add(request);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Brand> update(@PathVariable Integer id, @RequestBody AddBrandDTO request) {
		return brandService.update(id, request);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable Integer id) {
		return brandService.delete(id);
	}

	@GetMapping("/categories/{categoryId}")
	public ResponseEntity<List<Brand>> getByCategory(@PathVariable Integer categoryId) {
		return brandService.getByCategory(categoryId);
	}

}
