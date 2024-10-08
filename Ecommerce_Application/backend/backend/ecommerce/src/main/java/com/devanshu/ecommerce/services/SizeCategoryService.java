package com.devanshu.ecommerce.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.entity.SizeCategory;
import com.devanshu.ecommerce.repository.SizeCategoryRepository;

@Service
public class SizeCategoryService {

	@Autowired
	private SizeCategoryRepository sizeCategoryRepository;

	public ResponseEntity<SizeCategory> addSizeCategory(SizeCategory sizeCategory) {
		SizeCategory sizeCateogry = sizeCategoryRepository.save(sizeCategory);
		return new ResponseEntity<>(sizeCategory, HttpStatus.ACCEPTED);

	}

}
