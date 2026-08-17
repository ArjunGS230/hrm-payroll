package com.hrm.payroll.service;

import com.hrm.payroll.dto.DashboardSummaryResponse;
import com.hrm.payroll.dto.RecentPayrollResponse;

import com.hrm.payroll.entity.Employee;
import com.hrm.payroll.entity.Payroll;

import com.hrm.payroll.repository.EmployeeRepository;
import com.hrm.payroll.repository.LeaveApplicationRepository;
import com.hrm.payroll.repository.PayrollRepository;
import com.hrm.payroll.repository.PayslipRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;


@Service
@RequiredArgsConstructor
public class DashboardService {


    private final EmployeeRepository employeeRepository;

    private final PayrollRepository payrollRepository;

    private final LeaveApplicationRepository leaveApplicationRepository;

    private final PayslipRepository payslipRepository;


    // =====================================================
    // RECENT PAYROLL
    // =====================================================
    public List<RecentPayrollResponse> getRecentPayroll() {

        YearMonth currentMonth = YearMonth.now();

        List<Payroll> payrollList =
                payrollRepository.findAll()
                        .stream()
                        .filter(payroll -> {

                            if (payroll.getPayPeriod() == null) {
                                return false;
                            }

                            try {

                                YearMonth payPeriod =
                                        YearMonth.parse(
                                                payroll.getPayPeriod()
                                        );

                                return !payPeriod.isAfter(currentMonth);

                            } catch (Exception e) {

                                return false;
                            }
                        })
                        .sorted(
                                (p1, p2) ->
                                        p2.getProcessedAt()
                                          .compareTo(
                                                  p1.getProcessedAt()
                                          )
                        )
                        .limit(5)
                        .toList();


        return payrollList.stream()
                .map(payroll -> {

                    Employee employee =
                            payroll.getEmployee();

                    return RecentPayrollResponse.builder()

                            .payrollId(
                                    payroll.getId()
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

                            .netSalary(
                                    payroll.getNetSalary()
                            )

                            .status(
                                    payroll.getStatus()
                            )

                            .build();
                })
                .toList();
    }

    // =====================================================
    // DASHBOARD SUMMARY
    // =====================================================

    public DashboardSummaryResponse
    getDashboardSummary() {


        // =================================================
        // CURRENT MONTH
        // =================================================

        YearMonth currentMonth =
                YearMonth.now();


        String payPeriod =
                currentMonth.toString();


        // =================================================
        // TOTAL ACTIVE EMPLOYEES
        // =================================================

        long totalEmployees =
                employeeRepository.countByActiveTrue();


        // =================================================
        // PENDING LEAVES
        // =================================================

        long pendingLeaves =
                leaveApplicationRepository
                        .countByStatusIgnoreCase(
                                "PENDING"
                        );


        // =================================================
        // CURRENT MONTH PAYROLL
        // =================================================

        List<Payroll> payrollList =
                payrollRepository
                        .findByPayPeriod(
                                payPeriod
                        );


        BigDecimal grossSalary =
                BigDecimal.ZERO;


        BigDecimal netSalary =
                BigDecimal.ZERO;


        BigDecimal deductions =
                BigDecimal.ZERO;


        for (Payroll payroll : payrollList) {


            // ---------------------------------------------
            // GROSS SALARY
            // ---------------------------------------------

            if (payroll.getGrossSalary() != null) {

                grossSalary =
                        grossSalary.add(
                                payroll.getGrossSalary()
                        );
            }


            // ---------------------------------------------
            // NET SALARY
            // ---------------------------------------------

            if (payroll.getNetSalary() != null) {

                netSalary =
                        netSalary.add(
                                payroll.getNetSalary()
                        );
            }


            // ---------------------------------------------
            // DEDUCTIONS
            // ---------------------------------------------

            if (payroll.getTotalDeductions() != null) {

                deductions =
                        deductions.add(
                                payroll.getTotalDeductions()
                        );
            }

        }


        // =================================================
        // MONTHLY PAYROLL
        // =================================================
        //
        // Gross salary represents the total payroll
        // before deductions.
        //
        // =================================================

        BigDecimal monthlyPayroll =
                grossSalary;


        // =================================================
        // PAYSLIPS GENERATED THIS MONTH
        // =================================================

        LocalDate firstDay =
                currentMonth.atDay(1);


        LocalDate lastDay =
                currentMonth.atEndOfMonth();


        LocalDateTime start =
                firstDay.atStartOfDay();


        LocalDateTime end =
                lastDay
                        .plusDays(1)
                        .atStartOfDay();


        long payslipsGenerated =
                payslipRepository
                        .countByGeneratedAtBetween(
                                start,
                                end
                        );


        // =================================================
        // BUILD RESPONSE
        // =================================================

        return DashboardSummaryResponse.builder()

                .totalEmployees(
                        totalEmployees
                )

                .monthlyPayroll(
                        monthlyPayroll
                )

                .pendingLeaves(
                        pendingLeaves
                )

                .payslipsGenerated(
                        payslipsGenerated
                )

                .grossSalary(
                        grossSalary
                )

                .netSalary(
                        netSalary
                )

                .deductions(
                        deductions
                )

                .build();
    }

}