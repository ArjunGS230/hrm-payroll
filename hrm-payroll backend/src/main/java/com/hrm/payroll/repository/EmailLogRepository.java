package com.hrm.payroll.repository;

import com.hrm.payroll.entity.EmailLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmailLogRepository
        extends JpaRepository<EmailLog, Long> {

    Optional<EmailLog> findByPayslipId(Long payslipId);

    List<EmailLog> findAllByOrderBySentAtDesc();
}