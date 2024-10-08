package com.devanshu.ecommerce.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.dto.CategoryDTORequest;
import com.devanshu.ecommerce.dto.CategoryResponseDTO;
import com.devanshu.ecommerce.dto.CategoryUpdateDTO;
import com.devanshu.ecommerce.entity.Brand;
import com.devanshu.ecommerce.entity.ProductCategory;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.mapper.CategoryMapper;
import com.devanshu.ecommerce.repository.BrandRepository;
import com.devanshu.ecommerce.repository.ProductCategoryRepository;

@Service
public class ProductCategoryService {

	@Autowired
	private CategoryMapper categoryMapper;

	@Autowired
	private BrandRepository brandRepository;

	@Autowired
	private ProductCategoryRepository productCategoryRepository;

	public ProductCategory addCategory(CategoryDTORequest category) {
		try {
			ProductCategory newCategory = new ProductCategory();
			newCategory.setName(category.getName());
			newCategory.setDescription(category.getDescription());
			if (category.getParent_id() != null) {
				ProductCategory parent = productCategoryRepository.findById(category.getParent_id()).orElse(null);
				newCategory.setParent_id(category.getParent_id());
			}
			return productCategoryRepository.save(newCategory);
		} catch (Exception e) {
			throw new NoSuchExists("Something went wrong " + e.getMessage());
		}
	}

	public ProductCategory getCategory(Integer id) {
		return productCategoryRepository.findById(id).orElse(null);
	}

	public ResponseEntity<CategoryResponseDTO> getAll(Integer pageSize, Integer pageNumber, String keyword) {
		Pageable pageable = PageRequest.of(pageNumber, pageSize);
		Page<ProductCategory> pageCategories;
		long totalCategories;

		if (keyword != null && !keyword.trim().isEmpty()) {
			pageCategories = productCategoryRepository.searchCategories(keyword, pageable);
			totalCategories = productCategoryRepository.countCategoriesByKeyword(keyword);
		} else {
			pageCategories = productCategoryRepository.findAll(pageable);
			totalCategories = productCategoryRepository.countCategories();
		}

		List<ProductCategory> categories = pageCategories.getContent();
		CategoryResponseDTO responseDTO = new CategoryResponseDTO(categories, totalCategories);

		return new ResponseEntity<CategoryResponseDTO>(responseDTO, HttpStatus.OK);
	}

	public ProductCategory updateCategory(CategoryUpdateDTO categoryUpdateDTO, Integer categoryID) {
		ProductCategory category = productCategoryRepository.findById(categoryID).orElse(null);

		categoryMapper.updateCategoryFromDto(categoryUpdateDTO, category);
		productCategoryRepository.save(category);
		return category;
	}

	public ProductCategory getCategoryByName(String name) {
		ProductCategory category = productCategoryRepository.findByName(name);
		if (category != null) {
			return category;
		} else {
			throw new NoSuchExists("Category with this name does not exists");
		}

	}

	public ResponseEntity<ProductCategory> deleteCategory(Integer id) {
		try {
			ProductCategory category = productCategoryRepository.findById(id).orElse(null);
			System.out.println("This is the category " + category);
			productCategoryRepository.delete(category);
			return new ResponseEntity<ProductCategory>(category, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("Category with this id does not exist " + e.getMessage());
		}
	}

	public ResponseEntity<List<ProductCategory>> getCategoriesByBrand(Integer brandId) {
		Brand brand = brandRepository.findById(brandId).orElse(null);
		if (brand == null) {
			throw new NoSuchExists("Category with this id does not exists");
		} else {
			System.out.println("This is the brand ID " + brandId);
			List<ProductCategory> categories = brandRepository.findByBrandId(brandId);
			return new ResponseEntity<List<ProductCategory>>(categories, HttpStatus.OK);
		}
	}

	public ResponseEntity<List<ProductCategory>> getAllCategories() {
		List<ProductCategory> categories = productCategoryRepository.findAll();
		return new ResponseEntity<List<ProductCategory>>(categories, HttpStatus.OK);
	}
}
