package com.devanshu.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@RequiredArgsConstructor
public class ProductVariant {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	@ManyToOne
	@JoinColumn(name = "size_variant_id")
	private SizeVariant sizeVariant;

	@ManyToOne
	@JoinColumn(name = "color_variant_id")
	private ColorVariant colorVariant;

	@Column(nullable = false)
	private Integer quantity;

	@Column(nullable = false)
	private Boolean isActive;

	@PrePersist
	protected void onCreate() {
		isActive = true;
	}
}
