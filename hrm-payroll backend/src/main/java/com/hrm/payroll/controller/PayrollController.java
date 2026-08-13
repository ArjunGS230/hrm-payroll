package com.hrm.payroll.controller;

import com.hrm.payroll.dto.PayrollResponse;
import com.hrm.payroll.service.PayrollService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payrolls")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;


    @GetMapping
    public ResponseEntity<List<PayrollResponse>> getAll() {

        return ResponseEntity.ok(
                payrollService.getAll()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<PayrollResponse> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                payrollService.getById(id)
        );
    }


    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PayrollResponse>> getByEmployee(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                payrollService.getByEmployee(employeeId)
        );
    }
}