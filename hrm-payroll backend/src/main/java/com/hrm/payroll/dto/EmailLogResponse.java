package com.hrm.payroll.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class EmailLogResponse {

    private Long id;

    private Long employeeId;

    private String employeeCode;

    private String employeeName;

    private String email;

    private Long payslipId;

    private String payPeriod;

    private String status;

    private LocalDateTime sentAt;

    private String errorMessage;

    private Integer retryCount;
}