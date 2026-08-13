package com.hrm.payroll.controller;

import com.hrm.payroll.dto.SalaryStructureRequest;
import com.hrm.payroll.dto.SalaryStructureResponse;
import com.hrm.payroll.service.SalaryStructureService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salary-structures")
@RequiredArgsConstructor
public class SalaryStructureController {

    private final SalaryStructureService salaryStructureService;


    @PostMapping
    public ResponseEntity<SalaryStructureResponse> create(
            @RequestBody SalaryStructureRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        salaryStructureService.create(request)
                );
    }


    @GetMapping("/{id}")
    public ResponseEntity<SalaryStructureResponse> getById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                salaryStructureService.getById(id)
        );
    }


    @GetMapping
    public ResponseEntity<List<SalaryStructureResponse>> getAll() {

        return ResponseEntity.ok(
                salaryStructureService.getAll()
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<SalaryStructureResponse> update(
            @PathVariable Long id,
            @RequestBody SalaryStructureRequest request) {

        return ResponseEntity.ok(
                salaryStructureService.update(
                        id,
                        request
                )
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        salaryStructureService.delete(id);

        return ResponseEntity.noContent().build();
    }
}