package com.devanshu.ecommerce.services;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.devanshu.ecommerce.Enum.Role;
import com.devanshu.ecommerce.dto.AuthenticateRequest;
import com.devanshu.ecommerce.dto.AuthenticationResponse;
import com.devanshu.ecommerce.dto.RegisterRequest;
import com.devanshu.ecommerce.entity.User;
import com.devanshu.ecommerce.exceptions.AlreadyExists;
import com.devanshu.ecommerce.exceptions.NoSuchExists;
import com.devanshu.ecommerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticateService {
	private final UserRepository repository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	private final UserRepository userRepository;

	public AuthenticationResponse register(RegisterRequest request) {
		User checkUser = repository.findByEmail(request.getEmail()).orElse(null);
		if (checkUser != null) {
			throw new AlreadyExists("User with this email already exists");
		} else {

			var user = User.builder().firstName(request.getFirstName()).lastName(request.getLastName())
					.email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).role(Role.USER)
					.build();
			repository.save(user);
			var jwtToken = jwtService.generateToken(user);
			return AuthenticationResponse.builder().token(jwtToken).id(user.getId()).build();
		}
	}

	public AuthenticationResponse authenticate(AuthenticateRequest request) {
		User checkUser = userRepository.findByEmail(request.getEmail()).orElse(null);
		if (checkUser == null) {
			throw new NoSuchExists("User with this email does not exist");
		}
		try {

			authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
			var user = repository.findByEmail(request.getEmail()).orElse(null);

			var jwtToken = jwtService.generateToken(user);
			return AuthenticationResponse.builder().token(jwtToken).id(checkUser.getId()).build();
		} catch (BadCredentialsException e) {
			throw new BadCredentialsException("Invalid user or password");
		}

	}
}
