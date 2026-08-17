package com.hrm.payroll.controller;

import com.hrm.payroll.dto.PayrollResponse;
import com.hrm.payroll.service.PayrollService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payrolls")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;


    // =========================================================
    // GET ALL PAYROLLS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<PayrollResponse>> getAll() {

        return ResponseEntity.ok(
                payrollService.getAll()
        );
    }


    // =========================================================
    // GET PAYROLL BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<PayrollResponse> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                payrollService.getById(id)
        );
    }


    // =========================================================
    // GET PAYROLL BY EMPLOYEE ID
    // =========================================================

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PayrollResponse>> getByEmployee(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                payrollService.getByEmployee(employeeId)
        );
    }


    // =========================================================
    // EXPORT PAYROLL TO EXCEL
    // =========================================================

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportPayrollToExcel() {

        byte[] excelFile =
                payrollService.exportPayrollToExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Payroll.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excelFile);
    }


    // =========================================================
    // GET MY PAYROLL
    // =========================================================

    @GetMapping("/my")
    public ResponseEntity<List<PayrollResponse>> getMyPayroll(
            Authentication authentication) {

        String username =
                authentication.getName();

        return ResponseEntity.ok(
                payrollService.getMyPayroll(username)
        );
    }
}