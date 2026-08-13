package com.hrm.payroll.service.impl;

import com.hrm.payroll.dto.SalaryStructureRequest;
import com.hrm.payroll.exception.DuplicateResourceException;
import com.hrm.payroll.dto.SalaryStructureResponse;
import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.SalaryStructure;
import com.hrm.payroll.exception.BadRequestException;
import com.hrm.payroll.exception.ResourceNotFoundException;
import com.hrm.payroll.repository.EmployeeRepository;
import com.hrm.payroll.repository.SalaryStructureRepository;
import com.hrm.payroll.service.SalaryStructureService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SalaryStructureServiceImpl
        implements SalaryStructureService {

    private final SalaryStructureRepository salaryStructureRepository;

    private final EmployeeRepository employeeRepository;


    // =========================================================
    // CREATE
    // =========================================================

    @Override
    public SalaryStructureResponse create(
            SalaryStructureRequest request) {

        validate(request);

        Employee employee =
                employeeRepository.findById(
                        request.getEmployeeId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: "
                                        + request.getEmployeeId()
                        )
                );
        if (salaryStructureRepository
                .existsByEmployeeId(request.getEmployeeId())) {

            throw new DuplicateResourceException(
                    "Salary structure already exists for employee: "
                            + request.getEmployeeId()
            );
        }


        BigDecimal grossSalary =
                request.getBasicSalary()
                        .add(request.getHra())
                        .add(request.getSpecialAllowance());


        BigDecimal totalDeductions =
                request.getPf()
                        .add(request.getEsi())
                        .add(request.getProfessionalTax());


        BigDecimal netSalary =
                grossSalary.subtract(
                        totalDeductions
                );


        SalaryStructure salaryStructure =
                SalaryStructure.builder()
                        .employee(employee)
                        .basicSalary(
                                request.getBasicSalary()
                        )
                        .hra(
                                request.getHra()
                        )
                        .specialAllowance(
                                request.getSpecialAllowance()
                        )
                        .grossSalary(
                                grossSalary
                        )
                        .effectiveFrom(
                                request.getEffectiveFrom()
                        )
                        .pf(
                                request.getPf()
                        )
                        .esi(
                                request.getEsi()
                        )
                        .professionalTax(
                                request.getProfessionalTax()
                        )
                        .netSalary(
                                netSalary
                        )
                        .build();


        SalaryStructure saved =
                salaryStructureRepository.save(
                        salaryStructure
                );


        return convertToResponse(saved);
    }


    // =========================================================
    // GET BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public SalaryStructureResponse getById(
            Long id) {

        if (id == null) {
            throw new BadRequestException(
                    "Salary structure ID is required"
            );
        }


        SalaryStructure salaryStructure =
                salaryStructureRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Salary structure not found "
                                                + "with id: "
                                                + id
                                )
                        );


        return convertToResponse(
                salaryStructure
        );
    }


    // =========================================================
    // GET ALL
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<SalaryStructureResponse> getAll() {

        return salaryStructureRepository
                .findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // =========================================================
    // UPDATE
    // =========================================================

    @Override
    public SalaryStructureResponse update(
            Long id,
            SalaryStructureRequest request) {

        if (id == null) {
            throw new BadRequestException(
                    "Salary structure ID is required"
            );
        }

        validate(request);


        SalaryStructure salaryStructure =
                salaryStructureRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Salary structure not found "
                                                + "with id: "
                                                + id
                                )
                        );


        // Update employee if employeeId is supplied

        Employee employee =
                employeeRepository.findById(
                        request.getEmployeeId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: "
                                        + request.getEmployeeId()
                        )
                );


        BigDecimal grossSalary =
                request.getBasicSalary()
                        .add(request.getHra())
                        .add(request.getSpecialAllowance());


        BigDecimal totalDeductions =
                request.getPf()
                        .add(request.getEsi())
                        .add(request.getProfessionalTax());


        BigDecimal netSalary =
                grossSalary.subtract(
                        totalDeductions
                );


        salaryStructure.setEmployee(
                employee
        );

        salaryStructure.setBasicSalary(
                request.getBasicSalary()
        );

        salaryStructure.setHra(
                request.getHra()
        );

        salaryStructure.setSpecialAllowance(
                request.getSpecialAllowance()
        );

        salaryStructure.setGrossSalary(
                grossSalary
        );

        salaryStructure.setEffectiveFrom(
                request.getEffectiveFrom()
        );

        salaryStructure.setPf(
                request.getPf()
        );

        salaryStructure.setEsi(
                request.getEsi()
        );

        salaryStructure.setProfessionalTax(
                request.getProfessionalTax()
        );

        salaryStructure.setNetSalary(
                netSalary
        );


        SalaryStructure updated =
                salaryStructureRepository.save(
                        salaryStructure
                );


        return convertToResponse(
                updated
        );
    }


    // =========================================================
    // DELETE
    // =========================================================

    @Override
    public void delete(Long id) {

        if (id == null) {
            throw new BadRequestException(
                    "Salary structure ID is required"
            );
        }


        if (!salaryStructureRepository
                .existsById(id)) {

            throw new ResourceNotFoundException(
                    "Salary structure not found with id: "
                            + id
            );
        }


        salaryStructureRepository.deleteById(id);
    }


    // =========================================================
    // VALIDATION
    // =========================================================

    private void validate(
            SalaryStructureRequest request) {

        if (request == null) {

            throw new BadRequestException(
                    "Salary structure request cannot be null"
            );
        }


        if (request.getEmployeeId() == null) {

            throw new BadRequestException(
                    "Employee ID is required"
            );
        }


        if (request.getBasicSalary() == null ||
                request.getHra() == null ||
                request.getSpecialAllowance() == null ||
                request.getPf() == null ||
                request.getEsi() == null ||
                request.getProfessionalTax() == null) {

            throw new BadRequestException(
                    "All salary components are required"
            );
        }


        if (request.getEffectiveFrom() == null) {

            throw new BadRequestException(
                    "Effective date is required"
            );
        }


        if (request.getBasicSalary().signum() < 0 ||
                request.getHra().signum() < 0 ||
                request.getSpecialAllowance().signum() < 0 ||
                request.getPf().signum() < 0 ||
                request.getEsi().signum() < 0 ||
                request.getProfessionalTax().signum() < 0) {

            throw new BadRequestException(
                    "Salary components cannot be negative"
            );
        }
    }


    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    private SalaryStructureResponse convertToResponse(
            SalaryStructure salaryStructure) {

        return SalaryStructureResponse.builder()

                .id(
                        salaryStructure.getId()
                )

                .employeeId(
                        salaryStructure
                                .getEmployee()
                                .getId()
                )

                .basicSalary(
                        salaryStructure.getBasicSalary()
                )

                .hra(
                        salaryStructure.getHra()
                )

                .specialAllowance(
                        salaryStructure
                                .getSpecialAllowance()
                )

                .grossSalary(
                        salaryStructure.getGrossSalary()
                )

                .effectiveFrom(
                        salaryStructure
                                .getEffectiveFrom()
                )

                .pf(
                        salaryStructure.getPf()
                )

                .esi(
                        salaryStructure.getEsi()
                )

                .professionalTax(
                        salaryStructure
                                .getProfessionalTax()
                )

                .netSalary(
                        salaryStructure
                                .getNetSalary()
                )

                .build();
    }
}