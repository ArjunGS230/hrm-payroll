package com.hrm.payroll.service.impl;

import com.hrm.payroll.dto.LoginRequest;
import com.hrm.payroll.dto.LoginResponse;
import com.hrm.payroll.dto.RegisterRequest;

import com.hrm.payroll.entity.AccountStatus;
import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.EmployeeStatus;
import com.hrm.payroll.entity.User;

import com.hrm.payroll.repository.EmployeeRepository;
import com.hrm.payroll.repository.UserRepository;

import com.hrm.payroll.security.JwtService;
import com.hrm.payroll.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hrm.payroll.dto.ChangePasswordRequest;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {


    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final EmployeeRepository employeeRepository;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;


    // =====================================================
    // REGISTER
    // =====================================================

    @Override
    public void register(
            RegisterRequest request) {


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
        // GET ROLE
        // -------------------------------------------------

        String role =
                request.getRole()
                        .trim()
                        .toUpperCase();


        // =================================================
        // CREATE USER
        // =================================================

        User.UserBuilder userBuilder =
                User.builder()

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
                                role
                        );


        // -------------------------------------------------
        // EMPLOYEE ACCOUNT
        // -------------------------------------------------

        if ("EMPLOYEE".equals(role)) {

            /*
             * Employee accounts must wait for HR approval.
             */

            userBuilder

                    .status(
                            AccountStatus.PENDING
                    )

                    .active(false);

        } else {

            /*
             * HR / ADMIN accounts are active immediately.
             */

            userBuilder

                    .status(
                            AccountStatus.APPROVED
                    )

                    .active(true);
        }


        // -------------------------------------------------
        // BUILD USER
        // -------------------------------------------------

        User user =
                userBuilder.build();


        // -------------------------------------------------
        // SAVE USER
        // -------------------------------------------------

        User savedUser =
                userRepository.save(
                        user
                );


        // =================================================
        // CREATE EMPLOYEE RECORD
        // =================================================

        if ("EMPLOYEE".equals(role)) {


            // -------------------------------------------------
            // GENERATE EMPLOYEE CODE
            //
            // HRMEMP001
            // HRMEMP002
            // HRMEMP003
            // ...
            // -------------------------------------------------

            String employeeCode =
                    generateEmployeeCode();


            // -------------------------------------------------
            // CREATE EMPLOYEE
            // -------------------------------------------------

            Employee employee =
                    Employee.builder()

                            .employeeCode(
                                    employeeCode
                            )

                            .name(
                                    request.getUsername()
                            )

                            .email(
                                    savedUser.getEmail()
                            )

                            /*
                             * HR will assign these details
                             * before approving the employee.
                             */

                            .department(
                                    "Not Assigned"
                            )

                            .designation(
                                    "Not Assigned"
                            )

                            .joiningDate(
                                    null
                            )

                            /*
                             * Employee must wait for HR.
                             */

                            .active(false)

                            .status(
                                    EmployeeStatus.PENDING
                            )

                            .build();


            // -------------------------------------------------
            // SAVE EMPLOYEE
            // -------------------------------------------------

            employeeRepository.save(
                    employee
            );
        }
    }


    // =====================================================
    // GENERATE EMPLOYEE CODE
    // =====================================================

    private String generateEmployeeCode() {


        /*
         * Start with the number of existing employees + 1.
         *
         * Example:
         *
         * 5 employees exist
         * nextNumber = 6
         *
         * Result:
         * HRMEMP006
         */

        long nextNumber =
                employeeRepository.count() + 1;


        String employeeCode;


        // -------------------------------------------------
        // CHECK FOR DUPLICATE
        // -------------------------------------------------

        do {

            employeeCode =
                    String.format(
                            "HRMEMP%03d",
                            nextNumber
                    );


            nextNumber++;

        } while (
                employeeRepository
                        .findByEmployeeCode(
                                employeeCode
                        )
                        .isPresent()
        );


        return employeeCode;
    }
    @Override
    public void changePassword(
            String username,
            ChangePasswordRequest request) {

        // Find user
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        // Check current password
        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Current password is incorrect"
            );
        }

        // Check new password
        if (request.getNewPassword() == null ||
                request.getNewPassword().length() < 6) {

            throw new RuntimeException(
                    "New password must contain at least 6 characters"
            );
        }

        // Check confirmation
        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new RuntimeException(
                    "New passwords do not match"
            );
        }

        // Prevent same password
        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "New password must be different from current password"
            );
        }

        // Encode new password
        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        // Save
        userRepository.save(user);
    }

    // =====================================================
    // LOGIN
    // =====================================================

    @Override
    public LoginResponse login(
            LoginRequest request
    ) {


        // -------------------------------------------------
        // FIND USER FIRST
        // -------------------------------------------------

        User user =
                userRepository

                        .findByUsername(
                                request.getUsername()
                        )

                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        // -------------------------------------------------
        // CHECK ACCOUNT STATUS
        // -------------------------------------------------

        if (!user.isActive()) {


            // -------------------------------------------------
            // EMPLOYEE ACCOUNT
            // -------------------------------------------------

            if (
                    "EMPLOYEE".equalsIgnoreCase(
                            user.getRole()
                    )
            ) {


                // -------------------------------------------------
                // PENDING
                // -------------------------------------------------

                if (
                        user.getStatus()
                                == AccountStatus.PENDING
                ) {

                    throw new RuntimeException(
                            "Your employee account is pending HR approval."
                    );
                }


                // -------------------------------------------------
                // REJECTED
                // -------------------------------------------------

                if (
                        user.getStatus()
                                == AccountStatus.REJECTED
                ) {

                    throw new RuntimeException(
                            "Your employee account request has been rejected."
                    );
                }
            }


            // -------------------------------------------------
            // OTHER INACTIVE ACCOUNT
            // -------------------------------------------------

            throw new RuntimeException(
                    "Your account is inactive."
            );
        }


        // -------------------------------------------------
        // AUTHENTICATE USERNAME + PASSWORD
        // -------------------------------------------------

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(

                        request.getUsername(),

                        request.getPassword()
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
                user.getEmail(),
                user.getRole()
        );
    }
}