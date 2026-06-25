package com.smartleads.dto.response;

import com.smartleads.enums.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class JwtResponse {

    public JwtResponse(String token, long expiresIn, String email, Role role, String name) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.email = email;
        this.role = role;
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public String getName() {
        return name;
    }

    private String token;
    private long expiresIn;
    private String email;
    private Role role;
    private String name;
}
