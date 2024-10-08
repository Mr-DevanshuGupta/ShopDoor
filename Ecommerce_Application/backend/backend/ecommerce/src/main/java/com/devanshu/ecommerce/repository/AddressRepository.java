package com.devanshu.ecommerce.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.devanshu.ecommerce.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Integer> {

	List<Address> findAllByUser_idAndIsActiveTrue(Integer userId, Pageable p);
}
