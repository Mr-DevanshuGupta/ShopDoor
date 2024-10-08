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

import com.devanshu.ecommerce.dto.CityRequestDTO;
import com.devanshu.ecommerce.entity.City;
import com.devanshu.ecommerce.services.CityService;

@RestController
@RequestMapping("/city")
public class CityController {

	@Autowired
	private CityService cityService;

	@GetMapping("/{stateId}")
	public ResponseEntity<List<City>> getAllCities(@PathVariable Integer stateId) {
		return cityService.getAll(stateId);
	}

	@PostMapping("/")
	public ResponseEntity<City> addCity(@RequestBody CityRequestDTO request) {
		return cityService.addCity(request);
	}

	@DeleteMapping("/{cityId}")
	public ResponseEntity<HttpStatus> deleteCity(@PathVariable Integer cityId) {
		return cityService.deleteCity(cityId);
	}
}
