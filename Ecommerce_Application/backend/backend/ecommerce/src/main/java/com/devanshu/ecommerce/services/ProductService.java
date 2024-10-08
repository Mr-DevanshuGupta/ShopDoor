package com.devanshu.ecommerce.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.dto.ProductResponseDTO;
import com.devanshu.ecommerce.dto.ProductSizeColorInventoryRequest;
import com.devanshu.ecommerce.dto.ProductWithVariantsRequest;
import com.devanshu.ecommerce.entity.Brand;
import com.devanshu.ecommerce.entity.ColorVariant;
import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.ProductCategory;
import com.devanshu.ecommerce.entity.ProductVariant;
import com.devanshu.ecommerce.entity.SizeVariant;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.repository.BrandRepository;
import com.devanshu.ecommerce.repository.CartRepository;
import com.devanshu.ecommerce.repository.ColorVariantRepository;
import com.devanshu.ecommerce.repository.ProductCategoryRepository;
import com.devanshu.ecommerce.repository.ProductImageRepository;
import com.devanshu.ecommerce.repository.ProductRepository;
import com.devanshu.ecommerce.repository.ProductSizeVariantRepository;
import com.devanshu.ecommerce.repository.ProductVariantRepository;
import com.devanshu.ecommerce.repository.RatingAndReviewRepository;
import com.devanshu.ecommerce.repository.SizeVariantRepository;
import com.devanshu.ecommerce.repository.WishlistRepository;

import jakarta.transaction.Transactional;

@Service
public class ProductService {
	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private ProductSizeVariantRepository productSizeVariantRepository;

	@Autowired
	private ProductCategoryRepository productCategoryRepository;

	@Autowired
	private SizeVariantRepository sizeVariantRepository;

	@Autowired
	private BrandRepository brandRepository;

	@Autowired
	private ColorVariantRepository colorVariantRepository;

	@Autowired
	private ProductVariantRepository productVariantRepository;

	@Autowired
	private RatingAndReviewRepository ratingAndReviewRepository;

	@Autowired
	private CartRepository cartRepository;

	@Autowired
	private ProductImageRepository productImageRepository;

	@Autowired
	private WishlistRepository wishlistRepository;

	public List<Product> getAllProducts(Integer categoryId, double minPrice, double maxPrice, Integer pageNumber,
			Integer pageSize) {
		Pageable p = PageRequest.of(pageNumber, pageSize);
		return productRepository.findByCategoryIdAndPriceBetween(categoryId, minPrice, maxPrice, p);
	}

	public Optional<Product> getProductById(Integer id) {
		return productRepository.findById(id);
	}

	public Product addProduct(Product product) {
		return productRepository.save(product);
	}

	@Transactional
	public ResponseEntity<Product> updateProduct(Integer id, ProductWithVariantsRequest product) {
		if (productRepository.existsById(id)) {
			Product productToUpdate = productRepository.findById(id).orElse(null);
			ProductCategory category = productCategoryRepository.findById(product.getCategory().getId())
					.orElseThrow(() -> new RuntimeException("Category not found"));
			Brand productBrand = brandRepository.findById(product.getBrand().getId())
					.orElseThrow(() -> new RuntimeException("Brand not found "));
			productToUpdate.setName(product.getName());
			productToUpdate.setDescription(product.getDescription());
			productToUpdate.setCategory(category);
			productToUpdate.setPrice(product.getPrice());
			productToUpdate.setStockQuantity(product.getStockQuantity());
			productToUpdate.setBrand(productBrand);

			productToUpdate = productRepository.save(productToUpdate);

			if (product.getVariants() != null) {

//				productVariantRepository.deleteAllByProduct(productToUpdate);
				productVariantRepository.deactivateAllVariantsByProduct(id);
//				List<ProductVariant> productVariant = productVariantRepository.findAllByProduct(productToUpdate);

				for (ProductSizeColorInventoryRequest inventoryRequest : product.getVariants()) {
					ProductVariant inventory = new ProductVariant();
					inventory.setProduct(productToUpdate);
					if (inventoryRequest.getSizeVariantId() != null) {
						SizeVariant sizeVariant = sizeVariantRepository.findById(inventoryRequest.getSizeVariantId())
								.orElse(null);
						inventory.setSizeVariant(sizeVariant);
					}
					if (inventoryRequest.getColorVariantId() != null) {
						ColorVariant colorVariant = colorVariantRepository
								.findById(inventoryRequest.getColorVariantId()).orElse(null);
						inventory.setColorVariant(colorVariant);
					}

					inventory.setQuantity(inventoryRequest.getQuantity());

					productVariantRepository.save(inventory);
				}
			}
			return new ResponseEntity<Product>(productToUpdate, HttpStatus.OK);
		} else {
			throw new NoSuchExists("Product with this id does not exists");
		}
	}

	@Transactional
	public ResponseEntity<Product> deleteProduct(Integer id) {
		try {
			Product product = productRepository.findById(id).orElse(null);
			product.setActive(false);
			return new ResponseEntity<Product>(product, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("Product with this id does not exists " + e.getMessage());
		}
	}

	public List<Product> getAll(Integer pageNumber, Integer pageSize) {

		Pageable p = PageRequest.of(pageNumber, pageSize);
		Page<Product> pageProduct = productRepository.findByActive(true, p);
		return pageProduct.getContent();
	}

	public List<Product> getAllFromCategory(Integer categoryId, Integer pageNumber, Integer pageSize) {
		Pageable p = PageRequest.of(pageNumber, pageSize);

		return productRepository.findByCategoryId(categoryId, p);

	}

	public List<Product> getAllFromPrice(double minPrice, double maxPrice, Integer pageNumber, Integer pageSize) {
		Pageable p = PageRequest.of(pageNumber, pageSize);
		return productRepository.findByPriceBetween(minPrice, maxPrice, p);

	}

	public ProductResponseDTO getFilteredProducts(Integer categoryId, Double minPrice, Double maxPrice,
			Integer pageNumber, Integer pageSize, String color, String keyword, Integer brandId) {
		Pageable pageable = PageRequest.of(pageNumber, pageSize);
		System.out.println("Color is this : " + color);
		List<Product> products;
		if (color != null) {
			products = productRepository.findProductsWithFilters(categoryId, minPrice, maxPrice, pageable, color,
					keyword, brandId);
		} else {
			products = productRepository.findProductWithFiltersWithoutColor(categoryId, minPrice, maxPrice, pageable,
					keyword, brandId);
		}
		System.out.println("These are the payload request for getting total items " + categoryId + " " + minPrice + " "
				+ maxPrice + " " + color + " " + keyword);
		long totalItems = productRepository.countFilteredProducts(categoryId, minPrice, maxPrice, keyword, brandId);

		return new ProductResponseDTO(products, totalItems);
	}

	public ResponseEntity<Product> addProductWithVariants(ProductWithVariantsRequest productRequest) {
		try {

			ProductCategory category = productCategoryRepository.findById(productRequest.getCategory().getId())
					.orElseThrow(() -> new RuntimeException("Category not found"));
			Brand productBrand = brandRepository.findById(productRequest.getBrand().getId())
					.orElseThrow(() -> new RuntimeException("Brand not found "));

			System.out.println("This is the brand " + productBrand);

			Product product = new Product();
			product.setName(productRequest.getName());
			product.setPrice(productRequest.getPrice());
			product.setDescription(productRequest.getDescription());
			product.setStockQuantity(productRequest.getStockQuantity());
			product.setBrand(productBrand);
			product.setCategory(category);

			product = productRepository.save(product);

			if (productRequest.getVariants() != null) {

				for (ProductSizeColorInventoryRequest inventoryRequest : productRequest.getVariants()) {
					ProductVariant inventory = new ProductVariant();
					inventory.setProduct(product);
					if (inventoryRequest.getSizeVariantId() != null) {
						SizeVariant sizeVariant = sizeVariantRepository.findById(inventoryRequest.getSizeVariantId())
								.orElseThrow(() -> new RuntimeException("Size variant not found"));
						inventory.setSizeVariant(sizeVariant);
					}
					if (inventoryRequest.getColorVariantId() != null) {
						ColorVariant colorVariant = colorVariantRepository
								.findById(inventoryRequest.getColorVariantId())
								.orElseThrow(() -> new RuntimeException("Color variant not found"));
						inventory.setColorVariant(colorVariant);
					}

					inventory.setQuantity(inventoryRequest.getQuantity());
					productVariantRepository.save(inventory);
				}
			}
			return new ResponseEntity<Product>(product, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("Something went wrong " + e.getMessage());
		}

	}

	public List<ColorVariant> getColors(Integer productId) {
		return productVariantRepository.findColorByProductId(productId);

	}

	public List<SizeVariant> getSizes(Integer productId) {
		return productVariantRepository.findSizeByProductId(productId);
	}

	public List<Product> getAllWithoutFilters() {
		return productRepository.findAll();
	}

	public List<Product> getAllSearchedProduct(String keyword, Integer pageNumber, Integer pageSize) {
		Pageable pageable = PageRequest.of(pageNumber, pageSize);
		return productRepository.searchByKeyword(keyword, pageable);
	}
}
