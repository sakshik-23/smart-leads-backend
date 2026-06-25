package com.smartleads.service;

import com.smartleads.dto.request.LoginRequest;
import com.smartleads.dto.request.RegisterRequest;
import com.smartleads.dto.response.JwtResponse;
import com.smartleads.dto.response.UserResponse;

public interface UserService {
	
	UserResponse register(RegisterRequest request);
	
	JwtResponse login(LoginRequest request);

}
