package com.devanshu.ecommerce.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.dto.OrderItemRequestDTO;
import com.devanshu.ecommerce.entity.OrderItems;
import com.devanshu.ecommerce.entity.Orders;
import com.devanshu.ecommerce.entity.Product;
import com.devanshu.ecommerce.entity.ProductVariant;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.exceptions.QuantityExceeds;
import com.devanshu.ecommerce.repository.OrderItemsRepository;
import com.devanshu.ecommerce.repository.OrdersRepository;
import com.devanshu.ecommerce.repository.ProductRepository;
import com.devanshu.ecommerce.repository.ProductVariantRepository;

import jakarta.transaction.Transactional;

@Service
public class OrderItemsService {

	@Autowired
	private OrderItemsRepository orderItemsRepository;

	@Autowired
	private OrdersRepository ordersRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private ProductVariantRepository productVariantRepository;

	public ResponseEntity<List<OrderItems>> getAll(Integer orderId) {
		try {
			Orders order = ordersRepository.findById(orderId).orElse(null);
			List<OrderItems> items = orderItemsRepository.findAllByOrder(order);
			return new ResponseEntity<List<OrderItems>>(items, HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("Something went wrongs");
		}
	}

	public ResponseEntity<OrderItems> addItem(OrderItemRequestDTO request) {
		try {
			Orders order = ordersRepository.findById(request.getOrderId()).orElse(null);
			Product product = productRepository.findById(request.getProductId()).orElse(null);
			if (request.getVariantId() != 0) {
				ProductVariant productVariant = productVariantRepository.findById(request.getVariantId()).orElse(null);
				if (productVariant.getQuantity() < request.getQuantity()) {
					throw new QuantityExceeds("This product variant is not in stock");
				} else {
					OrderItems orderItems = new OrderItems();
					orderItems.setOrder(order);
					orderItems.setProduct(product);
					orderItems.setProductVariant(productVariant);
					orderItems.setQuantity(request.getQuantity());
					orderItemsRepository.save(orderItems);
					productVariant.setQuantity(productVariant.getQuantity() - request.getQuantity());
					product.setStockQuantity(product.getStockQuantity() - request.getQuantity());
					productVariantRepository.save(productVariant);
					productRepository.save(product);
					return new ResponseEntity<OrderItems>(orderItems, HttpStatus.OK);
				}
			} else {
				if (request.getQuantity() > product.getStockQuantity()) {
					throw new QuantityExceeds("This product is not in stock");
				}
				OrderItems orderItems = new OrderItems();
				orderItems.setOrder(order);
				orderItems.setProduct(product);
				orderItems.setQuantity(request.getQuantity());
				orderItemsRepository.save(orderItems);
				product.setStockQuantity(product.getStockQuantity() - request.getQuantity());
				productRepository.save(product);
				return new ResponseEntity<OrderItems>(orderItems, HttpStatus.OK);
			}

		} catch (Exception e) {
			throw new NoSuchExists("Item is not in stock " + e.getMessage());
		}

	}

	@Transactional
	public ResponseEntity<HttpStatus> delete(Integer orderId) {
		try {
			Orders order = ordersRepository.findById(orderId).orElse(null);
			System.out.println("This is a order " + order);

			orderItemsRepository.deleteAllByOrder(order);

			return new ResponseEntity<HttpStatus>(HttpStatus.OK);
		} catch (Exception e) {
			throw new NoSuchExists("Please provide valid orderId" + e.getMessage());
		}
	}

}
