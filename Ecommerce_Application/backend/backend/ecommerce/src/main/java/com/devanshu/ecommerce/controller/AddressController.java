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
import com.devanshu.ecommerce.dto.AddressDTORequest;
import com.devanshu.ecommerce.entity.Address;
import com.devanshu.ecommerce.services.AddressService;

@RestController
@RequestMapping("/address")
public class AddressController {

	@Autowired
	private AddressService addressService;

	@GetMapping("/{userId}")
	public ResponseEntity<List<Address>> getAddress(@PathVariable Integer userId,
			@RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) Integer pageSize,
			@RequestParam(value = "pageNumber", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) Integer pageNumber) {
		return addressService.getAll(userId, pageSize, pageNumber - 1);
	}

	@PostMapping("/{userId}")
	public ResponseEntity<Address> addAddress(@PathVariable Integer userId, @RequestBody AddressDTORequest request) {
		return addressService.add(userId, request);
	}

	@PutMapping("/{addressId}")
	public ResponseEntity<Address> updateAddress(@PathVariable Integer addressId,
			@RequestBody AddressDTORequest request) {
		return addressService.update(addressId, request);
	}

	@DeleteMapping("/{addressId}")
	public ResponseEntity<HttpStatus> deleteAddress(@PathVariable Integer addressId) {
		return addressService.delete(addressId);
	}
}
