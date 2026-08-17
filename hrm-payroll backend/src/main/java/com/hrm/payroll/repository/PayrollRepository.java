package com.hrm.payroll.repository;

import com.hrm.payroll.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PayrollRepository
        extends JpaRepository<Payroll, Long> {

    List<Payroll> findByEmployeeId(Long employeeId);

    Optional<Payroll> findByEmployeeIdAndPayPeriod(
            Long employeeId,
            String payPeriod
    );

    long countByStatus(String status);
    long countByPayPeriodAndStatusIgnoreCase(
            String payPeriod,
            String status
    );

    List<Payroll> findByPayPeriod(
            String payPeriod
    );

    List<Payroll> findByPayPeriodOrderByProcessedAtDesc(
            String payPeriod
    );
    List<Payroll> findTop5ByOrderByProcessedAtDesc();
}