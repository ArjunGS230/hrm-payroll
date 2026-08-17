package com.hrm.payroll.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
	

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid Gmail address")
    @Pattern(
        regexp = "^[A-Za-z0-9._%+-]+@gmail\\.com$",
        message = "Please use a valid Gmail address"
    )
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^[6-9][0-9]{9}$",
        message = "Phone number must be a valid 10-digit Indian mobile number"
    )
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Role is required")
    private String role;
}