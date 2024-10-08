package com.devanshu.ecommerce.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.devanshu.ecommerce.dto.ProductResponseDTO;
import com.devanshu.ecommerce.dto.ProductWithVariantsRequest;
import com.devanshu.ecommerce.entity.ColorVariant;
import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.SizeVariant;
import com.devanshu.ecommerce.services.ProductService;

@RestController
@RequestMapping("/products")
//@PreAuthorize("hasRole('ADMIN')")
public class ProductController {
	@Autowired
	private ProductService productService;

	@GetMapping("/allFiltered")
	public ProductResponseDTO getProducts(@RequestParam(value = "categoryId", required = false) Integer categoryId,
			@RequestParam(value = "minPrice", required = false, defaultValue = AppConstants.DEFAULT_MIN_PRICE) Double minPrice,
			@RequestParam(value = "maxPrice", required = false) Double maxPrice,
			@RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) Integer pageSize,
			@RequestParam(value = "pageNumber", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) Integer pageNumber,
			@RequestParam(value = "color", required = false) String color,
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "brandId", required = false) Integer brandId) {
		ProductResponseDTO products = productService.getFilteredProducts(categoryId, minPrice, maxPrice, pageNumber - 1,
				pageSize, color, keyword, brandId);
		System.out.println("This is response of fetching products " + products);
		return products;
	}

	@GetMapping("/{id}")
	public Optional<Product> getProductById(@PathVariable Integer id) {
		return productService.getProductById(id);
	}

//	@PostMapping("/")
//	public Product addProduct(@RequestBody ProductWithVariantsRequest request) {
//		Product product = request.getProduct();
//        Set<SizeVariant> sizeVariants = request.getSizeVariants();
////		return productService.addProduct(request);
//        return productService.createProductWithSizeVariantsAndColors(product, sizeVariants);
//	}

	@PostMapping("/add")
	public ResponseEntity<Product> addProduct(@RequestBody ProductWithVariantsRequest productRequest) {
		return productService.addProductWithVariants(productRequest);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Product> updateProduct(@PathVariable Integer id,
			@RequestBody ProductWithVariantsRequest product) {
		return productService.updateProduct(id, product);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Product> deleteProduct(@PathVariable Integer id) {
		return productService.deleteProduct(id);
	}

	@GetMapping("/colors/{productId}")
	public List<ColorVariant> getColors(@PathVariable Integer productId) {
		return productService.getColors(productId);
	}

	@GetMapping("/sizes/{productId}")
	public List<SizeVariant> getSizes(@PathVariable Integer productId) {
		return productService.getSizes(productId);
	}

	@GetMapping("/all")
	public List<Product> getAllProducts() {
		return productService.getAllWithoutFilters();
	}

	@GetMapping("/search")
	public List<Product> getSearchedProduct(@RequestParam String keyword,
			@RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) Integer pageSize,
			@RequestParam(value = "pageNumber", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) Integer pageNumber) {
		return productService.getAllSearchedProduct(keyword, pageNumber - 1, pageSize);
	}
}
