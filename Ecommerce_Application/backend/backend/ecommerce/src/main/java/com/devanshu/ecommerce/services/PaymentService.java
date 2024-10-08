package com.devanshu.ecommerce.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.dto.PaymentDTORequest;
import com.devanshu.ecommerce.entity.Payment;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.repository.PaymentRepository;

@Service
public class PaymentService {

	@Autowired
	private PaymentRepository paymentRepository;

	public ResponseEntity<HttpStatus> placeOrder(PaymentDTORequest request) {
		try {
			System.out.println("This is a request " + request);
			Payment payment = paymentRepository.findByCardNumberAndCvv(request.getCardNumber(), request.getCvv());
			System.out.println("This is a payment get from repository " + payment);
			if (payment.getBalance() > request.getAmount()) {
				payment.setBalance(payment.getBalance() - request.getAmount());
				paymentRepository.save(payment);
				return new ResponseEntity<HttpStatus>(HttpStatus.ACCEPTED);
			} else {
				return new ResponseEntity<HttpStatus>(HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			throw new NoSuchExists("Card Number or CVV might not be correct " + e.getMessage());
		}

	}

	public ResponseEntity<Payment> addCard(Payment payment) {
		try {
			Payment savedPayment = paymentRepository.save(payment);
			return new ResponseEntity<Payment>(savedPayment, HttpStatus.OK);
		} catch (Exception e) {
			throw new BadCredentialsException(e.getMessage());
		}
	}

	public ResponseEntity<List<Payment>> getAll() {
		List<Payment> cards = paymentRepository.findAll();
		return new ResponseEntity<List<Payment>>(cards, HttpStatus.OK);
	}

}
