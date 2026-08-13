package com.hrm.payroll.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class EmployeeResponse {

    private Long id;
    private String employeeCode;
    private String name;
    private String email;
    private String department;
    private String designation;
    private LocalDate joiningDate;
    private boolean active;
}