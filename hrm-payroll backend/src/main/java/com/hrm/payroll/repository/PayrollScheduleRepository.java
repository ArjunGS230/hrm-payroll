package com.hrm.payroll.repository;

import com.hrm.payroll.entity.PayrollSchedule;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PayrollScheduleRepository
        extends JpaRepository<PayrollSchedule, Long> {

}