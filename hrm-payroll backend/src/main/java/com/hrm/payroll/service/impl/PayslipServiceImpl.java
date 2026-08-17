package com.hrm.payroll.service.impl;

import com.hrm.payroll.dto.PayslipResponse;

import com.hrm.payroll.entity.EmailLog;
import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.LeaveBalance;
import com.hrm.payroll.entity.Payroll;
import com.hrm.payroll.entity.Payslip;
import com.hrm.payroll.entity.SalaryStructure;
import com.hrm.payroll.entity.User;

import com.hrm.payroll.exception.BadRequestException;
import com.hrm.payroll.exception.DuplicateResourceException;
import com.hrm.payroll.exception.ResourceNotFoundException;

import com.hrm.payroll.repository.EmailLogRepository;
import com.hrm.payroll.repository.EmployeeRepository;
import com.hrm.payroll.repository.LeaveBalanceRepository;
import com.hrm.payroll.repository.PayrollRepository;
import com.hrm.payroll.repository.PayslipRepository;
import com.hrm.payroll.repository.SalaryStructureRepository;
import com.hrm.payroll.repository.UserRepository;

import com.hrm.payroll.service.EmailService;
import com.hrm.payroll.service.PayslipService;
import com.hrm.payroll.service.PdfService;

import jakarta.persistence.EntityManager;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PayslipServiceImpl
        implements PayslipService {


    private final EmployeeRepository employeeRepository;

    private final SalaryStructureRepository salaryStructureRepository;

    private final LeaveBalanceRepository leaveBalanceRepository;

    private final PayrollRepository payrollRepository;

    private final PayslipRepository payslipRepository;

    private final EmailLogRepository emailLogRepository;

    private final PdfService pdfService;

    private final EmailService emailService;

    private final UserRepository userRepository;

    private final EntityManager entityManager;


    // =========================================================
    // GENERATE PAYSLIP
    // =========================================================

    @Override
    public PayslipResponse generatePayslip(
            Long employeeId,
            String payPeriod) {


        // =====================================================
        // 1. VALIDATE EMPLOYEE ID
        // =====================================================

        if (employeeId == null) {

            throw new BadRequestException(
                    "Employee ID is required"
            );
        }


        // =====================================================
        // 2. VALIDATE PAY PERIOD
        // =====================================================

        if (payPeriod == null ||
                payPeriod.trim().isEmpty()) {

            throw new BadRequestException(
                    "Pay period is required"
            );
        }


        payPeriod =
                payPeriod.trim();


        try {

            YearMonth.parse(
                    payPeriod
            );

        } catch (DateTimeParseException e) {

            throw new BadRequestException(
                    "Invalid pay period. Use YYYY-MM format, "
                            + "for example 2026-11"
            );
        }


        // =====================================================
        // 3. FIND EMPLOYEE
        // =====================================================

        Employee employee =
                employeeRepository
                        .findById(employeeId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found with id: "
                                                + employeeId
                                )
                        );


        // =====================================================
        // 4. CHECK EMPLOYEE ACTIVE
        // =====================================================

        if (!employee.isActive()) {

            throw new BadRequestException(
                    "Inactive employee cannot generate payroll"
            );
        }


        // =====================================================
        // 5. PREVENT DUPLICATE PAYROLL
        // =====================================================

        if (payrollRepository
                .findByEmployeeIdAndPayPeriod(
                        employeeId,
                        payPeriod
                )
                .isPresent()) {

            throw new DuplicateResourceException(
                    "Payroll already exists for employee "
                            + employeeId
                            + " for "
                            + payPeriod
            );
        }


        // =====================================================
        // 6. FIND LATEST SALARY STRUCTURE
        // =====================================================

        SalaryStructure salaryStructure =
                salaryStructureRepository
                        .findTopByEmployeeIdOrderByEffectiveFromDesc(
                                employeeId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Salary structure not found "
                                                + "for employee: "
                                                + employeeId
                                )
                        );


        // =====================================================
        // 7. FIND LEAVE BALANCE
        // =====================================================

        LeaveBalance leaveBalance =
                leaveBalanceRepository
                        .findByEmployeeId(
                                employeeId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Leave balance not found "
                                                + "for employee: "
                                                + employeeId
                                )
                        );


        // =====================================================
        // 8. GET SALARY VALUES
        // =====================================================

        BigDecimal grossSalary =
                salaryStructure.getGrossSalary();

        BigDecimal pf =
                salaryStructure.getPf();

        BigDecimal esi =
                salaryStructure.getEsi();

        BigDecimal professionalTax =
                salaryStructure.getProfessionalTax();


        // =====================================================
        // 9. CALCULATE TOTAL DEDUCTIONS
        // =====================================================

        BigDecimal totalDeductions =
                pf
                        .add(esi)
                        .add(professionalTax);


        // =====================================================
        // 10. CALCULATE NET SALARY
        // =====================================================

        BigDecimal netSalary =
                grossSalary.subtract(
                        totalDeductions
                );


        // =====================================================
        // 11. CREATE PAYROLL
        // =====================================================

        Payroll payroll =
                Payroll.builder()
                        .employee(employee)
                        .payPeriod(payPeriod)
                        .grossSalary(grossSalary)
                        .totalDeductions(
                                totalDeductions
                        )
                        .netSalary(netSalary)
                        .status("PROCESSED")
                        .processedAt(
                                LocalDateTime.now()
                        )
                        .build();


        Payroll savedPayroll =
                payrollRepository.save(
                        payroll
                );


        // =====================================================
        // 12. CREATE PAYSLIP
        // =====================================================

        Payslip payslip =
                Payslip.builder()
                        .payroll(savedPayroll)
                        .generatedAt(
                                LocalDateTime.now()
                        )
                        .build();


        Payslip savedPayslip =
                payslipRepository.save(
                        payslip
                );


        // =====================================================
        // FLUSH PAYSLIP
        // =====================================================

        entityManager.flush();


        // =====================================================
        // 13. CREATE RESPONSE
        // =====================================================

        PayslipResponse response =
                mapToResponse(
                        savedPayslip,
                        employee,
                        salaryStructure,
                        leaveBalance,
                        totalDeductions,
                        netSalary
                );


        // =====================================================
        // 14. GENERATE PDF
        // =====================================================

        String pdfPath =
                pdfService.generatePayslipPdf(
                        response
                );


        if (pdfPath == null ||
                pdfPath.trim().isEmpty()) {

            throw new BadRequestException(
                    "Payslip PDF could not be generated"
            );
        }


        // =====================================================
        // 15. SAVE PDF INFORMATION
        // =====================================================

        savedPayslip.setFilePath(
                pdfPath
        );

        savedPayslip.setFileName(
                new File(
                        pdfPath
                ).getName()
        );


        savedPayslip =
                payslipRepository.save(
                        savedPayslip
                );


        // =====================================================
        // 16. SEND PAYSLIP EMAIL
        // =====================================================

        emailService.sendPayslipEmail(
                employee,
                savedPayslip
        );


        // =====================================================
        // 17. GET EMAIL STATUS
        // =====================================================

        EmailLog emailLog =
                emailLogRepository
                        .findByPayslipId(
                                savedPayslip.getId()
                        )
                        .orElse(null);


        if (emailLog != null) {

            response.setEmailStatus(
                    emailLog.getStatus()
            );


            if ("SENT".equalsIgnoreCase(
                    emailLog.getStatus()
            )) {

                response.setMessage(
                        "Payslip generated and emailed successfully."
                );

            } else if ("FAILED".equalsIgnoreCase(
                    emailLog.getStatus()
            )) {

                response.setMessage(
                        "Payslip generated, but email delivery failed. "
                                + "It will be retried automatically."
                );

            } else {

                response.setMessage(
                        "Payslip generated successfully."
                );
            }

        } else {

            response.setEmailStatus(
                    "NOT_SENT"
            );

            response.setMessage(
                    "Payslip generated successfully."
            );
        }


        // =====================================================
        // 18. RETURN RESPONSE
        // =====================================================

        return response;
    }


    // =========================================================
    // GET MY PAYSLIPS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<PayslipResponse> getMyPayslips(
            String username) {


        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found: "
                                                + username
                                )
                        );


        Employee employee =
                employeeRepository
                        .findByEmail(
                                user.getEmail()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee profile not found for user: "
                                                + username
                                )
                        );


        return payslipRepository
                .findByPayroll_Employee_Id(
                        employee.getId()
                )
                .stream()
                .map(payslip -> {

                    Payroll payroll =
                            payslip.getPayroll();


                    if (payroll == null) {

                        throw new ResourceNotFoundException(
                                "Payroll not found for payslip: "
                                        + payslip.getId()
                        );
                    }


                    Employee payslipEmployee =
                            payroll.getEmployee();


                    if (payslipEmployee == null) {

                        throw new ResourceNotFoundException(
                                "Employee not found for payslip: "
                                        + payslip.getId()
                        );
                    }


                    SalaryStructure salaryStructure =
                            salaryStructureRepository
                                    .findTopByEmployeeIdOrderByEffectiveFromDesc(
                                            payslipEmployee.getId()
                                    )
                                    .orElseThrow(() ->
                                            new ResourceNotFoundException(
                                                    "Salary structure not found "
                                                            + "for employee: "
                                                            + payslipEmployee.getId()
                                            )
                                    );


                    LeaveBalance leaveBalance =
                            leaveBalanceRepository
                                    .findByEmployeeId(
                                            payslipEmployee.getId()
                                    )
                                    .orElseThrow(() ->
                                            new ResourceNotFoundException(
                                                    "Leave balance not found "
                                                            + "for employee: "
                                                            + payslipEmployee.getId()
                                            )
                                    );


                    return mapToResponse(
                            payslip,
                            payslipEmployee,
                            salaryStructure,
                            leaveBalance,
                            payroll.getTotalDeductions(),
                            payroll.getNetSalary()
                    );

                })
                .toList();
    }


    // =========================================================
    // GET PAYSLIP BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public PayslipResponse getPayslipById(
            Long id) {

        if (id == null) {

            throw new BadRequestException(
                    "Payslip ID is required"
            );
        }


        Payslip payslip =
                payslipRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payslip not found with id: "
                                                + id
                                )
                        );


        Payroll payroll =
                payslip.getPayroll();


        if (payroll == null) {

            throw new ResourceNotFoundException(
                    "Payroll not found for payslip: "
                            + id
            );
        }


        Employee employee =
                payroll.getEmployee();


        if (employee == null) {

            throw new ResourceNotFoundException(
                    "Employee not found for payslip: "
                            + id
            );
        }


        SalaryStructure salaryStructure =
                salaryStructureRepository
                        .findTopByEmployeeIdOrderByEffectiveFromDesc(
                                employee.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Salary structure not found "
                                                + "for employee: "
                                                + employee.getId()
                                )
                        );


        LeaveBalance leaveBalance =
                leaveBalanceRepository
                        .findByEmployeeId(
                                employee.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Leave balance not found "
                                                + "for employee: "
                                                + employee.getId()
                                )
                        );


        return mapToResponse(
                payslip,
                employee,
                salaryStructure,
                leaveBalance,
                payroll.getTotalDeductions(),
                payroll.getNetSalary()
        );
    }


    // =========================================================
    // GET EMPLOYEE PAYSLIPS
    // HR
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<PayslipResponse> getEmployeePayslips(
            Long employeeId) {

        if (employeeId == null) {

            throw new BadRequestException(
                    "Employee ID is required"
            );
        }


        if (!employeeRepository.existsById(
                employeeId
        )) {

            throw new ResourceNotFoundException(
                    "Employee not found with id: "
                            + employeeId
            );
        }


        return payslipRepository
                .findByPayroll_Employee_Id(
                        employeeId
                )
                .stream()
                .map(payslip -> {

                    Payroll payroll =
                            payslip.getPayroll();


                    if (payroll == null) {

                        throw new ResourceNotFoundException(
                                "Payroll not found for payslip: "
                                        + payslip.getId()
                        );
                    }


                    Employee employee =
                            payroll.getEmployee();


                    if (employee == null) {

                        throw new ResourceNotFoundException(
                                "Employee not found for payslip: "
                                        + payslip.getId()
                        );
                    }


                    SalaryStructure salaryStructure =
                            salaryStructureRepository
                                    .findTopByEmployeeIdOrderByEffectiveFromDesc(
                                            employee.getId()
                                    )
                                    .orElseThrow(() ->
                                            new ResourceNotFoundException(
                                                    "Salary structure "
                                                            + "not found "
                                                            + "for employee: "
                                                            + employee.getId()
                                            )
                                    );


                    LeaveBalance leaveBalance =
                            leaveBalanceRepository
                                    .findByEmployeeId(
                                            employee.getId()
                                    )
                                    .orElseThrow(() ->
                                            new ResourceNotFoundException(
                                                    "Leave balance "
                                                            + "not found "
                                                            + "for employee: "
                                                            + employee.getId()
                                            )
                                    );


                    return mapToResponse(
                            payslip,
                            employee,
                            salaryStructure,
                            leaveBalance,
                            payroll.getTotalDeductions(),
                            payroll.getNetSalary()
                    );

                })
                .toList();
    }


    // =========================================================
    // SEND PAYSLIP EMAIL MANUALLY
    // =========================================================

    @Override
    public void sendPayslipEmail(
            Long payslipId) {

        if (payslipId == null) {

            throw new BadRequestException(
                    "Payslip ID is required"
            );
        }


        Payslip payslip =
                payslipRepository
                        .findById(payslipId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payslip not found with id: "
                                                + payslipId
                                )
                        );


        if (payslip.getPayroll() == null) {

            throw new ResourceNotFoundException(
                    "Payroll not found for payslip: "
                            + payslipId
            );
        }


        Employee employee =
                payslip.getPayroll()
                        .getEmployee();


        if (employee == null) {

            throw new ResourceNotFoundException(
                    "Employee not found for payslip: "
                            + payslipId
            );
        }


        // =====================================================
        // CHECK PDF
        // =====================================================

        if (payslip.getFilePath() == null ||
                payslip.getFilePath().trim().isEmpty()) {

            throw new ResourceNotFoundException(
                    "PDF file not found for payslip: "
                            + payslipId
            );
        }


        File pdfFile =
                new File(
                        payslip.getFilePath()
                );


        if (!pdfFile.exists()) {

            throw new ResourceNotFoundException(
                    "Payslip PDF file does not exist: "
                            + payslip.getFilePath()
            );
        }


        emailService.sendPayslipEmail(
                employee,
                payslip
        );
    }


    // =========================================================
    // GET ALL PAYSLIPS
    // HR
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<PayslipResponse> getAllPayslips() {

        return payslipRepository
                .findAll()
                .stream()
                .map(payslip -> {

                    Payroll payroll =
                            payslip.getPayroll();


                    if (payroll == null) {

                        throw new ResourceNotFoundException(
                                "Payroll not found for payslip: "
                                        + payslip.getId()
                        );
                    }


                    Employee employee =
                            payroll.getEmployee();


                    if (employee == null) {

                        throw new ResourceNotFoundException(
                                "Employee not found for payslip: "
                                        + payslip.getId()
                        );
                    }


                    SalaryStructure salaryStructure =
                            salaryStructureRepository
                                    .findTopByEmployeeIdOrderByEffectiveFromDesc(
                                            employee.getId()
                                    )
                                    .orElseThrow(() ->
                                            new ResourceNotFoundException(
                                                    "Salary structure "
                                                            + "not found "
                                                            + "for employee: "
                                                            + employee.getId()
                                            )
                                    );


                    LeaveBalance leaveBalance =
                            leaveBalanceRepository
                                    .findByEmployeeId(
                                            employee.getId()
                                    )
                                    .orElseThrow(() ->
                                            new ResourceNotFoundException(
                                                    "Leave balance "
                                                            + "not found "
                                                            + "for employee: "
                                                            + employee.getId()
                                            )
                                    );


                    return mapToResponse(
                            payslip,
                            employee,
                            salaryStructure,
                            leaveBalance,
                            payroll.getTotalDeductions(),
                            payroll.getNetSalary()
                    );

                })
                .toList();
    }


    // =========================================================
    // MAP ENTITY → RESPONSE
    // =========================================================

    private PayslipResponse mapToResponse(
            Payslip payslip,
            Employee employee,
            SalaryStructure salaryStructure,
            LeaveBalance leaveBalance,
            BigDecimal totalDeductions,
            BigDecimal netSalary) {

        Payroll payroll =
                payslip.getPayroll();


        return PayslipResponse.builder()

                .id(
                        payslip.getId()
                )

                .employeeId(
                        employee.getId()
                )

                .employeeCode(
                        employee.getEmployeeCode()
                )

                .employeeName(
                        employee.getName()
                )

                .email(
                        employee.getEmail()
                )

                .department(
                        employee.getDepartment()
                )

                .designation(
                        employee.getDesignation()
                )

                .joiningDate(
                        employee.getJoiningDate()
                )

                .payMonth(
                        payroll.getPayPeriod()
                )

                .basicSalary(
                        salaryStructure.getBasicSalary()
                )

                .hra(
                        salaryStructure.getHra()
                )

                .specialAllowance(
                        salaryStructure.getSpecialAllowance()
                )

                .grossSalary(
                        payroll.getGrossSalary()
                )

                .pf(
                        salaryStructure.getPf()
                )

                .esi(
                        salaryStructure.getEsi()
                )

                .professionalTax(
                        salaryStructure.getProfessionalTax()
                )

                .totalDeductions(
                        totalDeductions
                )

                .casualLeave(
                        leaveBalance.getCasualLeave()
                )

                .sickLeave(
                        leaveBalance.getSickLeave()
                )

                .earnedLeave(
                        leaveBalance.getEarnedLeave()
                )

                .netSalary(
                        netSalary
                )

                .status(
                        payroll.getStatus()
                )

                .build();
    }
}