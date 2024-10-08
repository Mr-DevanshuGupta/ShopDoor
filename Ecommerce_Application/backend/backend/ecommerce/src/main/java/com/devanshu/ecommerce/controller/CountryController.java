package com.devanshu.ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devanshu.ecommerce.entity.Country;
import com.devanshu.ecommerce.services.CountryService;

@RestController
@RequestMapping("/country")
public class CountryController {

	@Autowired
	private CountryService countryService;

	@GetMapping("/")
	public ResponseEntity<List<Country>> getAllCountries() {
		return countryService.getAll();
	}

	@PostMapping("/")
	public ResponseEntity<Country> addCountry(@RequestBody Country request) {
		return countryService.add(request);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<HttpStatus> deleteCountry(@PathVariable Integer id) {
		return countryService.delete(id);
	}
}
