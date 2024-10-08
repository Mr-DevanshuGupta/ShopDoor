package com.devanshu.ecommerce.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.dto.UserResponseDTO;
import com.devanshu.ecommerce.dto.UserUpdateDTO;
import com.devanshu.ecommerce.entity.User;
import com.devanshu.ecommerce.exceptions.AlreadyExists;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.mapper.UserMapper;
import com.devanshu.ecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserMapper userMapper;

	public User deleteUser(Integer id) {
		User user = userRepository.findById(id).orElse(null);
		if (user == null) {
			throw new NoSuchExists("User with ID " + id + " does not exists");
		} else {
			user.setActive(false);
			userRepository.save(user);
			return user;
		}
	}

	public User updateUser(Integer id, UserUpdateDTO userUpdateDTO) {
		User user = userRepository.findById(id).orElse(null);
		try {
			userMapper.updateUserFromDto(userUpdateDTO, user);
			userRepository.save(user);
			return userRepository.findById(id).orElse(null);
		} catch (Exception e) {
			throw new AlreadyExists("User with this email already exists");
		}
	}

	public User getUser(Integer id) {
		User user = userRepository.findById(id).orElse(null);
		return user;
	}

	public ResponseEntity<UserResponseDTO> getAll(Integer pageNumber, Integer pageSize, String keyword) {
		Pageable pageable = PageRequest.of(pageNumber, pageSize);
		Page<User> usersPage;
		long totalActiveUsers;

		if (keyword != null && !keyword.trim().isEmpty()) {
			usersPage = userRepository.searchActiveUsers(keyword, pageable);
			totalActiveUsers = userRepository.countActiveUsersByKeyword(keyword);
		} else {
			usersPage = userRepository.findByIsActive(true, pageable);
			totalActiveUsers = userRepository.countActiveUsers();
		}

		UserResponseDTO responseDTO = new UserResponseDTO(usersPage.getContent(), totalActiveUsers);

		return new ResponseEntity<UserResponseDTO>(responseDTO, HttpStatus.OK);
	}
}
