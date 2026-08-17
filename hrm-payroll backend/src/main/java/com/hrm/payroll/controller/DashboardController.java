package com.hrm.payroll.controller;

import com.hrm.payroll.dto.DashboardSummaryResponse;
import com.hrm.payroll.dto.RecentPayrollResponse;
import com.hrm.payroll.service.DashboardService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;


    // =====================================================
    // DASHBOARD SUMMARY
    // =====================================================

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse>
    getDashboardSummary() {

        return ResponseEntity.ok(
                dashboardService.getDashboardSummary()
        );
    }


    // =====================================================
    // RECENT PAYROLL
    // =====================================================

    @GetMapping("/recent-payroll")
    public ResponseEntity<List<RecentPayrollResponse>>
    getRecentPayroll() {

        return ResponseEntity.ok(
                dashboardService.getRecentPayroll()
        );
    }

}