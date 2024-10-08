package com.devanshu.ecommerce.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.entity.Country;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.repository.CountryRepository;

@Service
public class CountryService {

	@Autowired
	private CountryRepository countryRepository;

	public ResponseEntity<List<Country>> getAll() {
		List<Country> countries = countryRepository.findAll();

		return new ResponseEntity<List<Country>>(countries, HttpStatus.OK);
	}

	public ResponseEntity<Country> add(Country request) {
		Country country = countryRepository.save(request);
		return new ResponseEntity<Country>(country, HttpStatus.OK);
	}

	public ResponseEntity<HttpStatus> delete(Integer id) {
		try {
			Country country = countryRepository.findById(id).orElse(null);
			countryRepository.deleteById(id);
			return new ResponseEntity<HttpStatus>(HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("Country with this id does not exists");
		}
	}

}
