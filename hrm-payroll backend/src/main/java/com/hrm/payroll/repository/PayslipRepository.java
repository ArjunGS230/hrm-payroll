package com.hrm.payroll.repository;

import com.hrm.payroll.entity.Payslip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PayslipRepository
        extends JpaRepository<Payslip, Long> {

    List<Payslip> findByPayroll_Employee_Id(Long employeeId);

    Optional<Payslip> findByPayroll_Employee_IdAndPayroll_PayPeriod(
            Long employeeId,
            String payPeriod
    );
    long countByGeneratedAtBetween(
            LocalDateTime start,
            LocalDateTime end
    );
}