package com.devanshu.ecommerce.services;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.ProductImages;
import com.devanshu.ecommerce.repository.ProductImageRepository;
import com.devanshu.ecommerce.repository.ProductRepository;

@Service
public class ProductImageService {

	@Autowired
	private ProductImageRepository productImageRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private FileStorageService fileStorageService;

	public List<ProductImages> getAllImages() {
		return productImageRepository.findAll();
	}

	public Optional<ProductImages> getImageById(Integer id) {
		return productImageRepository.findById(id);
	}

	public ProductImages addImage(Integer productId, MultipartFile file, ProductImages image)
			throws IOException, java.io.IOException {
		String fileName = fileStorageService.storeFile(file);
		image.setFileName(fileName);
		Product product = productRepository.findById(productId).orElse(null);
		image.setProduct(product);
		return productImageRepository.save(image);
	}

	public ProductImages updateImage(Integer id, MultipartFile file, ProductImages image)
			throws IOException, java.io.IOException {
		Optional<ProductImages> existingImage = productImageRepository.findById(id);
		if (existingImage.isPresent()) {
			String oldFileName = existingImage.get().getFileName();
			fileStorageService.deleteFile(oldFileName);
			String newFileName = fileStorageService.storeFile(file);
			image.setFileName(newFileName);
			image.setId(id);
			return productImageRepository.save(image);
		}
		return null;
	}

	public void deleteImage(Integer id) throws IOException, java.io.IOException {
		Optional<ProductImages> existingImage = productImageRepository.findById(id);
		if (existingImage.isPresent()) {
			String fileName = existingImage.get().getFileName();
			fileStorageService.deleteFile(fileName);
			productImageRepository.deleteById(id);
		}
	}

	public List<ProductImages> getImagesByProductId(Integer productId) {
		Product product = productRepository.findById(productId).orElse(null);
		return productImageRepository.findByProduct(product);
//        return productImageRepository.findByProductId(productId);
	}
}
