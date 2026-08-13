package com.hrm.payroll.controller;

import com.hrm.payroll.dto.EmailLogResponse;
import com.hrm.payroll.service.EmailLogService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/email-logs")
@RequiredArgsConstructor
public class EmailLogController {

    private final EmailLogService emailLogService;


    @GetMapping
    public ResponseEntity<List<EmailLogResponse>> getAllLogs() {

        return ResponseEntity.ok(
                emailLogService.getAllLogs()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<EmailLogResponse> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                emailLogService.getById(id)
        );
    }


    @PostMapping("/{id}/retry")
    public ResponseEntity<String> retryEmail(
            @PathVariable Long id) {

        emailLogService.retryEmail(id);

        return ResponseEntity.ok(
                "Payslip email sent successfully"
        );
    }
}