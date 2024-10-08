package com.devanshu.ecommerce.controller;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.ProductImages;
import com.devanshu.ecommerce.services.FileStorageService;
import com.devanshu.ecommerce.services.ProductImageService;

@RestController
@RequestMapping("/images")
public class ProductImageController {
	@Autowired
	private ProductImageService productImageService;

	@Autowired
	private FileStorageService fileStorageService;

	@GetMapping("/test")
	public String test() {
		return "Images controllers is running";
	}

	@PostMapping("/")
	public ProductImages addImage(@RequestParam("file") MultipartFile file,
			@RequestParam("productId") Integer productId) throws IOException {
		System.out.println("Inside a addImage controller");
		ProductImages image = new ProductImages();
		image.setProduct(new Product(productId));
		String fileName = fileStorageService.storeFile(file);
		image.setFileName(fileName);
		return productImageService.addImage(productId, file, image);
	}

	@PutMapping("/{id}")
	public ProductImages updateImage(@PathVariable Integer id, @RequestParam("file") MultipartFile file)
			throws IOException {
		ProductImages existingImage = productImageService.getImageById(id)
				.orElseThrow(() -> new RuntimeException("Image not found"));
		fileStorageService.deleteFile(existingImage.getFileName());
		String fileName = fileStorageService.storeFile(file);
		existingImage.setFileName(fileName);
		return productImageService.updateImage(id, file, existingImage);
	}

	@DeleteMapping("/{id}")
	public void deleteImage(@PathVariable Integer id) throws IOException {
		ProductImages existingImage = productImageService.getImageById(id)
				.orElseThrow(() -> new RuntimeException("Image not found"));
		fileStorageService.deleteFile(existingImage.getFileName());
		productImageService.deleteImage(id);
	}

	@GetMapping("/{id}")
	public byte[] getImage(@PathVariable Integer id) throws IOException {
		ProductImages image = productImageService.getImageById(id)
				.orElseThrow(() -> new RuntimeException("Image not found"));
		return fileStorageService.loadFile(image.getFileName());
	}

	@GetMapping("/product/{productId}")
	public byte[] getImageWithProductId(@PathVariable Integer productId) throws IOException {
		List<ProductImages> images = productImageService.getImagesByProductId(productId);
		if (images.isEmpty()) {
			throw new RuntimeException("No images found for product ID " + productId);
		}
		ProductImages image = images.get(0);
		return fileStorageService.loadFile(image.getFileName());
	}

//	@GetMapping("/product/all/{productId}")
//	public ResponseEntity<List<byte[]>> getAllImageWithProductId(@PathVariable Integer productId) throws IOException{
//		 List<ProductImages> images = productImageService.getImagesByProductId(productId);
//	        if (images.isEmpty()) {
//	        	return ResponseEntity.notFound().build();
//
////	            throw new RuntimeException("No images found for product ID " + productId);
//	        }
//	        
//	        List<byte[]> imageBytes = images.stream()
//	            .map(image -> {
//	                try {
//	                    return fileStorageService.loadFile(image.getFileName());
//	                } catch (IOException e) {
//	                    throw new RuntimeException("Failed to load image: " + image.getFileName(), e);
//	                }
//	            })
//	            .collect(Collectors.toList());
//	        
//	        return ResponseEntity.ok(imageBytes);
//	}

	@GetMapping("/product/all/{productId}")
	public ResponseEntity<List<String>> getImagesWithProductId(@PathVariable Integer productId) throws IOException {
		List<ProductImages> images = productImageService.getImagesByProductId(productId);
		if (images.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		List<String> encodedImages = images.stream().map(image -> {
			try {
				byte[] fileContent = fileStorageService.loadFile(image.getFileName());
				return Base64.getEncoder().encodeToString(fileContent);
			} catch (IOException e) {
				throw new RuntimeException("Failed to load image: " + image.getFileName(), e);
			}
		}).collect(Collectors.toList());
		// Encode each image as a Base64 string
//        List<String> encodedImages = images.stream()
//            .map(image -> {
//                try {
//                    byte[] fileContent = fileStorageService.loadFile(image.getFileName());
//                    return Base64.getEncoder().encodeToString(fileContent);
//                } catch (IOException e) {
//                    throw new RuntimeException("Failed to load image: " + image.getFileName(), e);
//                }
//            })
//            .collect(Collectors.toList());

		return ResponseEntity.ok(encodedImages);
	}

}
