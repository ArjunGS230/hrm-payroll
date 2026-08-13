package com.hrm.payroll.controller;

import com.hrm.payroll.dto.LeaveBalanceResponse;
import com.hrm.payroll.dto.LeaveRequest;
import com.hrm.payroll.dto.LeaveResponse;
import com.hrm.payroll.service.LeaveService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;


    // ==========================================
    // APPLY LEAVE
    // ==========================================

    @PostMapping
    public ResponseEntity<LeaveResponse> applyLeave(
            @RequestBody LeaveRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(leaveService.applyLeave(request));
    }


    // ==========================================
    // GET LEAVE BALANCE
    // ==========================================

    @GetMapping("/balance/{employeeId}")
    public ResponseEntity<LeaveBalanceResponse> getLeaveBalance(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                leaveService.getLeaveBalance(employeeId)
        );
    }


    // ==========================================
    // GET EMPLOYEE LEAVES
    // ==========================================

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveResponse>> getEmployeeLeaves(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                leaveService.getEmployeeLeaves(employeeId)
        );
    }


    // ==========================================
    // GET PENDING LEAVES
    // ==========================================

    @GetMapping("/pending")
    public ResponseEntity<List<LeaveResponse>> getPendingLeaves() {

        return ResponseEntity.ok(
                leaveService.getPendingLeaves()
        );
    }


    // ==========================================
    // APPROVE LEAVE
    // ==========================================

    @PutMapping("/{leaveId}/approve")
    public ResponseEntity<LeaveResponse> approveLeave(
            @PathVariable Long leaveId) {

        return ResponseEntity.ok(
                leaveService.approveLeave(leaveId)
        );
    }


    // ==========================================
    // REJECT LEAVE
    // ==========================================

    @PutMapping("/{leaveId}/reject")
    public ResponseEntity<LeaveResponse> rejectLeave(
            @PathVariable Long leaveId) {

        return ResponseEntity.ok(
                leaveService.rejectLeave(leaveId)
        );
    }
}