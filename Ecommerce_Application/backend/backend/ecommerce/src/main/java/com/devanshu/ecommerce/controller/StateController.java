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

import com.devanshu.ecommerce.dto.stateRequestDTO;
import com.devanshu.ecommerce.entity.State;
import com.devanshu.ecommerce.services.StateService;

@RestController
@RequestMapping("/state")
public class StateController {

	@Autowired
	private StateService stateService;

	@GetMapping("/{countryId}")
	public ResponseEntity<List<State>> getAll(@PathVariable Integer countryId) {
		return stateService.getAll(countryId);
	}

	@PostMapping("/")
	public ResponseEntity<State> addState(@RequestBody stateRequestDTO request) {
		return stateService.add(request);
	}

	@DeleteMapping("/{stateId}")
	public ResponseEntity<HttpStatus> deleteState(@PathVariable Integer stateId) {
		return stateService.delete(stateId);
	}
}
