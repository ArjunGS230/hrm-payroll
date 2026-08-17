package com.hrm.payroll.controller;

import com.hrm.payroll.dto.PayslipResponse;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<?> generatePayslip(
            @PathVariable Long employeeId,
            @RequestParam String payPeriod) {

        System.out.println("====================================");
        System.out.println("GENERATE PAYSLIP REQUEST");
        System.out.println("Employee ID : " + employeeId);
        System.out.println("Pay Period  : " + payPeriod);
        System.out.println("====================================");

        try {

            PayslipResponse response =
                    payslipService.generatePayslip(
                            employeeId,
                            payPeriod
                    );

            System.out.println(
                    "PAYSLIP GENERATION SUCCESS"
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (Exception e) {

            System.out.println(
                    "===================================="
            );

            System.out.println(
                    "PAYSLIP GENERATION FAILED"
            );

            System.out.println(
                    "ERROR TYPE : "
                            + e.getClass().getName()
            );

            System.out.println(
                    "ERROR MESSAGE : "
                            + e.getMessage()
            );

            e.printStackTrace();

            System.out.println(
                    "===================================="
            );


            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            java.util.Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unknown server error"
                            )
                    );
        }
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
    @GetMapping("/my")
    public ResponseEntity<List<PayslipResponse>> getMyPayslips(
            Authentication authentication) {

        String username =
                authentication.getName();

        return ResponseEntity.ok(
                payslipService.getMyPayslips(username)
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