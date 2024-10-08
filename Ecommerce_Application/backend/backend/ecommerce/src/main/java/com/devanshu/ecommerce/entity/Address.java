package com.devanshu.ecommerce.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.Data;

@Entity
@Data
public class Address {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(nullable = false)
	private String street_address;

	@ManyToOne
	private City city;

	@ManyToOne
	private State state;

	@ManyToOne
	private Country country;

	@Column(nullable = false)
	private boolean isActive;

	@PrePersist
	protected void onCreate() {
		isActive = true;
	}

	@ManyToOne
	private User user;

}
