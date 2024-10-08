package com.devanshu.ecommerce.dto;

import java.util.List;

import com.devanshu.ecommerce.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDTO {
	private List<User> users;
	private long totalItems;
}
