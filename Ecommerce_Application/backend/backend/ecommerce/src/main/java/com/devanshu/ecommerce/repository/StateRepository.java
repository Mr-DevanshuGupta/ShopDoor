package com.devanshu.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devanshu.ecommerce.entity.Country;
import com.devanshu.ecommerce.entity.State;

public interface StateRepository extends JpaRepository<State, Integer> {

	List<State> findAllByCountry(Country country);

}
