package com.devanshu.ecommerce.entity;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@RequiredArgsConstructor
public class Product {
	public Product(Integer productId) {
		// TODO Auto-generated constructor stub
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private double price;

	@Column(nullable = false)
	private String description;

	@Column(nullable = false)
	private Integer stockQuantity;

	@ManyToOne
	private ProductCategory category;

	@ManyToOne
	private Brand brand;

	@OneToMany(mappedBy = "product")
	private Set<ProductImages> images;

//    @Column(name = "colors")
//    @Enumerated(EnumType.STRING)
//    private Colors colors;

	@OneToMany(mappedBy = "product")
	private Set<ProductVariant> variants;

	@Column(nullable = false)
	private boolean isActive;

	@PrePersist
	protected void onCreate() {
		isActive = true;
	}

//    @OneToMany(mappedBy = "product")
//    private Set<SizeVariant> sizeVariants;
//    
//    @ElementCollection
//    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
//    @Column(name = "color")
//    private Set<Colors> colors;
}
