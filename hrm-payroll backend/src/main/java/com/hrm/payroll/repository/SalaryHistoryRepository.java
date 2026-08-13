package com.hrm.payroll.repository;

import com.hrm.payroll.entity.SalaryHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalaryHistoryRepository
        extends JpaRepository<SalaryHistory, Long> {

    List<SalaryHistory> findByEmployeeIdOrderByEffectiveFromDesc(
            Long employeeId
    );
}