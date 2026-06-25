package com.smartleads.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.smartleads.config.JwtService;
import com.smartleads.dto.request.LoginRequest;
import com.smartleads.dto.request.RegisterRequest;
import com.smartleads.dto.response.JwtResponse;
import com.smartleads.dto.response.UserResponse;
import com.smartleads.entity.User;
import com.smartleads.exception.EmailAlreadyExistsException;
import com.smartleads.repository.UserRepository;
import com.smartleads.service.UserService;

@Service
public class UserServiceImpl implements UserService{
	
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;

	public UserServiceImpl(
			UserRepository userRepository, 
			PasswordEncoder passwordEncoder,
			AuthenticationManager authenticationManager,
			JwtService jwtService) {
		super();
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
	}

	@Override
	public UserResponse register(RegisterRequest request) {
		if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

		User user = new User();

		user.setName(request.getName());
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

	@Override
	public JwtResponse login(LoginRequest request) {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						request.getEmail(),
						request.getPassword()
				)
		);

		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));

		org.springframework.security.core.userdetails.UserDetails userDetails = 
				org.springframework.security.core.userdetails.User.builder()
						.username(user.getEmail())
						.password(user.getPassword())
						.authorities("ROLE_" + user.getRole().name())
						.build();

		String token = jwtService.generateToken(userDetails);

		return new JwtResponse(
				token,
				jwtService.getExpirationTime(),
				user.getEmail(),
				user.getRole(),
				user.getName()
		);
	}
}


