package com.devanshu.ecommerce.entity;

import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
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
public class Cart {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne()
	private ProductVariant productVariant;

	@ManyToOne
	private User user;

	@ManyToOne
	private Product product;

	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	private Integer quantity;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
	}
}
