package com.devanshu.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devanshu.ecommerce.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

	Payment findByCardNumberAndCvv(String cardNumber, Integer cvv);

}
