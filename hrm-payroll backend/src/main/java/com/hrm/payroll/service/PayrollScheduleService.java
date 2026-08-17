package com.hrm.payroll.service;

import com.hrm.payroll.dto.PayrollProcessingResponse;
import com.hrm.payroll.dto.PayrollScheduleRequest;
import com.hrm.payroll.dto.PayrollScheduleResponse;

public interface PayrollScheduleService {

    PayrollScheduleResponse getSchedule();

    PayrollScheduleResponse saveSchedule(
            PayrollScheduleRequest request
    );

    PayrollProcessingResponse runNow();
}