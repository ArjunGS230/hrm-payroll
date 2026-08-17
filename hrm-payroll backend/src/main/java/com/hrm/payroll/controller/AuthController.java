package com.hrm.payroll.controller;

import com.hrm.payroll.dto.ChangePasswordRequest;
import com.hrm.payroll.dto.LoginRequest;
import com.hrm.payroll.dto.LoginResponse;
import com.hrm.payroll.dto.RegisterRequest;
import com.hrm.payroll.service.AuthService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    // =====================================================
    // REGISTER
    // =====================================================

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request) {

        authService.register(request);

        return ResponseEntity.ok(
                "User registered successfully"
        );
    }


    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        String username =
                authentication.getName();

        authService.changePassword(
                username,
                request
        );

        return ResponseEntity.ok(
                "Password changed successfully"
        );
    }
}