package com.hrm.payroll.repository;

import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.LeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LeaveBalanceRepository
        extends JpaRepository<LeaveBalance, Long> {

    Optional<LeaveBalance> findByEmployee(Employee employee);

    Optional<LeaveBalance> findByEmployeeId(Long employeeId);
}