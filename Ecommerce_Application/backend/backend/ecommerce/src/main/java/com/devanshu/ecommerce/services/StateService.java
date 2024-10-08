package com.devanshu.ecommerce.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.dto.stateRequestDTO;
import com.devanshu.ecommerce.entity.Country;
import com.devanshu.ecommerce.entity.State;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.repository.CountryRepository;
import com.devanshu.ecommerce.repository.StateRepository;

@Service
public class StateService {

	@Autowired
	private StateRepository stateRepository;

	@Autowired
	private CountryRepository countryRepository;

	public ResponseEntity<List<State>> getAll(Integer countryId) {
		Country country = countryRepository.findById(countryId).orElse(null);
		List<State> states = stateRepository.findAllByCountry(country);
		return new ResponseEntity<List<State>>(states, HttpStatus.OK);
	}

	public ResponseEntity<State> add(stateRequestDTO request) {
		Country country = countryRepository.findById(request.getCountryId()).orElse(null);
		State state = new State();
		state.setCountry(country);
		state.setName(request.getName());
		State newState = stateRepository.save(state);

		return new ResponseEntity<State>(newState, HttpStatus.OK);
	}

	public ResponseEntity<HttpStatus> delete(Integer stateId) {
		try {
			stateRepository.deleteById(stateId);
			return new ResponseEntity<HttpStatus>(HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("State with this id does not exists");
		}
	}

}
