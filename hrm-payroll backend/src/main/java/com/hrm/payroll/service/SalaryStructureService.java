package com.hrm.payroll.service;

import com.hrm.payroll.dto.SalaryStructureRequest;
import com.hrm.payroll.dto.SalaryStructureResponse;

import java.util.List;

public interface SalaryStructureService {

    SalaryStructureResponse create(
            SalaryStructureRequest request
    );

    SalaryStructureResponse getById(Long id);

    List<SalaryStructureResponse> getAll();

    SalaryStructureResponse update(
            Long id,
            SalaryStructureRequest request
    );

    void delete(Long id);
}