package com.hrm.payroll.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LeaveBalanceResponse {

    private Long employeeId;

    private String employeeName;

    private Integer casualLeave;

    private Integer sickLeave;

    private Integer earnedLeave;
}