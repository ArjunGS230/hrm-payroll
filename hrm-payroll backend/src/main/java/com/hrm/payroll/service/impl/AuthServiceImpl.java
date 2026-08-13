package com.hrm.payroll.service.impl;

import com.hrm.payroll.dto.LoginRequest;
import com.hrm.payroll.dto.LoginResponse;
import com.hrm.payroll.dto.RegisterRequest;
import com.hrm.payroll.entity.User;
import com.hrm.payroll.repository.UserRepository;
import com.hrm.payroll.security.JwtService;
import com.hrm.payroll.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;


    // =====================================================
    // REGISTER
    // =====================================================

    @Override
    public void register(RegisterRequest request) {

        // -------------------------------------------------
        // CHECK USERNAME
        // -------------------------------------------------

        if (userRepository.existsByUsername(
                request.getUsername()
        )) {

            throw new RuntimeException(
                    "Username already exists"
            );
        }


        // -------------------------------------------------
        // CHECK EMAIL
        // -------------------------------------------------

        if (userRepository.existsByEmail(
                request.getEmail()
        )) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }


        // -------------------------------------------------
        // CHECK PHONE NUMBER
        // -------------------------------------------------

        if (userRepository.existsByPhoneNumber(
                request.getPhoneNumber()
        )) {

            throw new RuntimeException(
                    "Phone number already exists"
            );
        }


        // -------------------------------------------------
        // CREATE USER
        // -------------------------------------------------

        User user = User.builder()

                .username(
                        request.getUsername()
                )

                .email(
                        request.getEmail()
                )

                .phoneNumber(
                        request.getPhoneNumber()
                )

                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )

                .role(
                        request.getRole()
                                .toUpperCase()
                )

                .active(true)

                .build();


        // -------------------------------------------------
        // SAVE USER
        // -------------------------------------------------

        userRepository.save(user);
    }


    // =====================================================
    // LOGIN
    // =====================================================

    @Override
    public LoginResponse login(
            LoginRequest request
    ) {

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(

                        request.getUsername(),

                        request.getPassword()
                )
        );


        // -------------------------------------------------
        // FIND USER
        // -------------------------------------------------

        User user = userRepository

                .findByUsername(
                        request.getUsername()
                )

                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );


        // -------------------------------------------------
        // USER DETAILS
        // -------------------------------------------------

        UserDetails userDetails =

                org.springframework.security.core.userdetails.User

                        .withUsername(
                                user.getUsername()
                        )

                        .password(
                                user.getPassword()
                        )

                        .authorities(
                                "ROLE_" + user.getRole()
                        )

                        .build();


        // -------------------------------------------------
        // GENERATE JWT
        // -------------------------------------------------

        String token =
                jwtService.generateToken(
                        userDetails
                );


        // -------------------------------------------------
        // RETURN RESPONSE
        // -------------------------------------------------

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getRole()
        );
    }
}