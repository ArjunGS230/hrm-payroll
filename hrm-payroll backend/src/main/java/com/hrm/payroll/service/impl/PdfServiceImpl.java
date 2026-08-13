package com.hrm.payroll.service.impl;

import com.hrm.payroll.dto.PayslipResponse;
import com.hrm.payroll.service.PdfService;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class PdfServiceImpl implements PdfService {

    private static final String PDF_DIRECTORY = "payslips";

    private static final PDType1Font NORMAL_FONT =
            new PDType1Font(
                    Standard14Fonts.FontName.HELVETICA
            );

    private static final PDType1Font BOLD_FONT =
            new PDType1Font(
                    Standard14Fonts.FontName.HELVETICA_BOLD
            );

    @Override
    public String generatePayslipPdf(
            PayslipResponse payslip) {

        try {

            Path directory =
                    Paths.get(PDF_DIRECTORY);

            Files.createDirectories(directory);

            String fileName =
                    "Payslip_"
                            + payslip.getEmployeeCode()
                            + "_"
                            + payslip.getPayMonth()
                            + ".pdf";

            Path filePath =
                    directory.resolve(fileName);

            try (PDDocument document =
                         new PDDocument()) {

                PDPage page =
                        new PDPage(PDRectangle.A4);

                document.addPage(page);

                try (PDPageContentStream content =
                             new PDPageContentStream(
                                     document,
                                     page
                             )) {

                    float y = 800;

                    // =========================
                    // TITLE
                    // =========================

                    writeBoldText(
                            content,
                            "MONTHLY PAYSLIP",
                            220,
                            y,
                            20
                    );

                    y -= 45;

                    // =========================
                    // EMPLOYEE DETAILS
                    // =========================

                    writeText(
                            content,
                            "Employee ID: "
                                    + payslip.getEmployeeCode(),
                            50,
                            y
                    );

                    y -= 20;

                    writeText(
                            content,
                            "Employee Name: "
                                    + payslip.getEmployeeName(),
                            50,
                            y
                    );

                    y -= 20;

                    writeText(
                            content,
                            "Department: "
                                    + payslip.getDepartment(),
                            50,
                            y
                    );

                    y -= 20;

                    writeText(
                            content,
                            "Designation: "
                                    + payslip.getDesignation(),
                            50,
                            y
                    );

                    y -= 20;

                    writeText(
                            content,
                            "Pay Period: "
                                    + payslip.getPayMonth(),
                            50,
                            y
                    );

                    y -= 40;

                    // =========================
                    // EARNINGS
                    // =========================

                    writeBoldText(
                            content,
                            "EARNINGS",
                            50,
                            y,
                            13
                    );

                    y -= 25;

                    writeAmount(
                            content,
                            "Basic Salary",
                            payslip.getBasicSalary(),
                            y
                    );

                    y -= 20;

                    writeAmount(
                            content,
                            "HRA",
                            payslip.getHra(),
                            y
                    );

                    y -= 20;

                    writeAmount(
                            content,
                            "Special Allowance",
                            payslip.getSpecialAllowance(),
                            y
                    );

                    y -= 25;

                    writeAmount(
                            content,
                            "Gross Salary",
                            payslip.getGrossSalary(),
                            y
                    );

                    y -= 40;

                    // =========================
                    // DEDUCTIONS
                    // =========================

                    writeBoldText(
                            content,
                            "DEDUCTIONS",
                            50,
                            y,
                            13
                    );

                    y -= 25;

                    writeAmount(
                            content,
                            "PF",
                            payslip.getPf(),
                            y
                    );

                    y -= 20;

                    writeAmount(
                            content,
                            "ESI",
                            payslip.getEsi(),
                            y
                    );

                    y -= 20;

                    writeAmount(
                            content,
                            "Professional Tax",
                            payslip.getProfessionalTax(),
                            y
                    );

                    y -= 25;

                    writeAmount(
                            content,
                            "Total Deductions",
                            payslip.getTotalDeductions(),
                            y
                    );

                    y -= 40;

                    // =========================
                    // LEAVE BALANCE
                    // =========================

                    writeBoldText(
                            content,
                            "LEAVE BALANCE",
                            50,
                            y,
                            13
                    );

                    y -= 25;

                    writeText(
                            content,
                            "Casual Leave (CL)",
                            60,
                            y
                    );

                    writeText(
                            content,
                            String.valueOf(
                                    payslip.getCasualLeave()
                            ),
                            400,
                            y
                    );

                    y -= 20;

                    writeText(
                            content,
                            "Sick Leave (SL)",
                            60,
                            y
                    );

                    writeText(
                            content,
                            String.valueOf(
                                    payslip.getSickLeave()
                            ),
                            400,
                            y
                    );

                    y -= 20;

                    writeText(
                            content,
                            "Earned Leave (EL)",
                            60,
                            y
                    );

                    writeText(
                            content,
                            String.valueOf(
                                    payslip.getEarnedLeave()
                            ),
                            400,
                            y
                    );

                    y -= 45;

                    // =========================
                    // NET PAY
                    // =========================

                    writeBoldText(
                            content,
                            "NET PAY: Rs. "
                                    + payslip.getNetSalary(),
                            60,
                            y,
                            16
                    );

                    y -= 35;

                    writeText(
                            content,
                            "Status: "
                                    + payslip.getStatus(),
                            60,
                            y
                    );

                    y -= 40;

                    writeText(
                            content,
                            "This is a system generated payslip.",
                            150,
                            y
                    );
                }

                document.save(
                        filePath.toFile()
                );
            }

            return filePath.toString();

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to generate payslip PDF",
                    e
            );
        }
    }


    private void writeText(
            PDPageContentStream content,
            String text,
            float x,
            float y)
            throws IOException {

        content.beginText();

        content.setFont(
                NORMAL_FONT,
                11
        );

        content.newLineAtOffset(
                x,
                y
        );

        content.showText(text);

        content.endText();
    }


    private void writeBoldText(
            PDPageContentStream content,
            String text,
            float x,
            float y,
            float fontSize)
            throws IOException {

        content.beginText();

        content.setFont(
                BOLD_FONT,
                fontSize
        );

        content.newLineAtOffset(
                x,
                y
        );

        content.showText(text);

        content.endText();
    }


    private void writeAmount(
            PDPageContentStream content,
            String label,
            Object amount,
            float y)
            throws IOException {

        writeText(
                content,
                label,
                60,
                y
        );

        writeText(
                content,
                "Rs. " + amount,
                400,
                y
        );
    }
}