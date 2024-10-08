package com.devanshu.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devanshu.ecommerce.entity.Country;

public interface CountryRepository extends JpaRepository<Country, Integer> {

}
