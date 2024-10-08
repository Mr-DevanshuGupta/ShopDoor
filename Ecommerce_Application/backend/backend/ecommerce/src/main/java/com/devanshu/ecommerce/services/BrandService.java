package com.devanshu.ecommerce.services;

import java.util.HashSet;
import java.util.List;
import java.util.Locale.Category;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.dto.AddBrandDTO;
import com.devanshu.ecommerce.dto.BrandResponseDTO;
import com.devanshu.ecommerce.entity.Brand;
import com.devanshu.ecommerce.entity.ProductCategory;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.repository.BrandRepository;
import com.devanshu.ecommerce.repository.ProductCategoryRepository;

@Service
public class BrandService {

	@Autowired
	private BrandRepository brandRepository;

	@Autowired
	private ProductCategoryRepository productCategoryRepository;

	public ResponseEntity<List<Brand>> getAll() {
		List<Brand> brands = brandRepository.findAllByIsActive(true);
		return new ResponseEntity<List<Brand>>(brands, HttpStatus.OK);
	}

	public ResponseEntity<Brand> add(AddBrandDTO request) {
		Brand brand = new Brand();
		brand.setName(request.getName());
		brand.setTagLine(request.getTagLine());

		Set<ProductCategory> categories = new HashSet<>();
		for (Integer categoryId : request.getCategoryIds()) {
			ProductCategory category = productCategoryRepository.findById(categoryId).orElse(null);
			if (category == null) {
				throw new NoSuchExists("Category with this id " + categoryId + " does not exists");
			} else {
				categories.add(category);
			}

		}
		brand.setCategories(categories);

		Brand addedBrand = brandRepository.save(brand);
		return new ResponseEntity<Brand>(addedBrand, HttpStatus.OK);
	}

	public ResponseEntity<Brand> update(Integer id, AddBrandDTO request) {
		try {
			Brand brand = brandRepository.findById(id).orElse(null);
			brand.setName(request.getName());
			brand.setTagLine(request.getTagLine());

			Set<ProductCategory> categories = new HashSet<>();
			for (Integer categoryId : request.getCategoryIds()) {
				ProductCategory category = productCategoryRepository.findById(categoryId).orElse(null);
				if (category == null) {
					throw new NoSuchExists("Category with this id " + categoryId + " does not exist");
				} else {
					categories.add(category);
				}
			}
			brand.setCategories(categories);

			Brand updateBrand = brandRepository.save(brand);
			return new ResponseEntity<Brand>(updateBrand, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("Brand with this id does not exists " + e.getMessage());
		}
	}

	public ResponseEntity<HttpStatus> delete(Integer id) {
		try {
			Brand brand = brandRepository.findById(id).orElse(null);
			if (brand == null) {
				throw new NoSuchExists("Brand with this id : " + id + " does not exists ");
			} else {
				brand.setActive(false);
				brandRepository.save(brand);
				return new ResponseEntity<HttpStatus>(HttpStatus.OK);
			}
		} catch (Exception e) {
			throw new NoSuchExists("Brand with this id does not exists " + e.getMessage());
		}
	}

	public ResponseEntity<List<Brand>> getByCategory(Integer categoryId) {
		ProductCategory category = productCategoryRepository.findById(categoryId).orElse(null);
		if (category == null) {
			throw new NoSuchExists("Category with this id does not exists");
		} else {

			List<Brand> brands = brandRepository.findByCategoryId(categoryId);
			return new ResponseEntity<List<Brand>>(brands, HttpStatus.OK);
		}
	}

	public ResponseEntity<BrandResponseDTO> getAllPaginated(Integer pageNumber, Integer pageSize, String keyword) {
		Pageable pageable = PageRequest.of(pageNumber, pageSize);
		Page<Brand> pageBrands;

		if (keyword == null || keyword.isEmpty()) {
			pageBrands = brandRepository.findAll(pageable);
		} else {
			pageBrands = brandRepository.findByNameContainingIgnoreCase(keyword, pageable);
		}

		List<Brand> brands = pageBrands.getContent();
		long totalBrands = pageBrands.getTotalElements();

		BrandResponseDTO responseDTO = new BrandResponseDTO(brands, totalBrands);
		return new ResponseEntity<>(responseDTO, HttpStatus.OK);
	}
}
