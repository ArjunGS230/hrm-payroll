package com.hrm.payroll.service;

import com.hrm.payroll.dto.EmailLogResponse;

import java.util.List;

public interface EmailLogService {

    List<EmailLogResponse> getAllLogs();

    EmailLogResponse getById(Long id);

    List<EmailLogResponse> getAllEmailLogs();

    void retryEmail(Long id);
}