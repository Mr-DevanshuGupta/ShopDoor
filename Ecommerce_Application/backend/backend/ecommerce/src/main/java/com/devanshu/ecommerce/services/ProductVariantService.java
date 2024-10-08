package com.devanshu.ecommerce.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.dto.ProductVariantDTORequest;
import com.devanshu.ecommerce.entity.ColorVariant;
import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.ProductVariant;
import com.devanshu.ecommerce.entity.SizeVariant;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.repository.ColorVariantRepository;
import com.devanshu.ecommerce.repository.ProductRepository;
import com.devanshu.ecommerce.repository.ProductVariantRepository;
import com.devanshu.ecommerce.repository.SizeVariantRepository;

@Service
public class ProductVariantService {

	@Autowired
	private ProductVariantRepository productVariantRepository;

	@Autowired
	private SizeVariantRepository sizeVariantRepository;

	@Autowired
	private ColorVariantRepository colorVariantRepository;

	@Autowired
	private ProductRepository productRepository;

	public ResponseEntity<ProductVariant> findProductVariant(ProductVariantDTORequest request) {
		try {
			SizeVariant sizeVariant = sizeVariantRepository.findById(request.getSizeVariantId()).orElse(null);
			ColorVariant colorVariant = colorVariantRepository.findById(request.getColorVariantId()).orElse(null);
			Product product = productRepository.findById(request.getProductId()).orElse(null);
			System.out.print("This is the request it get in findproduct variant " + request );
			System.out.println("This is the request it get in color variant " + colorVariant);
			ProductVariant productVariant = productVariantRepository.findByProductAndSizeVariantAndColorVariant(request.getProductId(),
					request.getSizeVariantId(), request.getColorVariantId());
			
			if (productVariant != null && productVariant.getIsActive()) {
				return new ResponseEntity<ProductVariant>(productVariant, HttpStatus.OK);
			} else {
				throw new NoSuchExists("Product Variant is not found with these credentials");
			}
		} catch (Exception e) {
			throw new NoSuchExists("Please check id's of all the required fields");
		}
	}

	public ResponseEntity<ProductVariant> findProductByVariant(Integer variantId) {
		try {
			ProductVariant variant = productVariantRepository.findById(variantId).orElse(null);
			if (variant != null && variant.getIsActive()) {
				return new ResponseEntity<>(variant, HttpStatus.OK);
			} else {
				throw new NoSuchExists("Variant not found or is inactive");
			}
		} catch (Exception e) {
			throw new NoSuchExists("Please variant Id " + e.getMessage());
		}
	}

	public ResponseEntity<List<ColorVariant>> findAllColors() {
		try {
			List<ColorVariant> colors = colorVariantRepository.findAll();
			return new ResponseEntity<List<ColorVariant>>(colors, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("Something went wrong " + e.getMessage());
		}
	}

	public ResponseEntity<List<ProductVariant>> findAllVariant(Integer productId) {
		try {
			Product product = productRepository.findById(productId).orElse(null);
			List<ProductVariant> productVariants = productVariantRepository.findAllByProductAndIsActiveTrue(product);
			return new ResponseEntity<List<ProductVariant>>(productVariants, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("Something went wrong " + e.getMessage());
		}
	}

}
