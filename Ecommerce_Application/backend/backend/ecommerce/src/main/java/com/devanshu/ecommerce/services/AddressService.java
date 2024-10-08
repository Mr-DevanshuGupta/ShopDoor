package com.devanshu.ecommerce.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.dto.AddressDTORequest;
import com.devanshu.ecommerce.entity.Address;
import com.devanshu.ecommerce.entity.City;
import com.devanshu.ecommerce.entity.Country;
import com.devanshu.ecommerce.entity.State;
import com.devanshu.ecommerce.entity.User;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.repository.AddressRepository;
import com.devanshu.ecommerce.repository.CityRepository;
import com.devanshu.ecommerce.repository.CountryRepository;
import com.devanshu.ecommerce.repository.StateRepository;
import com.devanshu.ecommerce.repository.UserRepository;

@Service
public class AddressService {

	@Autowired
	private AddressRepository addressRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CountryRepository countryRepository;

	@Autowired
	private CityRepository cityRepository;

	@Autowired
	private StateRepository stateRepository;

	public ResponseEntity<List<Address>> getAll(Integer userId, Integer pageSize, Integer pageNumber) {
		Pageable p = PageRequest.of(pageNumber, pageSize);
		List<Address> addresses = addressRepository.findAllByUser_idAndIsActiveTrue(userId, p);
		return new ResponseEntity<List<Address>>(addresses, HttpStatus.OK);
	}

	public ResponseEntity<Address> add(Integer userId, AddressDTORequest request) {
		try {
			User user = userRepository.findById(userId).orElse(null);
			Country country = countryRepository.findById(request.getCountryId()).orElse(null);
			State state = stateRepository.findById(request.getStateId()).orElse(null);
			City city = cityRepository.findById(request.getCityId()).orElse(null);
			Address address = new Address();
			address.setUser(user);
			address.setCity(city);
			address.setState(state);
			address.setCountry(country);
			address.setStreet_address(request.getStreet_address());

			addressRepository.save(address);
			return new ResponseEntity<Address>(address, HttpStatus.OK);

		} catch (Exception e) {
			throw new NoSuchExists("Something went wrong please check id's of all the required fields");
		}
	}

	public ResponseEntity<Address> update(Integer addressId, AddressDTORequest request) {
		try {
			Address address = addressRepository.findById(addressId).orElse(null);
			City city = cityRepository.findById(request.getCityId()).orElse(null);
			State state = stateRepository.findById(request.getStateId()).orElse(null);
			Country country = countryRepository.findById(request.getCountryId()).orElse(null);
			address.setCity(city);
			address.setCountry(country);
			address.setState(state);
			address.setStreet_address(request.getStreet_address());
			addressRepository.save(address);
			return new ResponseEntity<Address>(address, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("Something went wrong please check id's of all the required fields");
		}
	}

	public ResponseEntity<HttpStatus> delete(Integer addressId) {
		try {
			Address address = addressRepository.findById(addressId).orElse(null);
			if (address == null) {
				throw new NoSuchExists("User with ID " + addressId + " does not exists");
			} else {
				address.setActive(false);
				addressRepository.save(address);
				return new ResponseEntity<HttpStatus>(HttpStatus.OK);
			}
		} catch (Exception e) {
			throw new NoSuchExists("Address with this id does not exists " + e.getMessage());
		}
	}

}
