package com.hrm.payroll.repository;

import com.hrm.payroll.entity.LeaveApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveApplicationRepository
        extends JpaRepository<LeaveApplication, Long> {

    List<LeaveApplication> findByEmployeeId(Long employeeId);

    List<LeaveApplication> findByStatus(String status);
    long countByStatusIgnoreCase(String status);
}