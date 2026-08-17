package com.hrm.payroll.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollFailureResponse {

    private String employeeId;

    private String employeeName;

    private String email;

    private String reason;
}