package com.devanshu.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devanshu.ecommerce.entity.City;
import com.devanshu.ecommerce.entity.Country;
import com.devanshu.ecommerce.entity.State;

public interface CityRepository extends JpaRepository<City, Integer> {

	List<City> findAllByState(State state);
}
