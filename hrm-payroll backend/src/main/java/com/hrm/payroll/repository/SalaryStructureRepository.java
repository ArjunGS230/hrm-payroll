package com.hrm.payroll.repository;

import com.hrm.payroll.entity.SalaryStructure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SalaryStructureRepository
        extends JpaRepository<SalaryStructure, Long> {

    Optional<SalaryStructure> findTopByEmployeeIdOrderByEffectiveFromDesc(
            Long employeeId
    );

    boolean existsByEmployeeId(Long employeeId);
}