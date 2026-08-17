package com.hrm.payroll.controller;

import com.hrm.payroll.dto.PayrollProcessingResponse;
import com.hrm.payroll.dto.PayrollScheduleRequest;
import com.hrm.payroll.dto.PayrollScheduleResponse;
import com.hrm.payroll.service.PayrollScheduleService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payroll-schedule")
@RequiredArgsConstructor
public class PayrollScheduleController {

    private final PayrollScheduleService payrollScheduleService;


    // =========================================================
    // GET CURRENT SCHEDULE
    // =========================================================

    @GetMapping
    public ResponseEntity<PayrollScheduleResponse>
    getSchedule() {

        return ResponseEntity.ok(
                payrollScheduleService.getSchedule()
        );
    }


    // =========================================================
    // SAVE / UPDATE SCHEDULE
    // =========================================================

    @PutMapping
    public ResponseEntity<PayrollScheduleResponse>
    saveSchedule(
            @RequestBody PayrollScheduleRequest request) {

        return ResponseEntity.ok(
                payrollScheduleService.saveSchedule(
                        request
                )
        );
    }


    // =========================================================
    // RUN NOW
    // =========================================================

    @PostMapping("/run-now")
    public ResponseEntity<PayrollProcessingResponse>
    runNow() {

        PayrollProcessingResponse response =
                payrollScheduleService.runNow();

        return ResponseEntity.ok(
                response
        );
    }
}