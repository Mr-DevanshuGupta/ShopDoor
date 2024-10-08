package com.devanshu.ecommerce.entity;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Data;

@Entity
@Data
public class Brand {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(nullable = false)
	private String name;

	private String tagLine;

	@Column(nullable = false)
	private boolean isActive;

	@Column(name = "updated_at")
	private LocalDateTime createdAt;

	@Column(name = "delivered_date")
	private LocalDateTime updatedAt;

	@OneToMany(mappedBy = "brand")
	private Set<Product> products;

	@ManyToMany
	@JoinTable(name = "brand_category", joinColumns = @JoinColumn(name = "brandId"), inverseJoinColumns = @JoinColumn(name = "categoryId"))
	Set<ProductCategory> categories;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		isActive = true;
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
