package com.hrm.payroll.service.impl;

import com.hrm.payroll.dto.PayrollFailureResponse;
import com.hrm.payroll.dto.PayrollProcessingResponse;
import com.hrm.payroll.dto.PayrollResponse;
import com.hrm.payroll.dto.PayslipResponse;

import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.Payroll;
import com.hrm.payroll.entity.User;

import com.hrm.payroll.exception.ResourceNotFoundException;

import com.hrm.payroll.repository.EmployeeRepository;
import com.hrm.payroll.repository.PayrollRepository;
import com.hrm.payroll.repository.UserRepository;

import com.hrm.payroll.service.PayrollService;
import com.hrm.payroll.service.PayslipService;

import lombok.RequiredArgsConstructor;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class PayrollServiceImpl
        implements PayrollService {


    private final PayrollRepository payrollRepository;

    private final EmployeeRepository employeeRepository;

    private final UserRepository userRepository;

    private final PayslipService payslipService;


    // =========================================================
    // GET PAYROLL BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public PayrollResponse getById(Long id) {

        Payroll payroll =
                payrollRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payroll not found with id: "
                                                + id
                                )
                        );

        return mapToResponse(payroll);
    }


    // =========================================================
    // GET ALL PAYROLLS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<PayrollResponse> getAll() {

        return payrollRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET PAYROLL BY EMPLOYEE ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<PayrollResponse> getByEmployee(
            Long employeeId) {

        return payrollRepository
                .findByEmployeeId(employeeId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET MY PAYROLL
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<PayrollResponse> getMyPayroll(
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


        return payrollRepository
                .findByEmployeeId(
                        employee.getId()
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // EXPORT PAYROLL TO EXCEL
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public byte[] exportPayrollToExcel() {

        List<Payroll> payrolls =
                payrollRepository.findAll();


        try (
                Workbook workbook =
                        new XSSFWorkbook();

                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {

            Sheet sheet =
                    workbook.createSheet("Payroll");


            // -------------------------------------------------
            // HEADER
            // -------------------------------------------------

            Row header =
                    sheet.createRow(0);


            header.createCell(0)
                    .setCellValue("Employee ID");

            header.createCell(1)
                    .setCellValue("Employee Code");

            header.createCell(2)
                    .setCellValue("Employee Name");

            header.createCell(3)
                    .setCellValue("Department");

            header.createCell(4)
                    .setCellValue("Pay Period");

            header.createCell(5)
                    .setCellValue("Gross Salary");

            header.createCell(6)
                    .setCellValue("Total Deductions");

            header.createCell(7)
                    .setCellValue("Net Salary");

            header.createCell(8)
                    .setCellValue("Status");

            header.createCell(9)
                    .setCellValue("Processed At");


            // -------------------------------------------------
            // DATA
            // -------------------------------------------------

            int rowNumber = 1;


            for (Payroll payroll : payrolls) {

                Employee employee =
                        payroll.getEmployee();


                Row row =
                        sheet.createRow(
                                rowNumber++
                        );


                row.createCell(0)
                        .setCellValue(
                                employee.getId()
                        );


                row.createCell(1)
                        .setCellValue(
                                employee.getEmployeeCode()
                        );


                row.createCell(2)
                        .setCellValue(
                                employee.getName()
                        );


                row.createCell(3)
                        .setCellValue(
                                employee.getDepartment() != null
                                        ? employee.getDepartment()
                                        : ""
                        );


                row.createCell(4)
                        .setCellValue(
                                payroll.getPayPeriod()
                        );


                row.createCell(5)
                        .setCellValue(
                                payroll.getGrossSalary()
                                        .doubleValue()
                        );


                row.createCell(6)
                        .setCellValue(
                                payroll.getTotalDeductions()
                                        .doubleValue()
                        );


                row.createCell(7)
                        .setCellValue(
                                payroll.getNetSalary()
                                        .doubleValue()
                        );


                row.createCell(8)
                        .setCellValue(
                                payroll.getStatus()
                        );


                row.createCell(9)
                        .setCellValue(
                                payroll.getProcessedAt() != null
                                        ? payroll.getProcessedAt()
                                        .toString()
                                        : ""
                        );
            }


            // -------------------------------------------------
            // AUTO SIZE
            // -------------------------------------------------

            for (int i = 0; i <= 9; i++) {

                sheet.autoSizeColumn(i);
            }


            // -------------------------------------------------
            // WRITE FILE
            // -------------------------------------------------

            workbook.write(
                    outputStream
            );


            return outputStream.toByteArray();


        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to generate payroll Excel file",
                    e
            );
        }
    }


    // =========================================================
    // AUTOMATIC MONTHLY PAYROLL
    // CURRENT MONTH
    // =========================================================

    @Override
    public PayrollProcessingResponse
    processMonthlyPayroll() {

        String payPeriod =
                YearMonth.now().toString();


        return processPayrollForPeriod(
                payPeriod
        );
    }


    // =========================================================
    // AUTOMATIC PAYROLL
    // SELECTED MONTH
    // =========================================================

    @Override
    public PayrollProcessingResponse
    processMonthlyPayroll(
            String payPeriod) {


        // -----------------------------------------------------
        // VALIDATE
        // -----------------------------------------------------

        if (payPeriod == null ||
                payPeriod.isBlank()) {

            throw new IllegalArgumentException(
                    "Payroll period is required."
            );
        }


        // -----------------------------------------------------
        // VALIDATE YYYY-MM
        // -----------------------------------------------------

        try {

            YearMonth.parse(
                    payPeriod
            );

        } catch (Exception e) {

            throw new IllegalArgumentException(
                    "Invalid payroll period. "
                            + "Use YYYY-MM format."
            );
        }


        return processPayrollForPeriod(
                payPeriod
        );
    }


    // =========================================================
    // PROCESS PAYROLL FOR PERIOD
    // =========================================================

    private PayrollProcessingResponse
    processPayrollForPeriod(
            String payPeriod) {


        System.out.println(
                "=========================================="
        );


        System.out.println(
                "AUTOMATIC PAYROLL PROCESSING"
        );


        System.out.println(
                "Pay Period: "
                        + payPeriod
        );


        System.out.println(
                "=========================================="
        );


        // -----------------------------------------------------
        // FIND ACTIVE EMPLOYEES
        // -----------------------------------------------------

        List<Employee> employees =
                employeeRepository
                        .findAll()
                        .stream()
                        .filter(Employee::isActive)
                        .toList();


        System.out.println(
                "Active employees found: "
                        + employees.size()
        );


        // -----------------------------------------------------
        // COUNTERS
        // -----------------------------------------------------

        int successCount = 0;

        int skippedCount = 0;

        int failedCount = 0;


        // -----------------------------------------------------
        // FAILED EMPLOYEE IDs
        // -----------------------------------------------------

        List<String> failedEmployeeIds =
                new ArrayList<>();


        // -----------------------------------------------------
        // FAILED EMPLOYEE DETAILS
        // -----------------------------------------------------

        List<PayrollFailureResponse> failures =
                new ArrayList<>();


        // =====================================================
        // PROCESS EACH EMPLOYEE
        // =====================================================

        for (Employee employee : employees) {

            try {

                System.out.println(
                        "------------------------------------------"
                );


                System.out.println(
                        "Processing employee: "
                                + employee.getEmployeeCode()
                );


                // -------------------------------------------------
                // CHECK DUPLICATE PAYROLL
                // -------------------------------------------------

                boolean alreadyExists =
                        payrollRepository
                                .findByEmployeeIdAndPayPeriod(
                                        employee.getId(),
                                        payPeriod
                                )
                                .isPresent();


                if (alreadyExists) {

                    skippedCount++;


                    System.out.println(
                            "Payroll already exists for "
                                    + employee.getEmployeeCode()
                                    + " - skipping."
                    );


                    continue;
                }


                // =================================================
                // GENERATE PAYSLIP
                // =================================================

                PayslipResponse payslipResponse =
                        payslipService.generatePayslip(
                                employee.getId(),
                                payPeriod
                        );


                // =================================================
                // CHECK EMAIL STATUS
                // =================================================

                String emailStatus =
                        payslipResponse.getEmailStatus();


                // -------------------------------------------------
                // EMAIL FAILED
                // -------------------------------------------------

                if ("FAILED".equalsIgnoreCase(
                        emailStatus
                )) {

                    failedCount++;


                    String employeeCode =
                            employee.getEmployeeCode();


                    failedEmployeeIds.add(
                            employeeCode
                    );


                    String reason =
                            payslipResponse.getMessage();


                    if (reason == null ||
                            reason.isBlank()) {

                        reason =
                                "Payslip generated, "
                                        + "but email delivery failed.";
                    }


                    failures.add(
                            PayrollFailureResponse
                                    .builder()

                                    .employeeId(
                                            employeeCode
                                    )

                                    .employeeName(
                                            employee.getName()
                                    )

                                    .email(
                                            employee.getEmail()
                                    )

                                    .reason(
                                            reason
                                    )

                                    .build()
                    );


                    System.err.println(
                            "------------------------------------------"
                    );


                    System.err.println(
                            "PAYSLIP GENERATED "
                                    + "BUT EMAIL FAILED"
                    );


                    System.err.println(
                            "Employee ID : "
                                    + employeeCode
                    );


                    System.err.println(
                            "Employee    : "
                                    + employee.getName()
                    );


                    System.err.println(
                            "Email       : "
                                    + employee.getEmail()
                    );


                    System.err.println(
                            "Reason      : "
                                    + reason
                    );


                    System.err.println(
                            "------------------------------------------"
                    );


                } else {

                    // =============================================
                    // PAYSLIP + EMAIL SUCCESS
                    // =============================================

                    successCount++;


                    System.out.println(
                            "Payroll and payslip processed "
                                    + "successfully for "
                                    + employee.getEmployeeCode()
                    );
                }


            } catch (Exception e) {

                // =================================================
                // COMPLETE EMPLOYEE PROCESSING FAILED
                // =================================================

                failedCount++;


                String employeeCode =
                        employee.getEmployeeCode();


                failedEmployeeIds.add(
                        employeeCode
                );


                String reason =
                        e.getMessage();


                if (reason == null ||
                        reason.isBlank()) {

                    reason =
                            e.getClass()
                                    .getSimpleName();
                }


                failures.add(
                        PayrollFailureResponse
                                .builder()

                                .employeeId(
                                        employeeCode
                                )

                                .employeeName(
                                        employee.getName()
                                )

                                .email(
                                        employee.getEmail()
                                )

                                .reason(
                                        reason
                                )

                                .build()
                );


                System.err.println(
                        "------------------------------------------"
                );


                System.err.println(
                        "PAYROLL PROCESSING FAILED"
                );


                System.err.println(
                        "Employee ID : "
                                + employeeCode
                );


                System.err.println(
                        "Employee    : "
                                + employee.getName()
                );


                System.err.println(
                        "Email       : "
                                + employee.getEmail()
                );


                System.err.println(
                        "Reason      : "
                                + reason
                );


                System.err.println(
                        "------------------------------------------"
                );


                /*
                 * IMPORTANT:
                 *
                 * One employee failure should NOT stop
                 * the remaining employees.
                 */
            }
        }


        // =========================================================
        // FINAL SUMMARY
        // =========================================================

        System.out.println(
                "=========================================="
        );


        System.out.println(
                "PAYROLL PROCESSING COMPLETED"
        );


        System.out.println(
                "Pay Period   : "
                        + payPeriod
        );


        System.out.println(
                "Successful   : "
                        + successCount
        );


        System.out.println(
                "Skipped      : "
                        + skippedCount
        );


        System.out.println(
                "Failed       : "
                        + failedCount
        );


        if (!failedEmployeeIds.isEmpty()) {

            System.out.println(
                    "Failed Employees:"
            );


            failedEmployeeIds.forEach(
                    System.out::println
            );
        }


        System.out.println(
                "=========================================="
        );


        // =========================================================
        // FRONTEND MESSAGE
        // =========================================================

        String message;


        // ---------------------------------------------------------
        // ALL SUCCESS
        // ---------------------------------------------------------

        if (successCount > 0 &&
                skippedCount == 0 &&
                failedCount == 0) {

            message =
                    successCount
                            + " payrolls and payslips generated "
                            + "successfully. Emails sent.";
        }


        // ---------------------------------------------------------
        // SOME SUCCESS + SOME SKIPPED
        // ---------------------------------------------------------

        else if (successCount > 0 &&
                skippedCount > 0 &&
                failedCount == 0) {

            message =
                    successCount
                            + " payslips generated successfully. "
                            + skippedCount
                            + " payrolls were already processed.";
        }


        // ---------------------------------------------------------
        // ONLY SKIPPED
        // ---------------------------------------------------------

        else if (successCount == 0 &&
                skippedCount > 0 &&
                failedCount == 0) {

            message =
                    "No new payslips generated. "
                            + skippedCount
                            + " payrolls already existed for "
                            + payPeriod
                            + ".";
        }


        // ---------------------------------------------------------
        // FAILURES
        // ---------------------------------------------------------

        else if (failedCount > 0) {

            message =
                    "Payroll processing completed with "
                            + failedCount
                            + " failure"
                            + (failedCount > 1
                            ? "s."
                            : ".");
        }


        // ---------------------------------------------------------
        // FALLBACK
        // ---------------------------------------------------------

        else {

            message =
                    "Payroll processing completed.";
        }


        // =========================================================
        // RETURN RESPONSE
        // =========================================================

        return PayrollProcessingResponse
                .builder()

                .payPeriod(
                        payPeriod
                )

                .successful(
                        successCount
                )

                .skipped(
                        skippedCount
                )

                .failed(
                        failedCount
                )

                .message(
                        message
                )

                .failedEmployeeIds(
                        failedEmployeeIds
                )

                .failures(
                        failures
                )

                .build();
    }


    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    private PayrollResponse mapToResponse(
            Payroll payroll) {

        Employee employee =
                payroll.getEmployee();


        return PayrollResponse
                .builder()

                .id(
                        payroll.getId()
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

                .department(
                        employee.getDepartment()
                )

                .payPeriod(
                        payroll.getPayPeriod()
                )

                .grossSalary(
                        payroll.getGrossSalary()
                )

                .totalDeductions(
                        payroll.getTotalDeductions()
                )

                .netSalary(
                        payroll.getNetSalary()
                )

                .status(
                        payroll.getStatus()
                )

                .processedAt(
                        payroll.getProcessedAt()
                )

                .build();
    }
}