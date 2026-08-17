package com.hrm.payroll.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollProcessingResponse {

    private String payPeriod;

    private int successful;

    private int skipped;

    private int failed;

    private String message;

    private List<String> failedEmployeeIds;

    private List<PayrollFailureResponse> failures;
}