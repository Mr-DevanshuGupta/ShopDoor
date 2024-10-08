package com.devanshu.ecommerce.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.devanshu.ecommerce.Enum.PaymentENUM;
import com.devanshu.ecommerce.Enum.Status;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Data;

@Entity
@Data
public class Orders {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Enumerated(EnumType.STRING)
	private Status status;

	@ManyToOne()
	private User user;

	@Column(nullable = false)
	private Integer totalAmount;

	@ManyToOne()
	private Address address;

	@Column(name = "order_date", updatable = false)
	private LocalDateTime orderedAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@Column(name = "delivered_date")
	private LocalDate deliveredDate;

//	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<OrderItems> orderItems = new ArrayList<>();

	@Enumerated(EnumType.STRING)
	private PaymentENUM payment;

	@PrePersist
	protected void onCreate() {
		orderedAt = LocalDateTime.now();
		status = Status.Ordered;
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}

}
