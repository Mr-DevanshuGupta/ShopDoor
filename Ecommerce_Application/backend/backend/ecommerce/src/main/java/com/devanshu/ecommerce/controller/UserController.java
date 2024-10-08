package com.devanshu.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devanshu.ecommerce.config.AppConstants;
import com.devanshu.ecommerce.dto.UserResponseDTO;
import com.devanshu.ecommerce.dto.UserUpdateDTO;
import com.devanshu.ecommerce.entity.User;
import com.devanshu.ecommerce.services.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
	@Autowired
	private UserService userService;

	@PutMapping("/{id}")
	public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody UserUpdateDTO userUpdateDTO) {
		User user = userService.updateUser(id, userUpdateDTO);
		return new ResponseEntity<>(user, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<User> deleteUser(@PathVariable Integer id) {
		User user = userService.deleteUser(id);
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<User> getUser(@PathVariable Integer id) {
		User user = userService.getUser(id);
		return new ResponseEntity<>(user, HttpStatus.OK);
	}

	@GetMapping("/")
	public ResponseEntity<UserResponseDTO> getAllUser(
			@RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) Integer pageSize,
			@RequestParam(value = "pageNumber", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) Integer pageNumber,
			@RequestParam(value = "keyword", required = false) String keyword) {
		return userService.getAll(pageNumber - 1, pageSize, keyword);
	}
}
