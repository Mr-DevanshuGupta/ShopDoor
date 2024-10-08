package com.devanshu.ecommerce.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.dto.SizeVariantDTO;
import com.devanshu.ecommerce.entity.SizeCategory;
import com.devanshu.ecommerce.entity.SizeVariant;
import com.devanshu.ecommerce.repository.SizeCategoryRepository;
import com.devanshu.ecommerce.repository.SizeVariantRepository;

@Service
public class SizeVariantService {

	@Autowired
	private SizeVariantRepository sizeVariantRepository;

	@Autowired
	private SizeCategoryRepository sizeCategoryRepository;

	public List<SizeVariant> getSizes(Integer id) {
		SizeCategory sizeCategory = sizeCategoryRepository.findById(id).orElse(null);
		return sizeVariantRepository.findBySizeCategory(sizeCategory);
	}

	public ResponseEntity<SizeVariant> addSizeValues(SizeVariant sizeVariant) {
		sizeVariantRepository.save(sizeVariant);
		return new ResponseEntity<>(sizeVariant, HttpStatus.ACCEPTED);
	}

	public ResponseEntity<List<SizeCategory>> getAll() {
		List<SizeCategory> sizeCategories = sizeCategoryRepository.findAll();
		return new ResponseEntity<List<SizeCategory>>(sizeCategories, HttpStatus.OK);
	}

}
