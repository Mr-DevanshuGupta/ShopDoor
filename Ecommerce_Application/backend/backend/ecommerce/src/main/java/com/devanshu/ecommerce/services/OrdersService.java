package com.devanshu.ecommerce.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.Enum.Status;
import com.devanshu.ecommerce.dto.OrderRequestDTO;
import com.devanshu.ecommerce.dto.OrderResponseDTO;
import com.devanshu.ecommerce.dto.OrderUpdateDTO;
import com.devanshu.ecommerce.entity.Address;
import com.devanshu.ecommerce.entity.OrderItems;
import com.devanshu.ecommerce.entity.Orders;
import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.ProductVariant;
import com.devanshu.ecommerce.entity.User;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.repository.AddressRepository;
import com.devanshu.ecommerce.repository.OrderItemsRepository;
import com.devanshu.ecommerce.repository.OrdersRepository;
import com.devanshu.ecommerce.repository.ProductRepository;
import com.devanshu.ecommerce.repository.ProductVariantRepository;
import com.devanshu.ecommerce.repository.UserRepository;

@Service
public class OrdersService {

	@Autowired
	private OrdersRepository ordersRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private AddressRepository addressRepository;

	@Autowired
	private OrderItemsRepository orderItemsRepository;

	@Autowired
	private ProductVariantRepository productVariantRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private OrderItemsService orderItemsService;

	public ResponseEntity<List<Orders>> getAll(Integer userId, Integer pageSize, Integer pageNumber,
			Boolean sortDescending, String status, String email) {
		try {
			User user = userRepository.findById(userId).orElse(null);
			Sort sort = sortDescending ? Sort.by(Sort.Order.desc("orderedAt")) : Sort.by(Sort.Order.asc("orderedAt"));
			Status statusEnum = null;
			if (status != null) {
				try {
					statusEnum = Status.valueOf(status);
				} catch (IllegalArgumentException e) {
					return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
				}
			}
			Pageable p = PageRequest.of(pageNumber, pageSize, sort);
			List<Orders> orders = ordersRepository.findAllByUserAndStatus(user, statusEnum, p);
			return new ResponseEntity<List<Orders>>(orders, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("User with this id does not exists " + e.getMessage());
		}
	}

	public ResponseEntity<Orders> add(Integer userId, OrderRequestDTO request) {
		try {
			User user = userRepository.findById(userId).orElse(null);
			Address address = addressRepository.findById(request.getAddressId()).orElse(null);
			Orders order = new Orders();
			order.setUser(user);
			order.setAddress(address);
			order.setPayment(request.getPayment());
			order.setTotalAmount(request.getTotalAmount());
			ordersRepository.save(order);
			return new ResponseEntity<Orders>(order, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("Please check all the id's something went wrong");
		}

	}

	public ResponseEntity<Orders> update(OrderUpdateDTO request) {
		try {
			Orders order = ordersRepository.findById(request.getOrderId()).orElse(null);
			if (request.getDeliveredDate() != null) {
				order.setDeliveredDate(request.getDeliveredDate());
			}
			if (request.getStatus() != null) {
				order.setStatus(request.getStatus());
			}
			ordersRepository.save(order);
			return new ResponseEntity<Orders>(order, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("Something went wrong please check request " + e.getMessage());
		}
	}

	public ResponseEntity<Orders> delete(Integer orderId) {
		try {
//			ordersRepository.deleteById(orderId);
			Orders order = ordersRepository.findById(orderId)
					.orElseThrow(() -> new NoSuchExists("Order with this orderId is not present"));

			// Update product and product variant quantities
			List<OrderItems> orderItems = orderItemsRepository.findAllByOrder(order);
			for (OrderItems item : orderItems) {
				Product product = item.getProduct();
				ProductVariant productVariant = item.getProductVariant();

				if (productVariant != null) {
					productVariant.setQuantity(productVariant.getQuantity() + item.getQuantity());
					productVariantRepository.save(productVariant);
				} else {
					product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
					productRepository.save(product);
				}
			}
//        orderItemsService.delete(orderId);
//        ordersRepository.delete(order);
			order.setStatus(Status.Cancelled);
			ordersRepository.save(order);
			return new ResponseEntity<Orders>(order, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("Order with this orderId is not present");
		}
	}

	public ResponseEntity<OrderResponseDTO> getAllOrders(Integer pageSize, Integer pageNumber, Boolean sortDescending,
			String status, String keyword) {
		try {
			Sort sort = sortDescending ? Sort.by(Sort.Order.desc("orderedAt")) : Sort.by(Sort.Order.asc("orderedAt"));
			Status statusEnum = null;
			if (status != null) {
				try {
					statusEnum = Status.valueOf(status);
				} catch (IllegalArgumentException e) {
					return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
				}
			}
			Pageable p = PageRequest.of(pageNumber, pageSize, sort);
			Page<Orders> page = ordersRepository.findAllByStatus(p, statusEnum, keyword);
			List<Orders> orders = page.getContent();

			long totalOrders = ordersRepository.countAllByStatus(statusEnum, keyword);

			// Create the response DTO
			OrderResponseDTO responseDTO = new OrderResponseDTO(orders, totalOrders);

			return new ResponseEntity<OrderResponseDTO>(responseDTO, HttpStatus.OK);
//			return new ResponseEntity<List<Orders>>(orders, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("something went wrong " + e.getMessage());
		}
	}
}
