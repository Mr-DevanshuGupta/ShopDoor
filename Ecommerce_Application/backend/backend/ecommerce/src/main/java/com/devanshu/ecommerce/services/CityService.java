package com.devanshu.ecommerce.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.dto.CityRequestDTO;
import com.devanshu.ecommerce.entity.City;
import com.devanshu.ecommerce.entity.State;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.repository.CityRepository;
import com.devanshu.ecommerce.repository.StateRepository;

@Service
public class CityService {

	@Autowired
	private CityRepository cityRepository;

	@Autowired
	private StateRepository stateRepository;

	public ResponseEntity<List<City>> getAll(Integer stateId) {
		try {
			State state = stateRepository.findById(stateId).orElse(null);
			List<City> cities = cityRepository.findAllByState(state);
			return new ResponseEntity<List<City>>(cities, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("Country with this id does not exists");
		}
	}

	public ResponseEntity<City> addCity(CityRequestDTO request) {
		try {
			State state = stateRepository.findById(request.getStateId()).orElse(null);
			City city = new City();
			city.setName(request.getName());
			city.setState(state);
			City newCity = cityRepository.save(city);
			return new ResponseEntity<City>(newCity, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("State with this id does not exists");
		}
	}

	public ResponseEntity<HttpStatus> deleteCity(Integer cityId) {
		try {
			cityRepository.deleteById(cityId);
			return new ResponseEntity<HttpStatus>(HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("City with this id does not exists");
		}
	}

}
