package com.hrm.payroll.service;

import com.hrm.payroll.dto.ChangePasswordRequest;
import com.hrm.payroll.dto.LoginRequest;
import com.hrm.payroll.dto.LoginResponse;
import com.hrm.payroll.dto.RegisterRequest;

public interface AuthService {

    void register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
    void changePassword(
            String username,
            ChangePasswordRequest request
    );
}