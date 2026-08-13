package com.hrm.payroll.controller;

import com.hrm.payroll.dto.PayslipResponse;
import com.hrm.payroll.service.PayslipService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payslips")
@RequiredArgsConstructor
public class PayslipController {

    private final PayslipService payslipService;


    // Generate monthly payslip
    @PostMapping("/generate/{employeeId}")
    public ResponseEntity<PayslipResponse> generatePayslip(
            @PathVariable Long employeeId,
            @RequestParam String payPeriod) {

        PayslipResponse response =
                payslipService.generatePayslip(
                        employeeId,
                        payPeriod
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    @PostMapping("/{id}/send-email")
    public ResponseEntity<String> sendPayslipEmail(
            @PathVariable Long id) {

        System.out.println("SEND EMAIL CONTROLLER HIT - ID = " + id);

        payslipService.sendPayslipEmail(id);

        return ResponseEntity.ok(
                "Payslip email sent successfully"
        );
    }

    // Get payslip by ID
    @GetMapping("/{id}")
    public ResponseEntity<PayslipResponse> getPayslipById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                payslipService.getPayslipById(id)
        );
    }


    // Get all payslips of an employee
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PayslipResponse>> getEmployeePayslips(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                payslipService.getEmployeePayslips(employeeId)
        );
    }


    // Get all payslips
    @GetMapping
    public ResponseEntity<List<PayslipResponse>> getAllPayslips() {

        return ResponseEntity.ok(
                payslipService.getAllPayslips()
        );
    }
}