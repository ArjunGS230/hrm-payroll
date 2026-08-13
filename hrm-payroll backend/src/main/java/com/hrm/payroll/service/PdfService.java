package com.hrm.payroll.service;

import com.hrm.payroll.dto.PayslipResponse;

public interface PdfService {

    String generatePayslipPdf(PayslipResponse payslip);
}