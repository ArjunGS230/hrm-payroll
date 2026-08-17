package com.hrm.payroll.service.impl;

import com.hrm.payroll.dto.PayslipResponse;
import com.hrm.payroll.service.PdfService;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.color.PDColor;
import org.apache.pdfbox.pdmodel.graphics.color.PDDeviceRGB;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Locale;

@Service
public class PdfServiceImpl implements PdfService {

    private static final String PDF_DIRECTORY = "payslips";


    // =========================================================
    // FONTS
    // =========================================================

    private static final PDType1Font NORMAL_FONT =
            new PDType1Font(
                    Standard14Fonts.FontName.HELVETICA
            );

    private static final PDType1Font BOLD_FONT =
            new PDType1Font(
                    Standard14Fonts.FontName.HELVETICA_BOLD
            );


    // =========================================================
    // COLORS
    // =========================================================

    /*
     * Gray used for table headers and label cells.
     * Matches the sample payslip.
     */
    private static final PDColor HEADER_GRAY =
            new PDColor(
                    new float[]{
                            0.82f,
                            0.82f,
                            0.82f
                    },
                    PDDeviceRGB.INSTANCE
            );


    /*
     * Gray used for table borders.
     */
    private static final PDColor BORDER_GRAY =
            new PDColor(
                    new float[]{
                            0.55f,
                            0.55f,
                            0.55f
                    },
                    PDDeviceRGB.INSTANCE
            );


    /*
     * Gray used for footer text.
     */
    private static final PDColor FOOTER_GRAY =
            new PDColor(
                    new float[]{
                            0.55f,
                            0.55f,
                            0.55f
                    },
                    PDDeviceRGB.INSTANCE
            );


    /*
     * BLACK color.
     *
     * This fixes:
     *
     * BLACK cannot be resolved
     *
     * and avoids using PDDeviceRGB.BLACK.
     */
    private static final PDColor BLACK =
            new PDColor(
                    new float[]{
                            0f,
                            0f,
                            0f
                    },
                    PDDeviceRGB.INSTANCE
            );


    // =========================================================
    // PAGE SETTINGS
    // =========================================================

    private static final float PAGE_WIDTH =
            PDRectangle.A4.getWidth();

    private static final float PAGE_HEIGHT =
            PDRectangle.A4.getHeight();

    private static final float LEFT = 55;

    private static final float RIGHT = 55;

    private static final float TABLE_WIDTH =
            PAGE_WIDTH - LEFT - RIGHT;


    // =========================================================
    // GENERATE PAYSLIP PDF
    // =========================================================

    @Override
    public String generatePayslipPdf(
            PayslipResponse payslip) {

        try {

            // =====================================================
            // CREATE DIRECTORY
            // =====================================================

            Path directory =
                    Paths.get(PDF_DIRECTORY);

            Files.createDirectories(directory);


            // =====================================================
            // FILE NAME
            // =====================================================

            String fileName =
                    "Payslip_"
                            + payslip.getEmployeeCode()
                            + "_"
                            + payslip.getPayMonth()
                            + ".pdf";

            Path filePath =
                    directory.resolve(fileName);


            // =====================================================
            // CREATE PDF
            // =====================================================

            try (PDDocument document =
                         new PDDocument()) {

                PDPage page =
                        new PDPage(
                                PDRectangle.A4
                        );

                document.addPage(page);


                try (PDPageContentStream content =
                             new PDPageContentStream(
                                     document,
                                     page
                             )) {

                    float y =
                            PAGE_HEIGHT - 38;


                    // =================================================
                    // TITLE
                    // =================================================

                    String title =
                            "HRM PAYROLL";

                    drawCenteredText(
                            content,
                            title,
                            y,
                            20,
                            BOLD_FONT
                    );


                    // =================================================
                    // SUBTITLE
                    // =================================================

                    y -= 24;

                    String subtitle =
                            "MONTHLY SALARY PAYSLIP";

                    drawCenteredText(
                            content,
                            subtitle,
                            y,
                            10,
                            NORMAL_FONT
                    );


                    // =================================================
                    // EMPLOYEE INFORMATION TABLE
                    // =================================================

                    y -= 22;

                    float infoRowHeight = 29;

                    float[] infoColumns = {
                            90,
                            170,
                            90,
                            TABLE_WIDTH - 90 - 170 - 90
                    };

                    drawInfoTable(
                            content,
                            payslip,
                            LEFT,
                            y,
                            infoRowHeight,
                            infoColumns
                    );

                    y -= infoRowHeight * 4;


                    // =================================================
                    // EARNINGS TITLE
                    // =================================================

                    y -= 15;

                    writeBoldText(
                            content,
                            "Earnings",
                            LEFT + 6,
                            y,
                            13
                    );

                    y -= 11;


                    // =================================================
                    // EARNINGS TABLE
                    // =================================================

                    float earningsHeaderHeight = 27;

                    float earningsRowHeight = 27;


                    // HEADER

                    drawTableHeader(
                            content,
                            LEFT,
                            y,
                            TABLE_WIDTH,
                            earningsHeaderHeight,
                            "Salary Component",
                            "Amount (INR)"
                    );

                    y -= earningsHeaderHeight;


                    // BASIC SALARY

                    drawTableRow(
                            content,
                            LEFT,
                            y,
                            TABLE_WIDTH,
                            earningsRowHeight,
                            "Basic Salary",
                            formatMoney(
                                    payslip.getBasicSalary()
                            ),
                            false
                    );

                    y -= earningsRowHeight;


                    // HRA

                    drawTableRow(
                            content,
                            LEFT,
                            y,
                            TABLE_WIDTH,
                            earningsRowHeight,
                            "HRA",
                            formatMoney(
                                    payslip.getHra()
                            ),
                            false
                    );

                    y -= earningsRowHeight;


                    // SPECIAL ALLOWANCE

                    drawTableRow(
                            content,
                            LEFT,
                            y,
                            TABLE_WIDTH,
                            earningsRowHeight,
                            "Special Allowance",
                            formatMoney(
                                    payslip.getSpecialAllowance()
                            ),
                            false
                    );

                    y -= earningsRowHeight;


                    // GROSS SALARY

                    drawTableRow(
                            content,
                            LEFT,
                            y,
                            TABLE_WIDTH,
                            earningsRowHeight,
                            "Gross Salary",
                            formatMoney(
                                    payslip.getGrossSalary()
                            ),
                            true
                    );

                    y -= earningsRowHeight;


                    // =================================================
                    // DEDUCTIONS TITLE
                    // =================================================

                    y -= 14;

                    writeBoldText(
                            content,
                            "Deductions",
                            LEFT + 6,
                            y,
                            13
                    );

                    y -= 11;


                    // =================================================
                    // DEDUCTIONS TABLE
                    // =================================================

                    drawTableHeader(
                            content,
                            LEFT,
                            y,
                            TABLE_WIDTH,
                            earningsHeaderHeight,
                            "Deduction",
                            "Amount (INR)"
                    );

                    y -= earningsHeaderHeight;


                    // PF

                    drawTableRow(
                            content,
                            LEFT,
                            y,
                            TABLE_WIDTH,
                            earningsRowHeight,
                            "Provident Fund (PF)",
                            formatMoney(
                                    payslip.getPf()
                            ),
                            false
                    );

                    y -= earningsRowHeight;


                    // ESI

                    drawTableRow(
                            content,
                            LEFT,
                            y,
                            TABLE_WIDTH,
                            earningsRowHeight,
                            "ESI",
                            formatMoney(
                                    payslip.getEsi()
                            ),
                            false
                    );

                    y -= earningsRowHeight;


                    // PROFESSIONAL TAX

                    drawTableRow(
                            content,
                            LEFT,
                            y,
                            TABLE_WIDTH,
                            earningsRowHeight,
                            "Professional Tax",
                            formatMoney(
                                    payslip.getProfessionalTax()
                            ),
                            false
                    );

                    y -= earningsRowHeight;


                    // TOTAL DEDUCTIONS

                    drawTableRow(
                            content,
                            LEFT,
                            y,
                            TABLE_WIDTH,
                            earningsRowHeight,
                            "Total Deductions",
                            formatMoney(
                                    payslip.getTotalDeductions()
                            ),
                            true
                    );

                    y -= earningsRowHeight;


                    // =================================================
                    // NET SALARY BOX
                    // =================================================

                    y -= 17;

                    drawNetSalaryBox(
                            content,
                            LEFT,
                            y,
                            TABLE_WIDTH,
                            45,
                            payslip.getNetSalary()
                    );

                    y -= 45;


                    // =================================================
                    // GENERATED DATE
                    // =================================================

                    y -= 18;

                    writeText(
                            content,
                            "Generated on: "
                                    + formatDate(
                                    LocalDate.now()
                            ),
                            LEFT + 7,
                            y,
                            10,
                            NORMAL_FONT
                    );


                    // =================================================
                    // FOOTER
                    // =================================================

                    y -= 31;

//                    writeText(
//                            content,
//                            "This is a system-generated payslip report.",
//                            LEFT + 7,
//                            y,
//                            9,
//                            NORMAL_FONT,
//                            FOOTER_GRAY
//                    );
           }


                // =====================================================
                // SAVE PDF
                // =====================================================

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


    // =============================================================
    // EMPLOYEE INFORMATION TABLE
    // =============================================================

    private void drawInfoTable(
            PDPageContentStream content,
            PayslipResponse payslip,
            float x,
            float topY,
            float rowHeight,
            float[] columns)
            throws IOException {


        String[][] data = {

                {
                        "Employee Code",
                        safe(
                                payslip.getEmployeeCode()
                        ),

                        "Pay Period",
                        formatPayPeriod(
                                payslip.getPayMonth()
                        )
                },

                {
                        "Employee Name",
                        safe(
                                payslip.getEmployeeName()
                        ),

                        "Designation",
                        safe(
                                payslip.getDesignation()
                        )
                },

                {
                        "Department",
                        safe(
                                payslip.getDepartment()
                        ),

                        "Joining Date",
                        formatDate(
                                payslip.getJoiningDate()
                        )
                },

                {
                        "Email",
                        safe(
                                payslip.getEmail()
                        ),

                        "Payslip ID",
                        "PS-"
                                + payslip.getPayMonth()
                                + "-"
                                + String.format(
                                "%03d",
                                payslip.getId()
                        )
                }
        };


        float currentY = topY;


        for (String[] row : data) {

            float currentX = x;


            for (int i = 0;
                 i < row.length;
                 i++) {

                boolean label =
                        i == 0 || i == 2;


                // =================================================
                // LABEL BACKGROUND
                // =================================================

                if (label) {

                    fillRectangle(
                            content,
                            currentX,
                            currentY - rowHeight,
                            columns[i],
                            rowHeight,
                            HEADER_GRAY
                    );
                }


                // =================================================
                // BORDER
                // =================================================

                drawRectangle(
                        content,
                        currentX,
                        currentY - rowHeight,
                        columns[i],
                        rowHeight,
                        BORDER_GRAY
                );


                // =================================================
                // TEXT
                // =================================================

                writeText(
                        content,
                        row[i],
                        currentX + 6,
                        currentY - 18,
                        9,
                        label
                                ? BOLD_FONT
                                : NORMAL_FONT
                );


                currentX += columns[i];
            }


            currentY -= rowHeight;
        }
    }


    // =============================================================
    // TABLE HEADER
    // =============================================================

    private void drawTableHeader(
            PDPageContentStream content,
            float x,
            float y,
            float width,
            float height,
            String leftTitle,
            String rightTitle)
            throws IOException {


        float leftWidth =
                width * 0.62f;

        float rightWidth =
                width - leftWidth;


        // =========================================================
        // LEFT HEADER
        // =========================================================

        fillRectangle(
                content,
                x,
                y - height,
                leftWidth,
                height,
                HEADER_GRAY
        );


        // =========================================================
        // RIGHT HEADER
        // =========================================================

        fillRectangle(
                content,
                x + leftWidth,
                y - height,
                rightWidth,
                height,
                HEADER_GRAY
        );


        // =========================================================
        // BORDERS
        // =========================================================

        drawRectangle(
                content,
                x,
                y - height,
                leftWidth,
                height,
                BORDER_GRAY
        );

        drawRectangle(
                content,
                x + leftWidth,
                y - height,
                rightWidth,
                height,
                BORDER_GRAY
        );


        // =========================================================
        // HEADER TEXT
        // =========================================================

        writeText(
                content,
                leftTitle,
                x + 7,
                y - 18,
                9,
                BOLD_FONT
        );


        writeText(
                content,
                rightTitle,
                x + leftWidth + 7,
                y - 18,
                9,
                BOLD_FONT
        );
    }


    // =============================================================
    // TABLE ROW
    // =============================================================

    private void drawTableRow(
            PDPageContentStream content,
            float x,
            float y,
            float width,
            float height,
            String label,
            String amount,
            boolean bold)
            throws IOException {


        float leftWidth =
                width * 0.62f;

        float rightWidth =
                width - leftWidth;


        // =========================================================
        // LEFT CELL
        // =========================================================

        drawRectangle(
                content,
                x,
                y - height,
                leftWidth,
                height,
                BORDER_GRAY
        );


        // =========================================================
        // RIGHT CELL
        // =========================================================

        drawRectangle(
                content,
                x + leftWidth,
                y - height,
                rightWidth,
                height,
                BORDER_GRAY
        );


        PDType1Font font =
                bold
                        ? BOLD_FONT
                        : NORMAL_FONT;


        // =========================================================
        // LABEL
        // =========================================================

        writeText(
                content,
                label,
                x + 7,
                y - 18,
                9,
                font
        );


        // =========================================================
        // AMOUNT
        // =========================================================

        float amountWidth =
                font.getStringWidth(amount)
                        / 1000
                        * 9;


        writeText(
                content,
                amount,
                x + width - amountWidth - 7,
                y - 18,
                9,
                font
        );
    }


    // =============================================================
    // NET SALARY BOX
    // =============================================================

    private void drawNetSalaryBox(
            PDPageContentStream content,
            float x,
            float y,
            float width,
            float height,
            BigDecimal netSalary)
            throws IOException {


        // =========================================================
        // BORDER
        // =========================================================

        drawRectangle(
                content,
                x,
                y - height,
                width,
                height,
                BLACK
        );


        // =========================================================
        // NET SALARY LABEL
        // =========================================================

        writeText(
                content,
                "NET SALARY",
                x + 7,
                y - 29,
                14,
                BOLD_FONT
        );


        // =========================================================
        // AMOUNT
        // =========================================================

        String amount =
                formatMoney(netSalary);


        float amountWidth =
                BOLD_FONT.getStringWidth(amount)
                        / 1000
                        * 14;


        writeText(
                content,
                amount,
                x + width - amountWidth - 8,
                y - 29,
                14,
                BOLD_FONT
        );
    }


    // =============================================================
    // DRAW RECTANGLE
    // =============================================================

    private void drawRectangle(
            PDPageContentStream content,
            float x,
            float y,
            float width,
            float height,
            PDColor color)
            throws IOException {

        content.setStrokingColor(
                color
        );

        content.setLineWidth(
                0.7f
        );

        content.addRect(
                x,
                y,
                width,
                height
        );

        content.stroke();
    }


    // =============================================================
    // FILL RECTANGLE
    // =============================================================

    private void fillRectangle(
            PDPageContentStream content,
            float x,
            float y,
            float width,
            float height,
            PDColor color)
            throws IOException {

        content.setNonStrokingColor(
                color
        );

        content.addRect(
                x,
                y,
                width,
                height
        );

        content.fill();
    }


    // =============================================================
    // CENTER TEXT
    // =============================================================

    private void drawCenteredText(
            PDPageContentStream content,
            String text,
            float y,
            float fontSize,
            PDType1Font font)
            throws IOException {


        float textWidth =
                font.getStringWidth(text)
                        / 1000
                        * fontSize;


        float x =
                (PAGE_WIDTH - textWidth) / 2;


        writeText(
                content,
                text,
                x,
                y,
                fontSize,
                font
        );
    }


    // =============================================================
    // WRITE BOLD TEXT
    // =============================================================

    private void writeBoldText(
            PDPageContentStream content,
            String text,
            float x,
            float y,
            int fontSize)
            throws IOException {

        content.beginText();

        content.setFont(
                BOLD_FONT,
                fontSize
        );

        content.setNonStrokingColor(
                BLACK
        );

        content.newLineAtOffset(
                x,
                y
        );

        content.showText(
                safe(text)
        );

        content.endText();
    }


    // =============================================================
    // WRITE TEXT
    // =============================================================

    private void writeText(
            PDPageContentStream content,
            String text,
            float x,
            float y,
            float fontSize,
            PDType1Font font)
            throws IOException {

        writeText(
                content,
                text,
                x,
                y,
                fontSize,
                font,
                BLACK
        );
    }


    // =============================================================
    // WRITE TEXT WITH COLOR
    // =============================================================

    private void writeText(
            PDPageContentStream content,
            String text,
            float x,
            float y,
            float fontSize,
            PDType1Font font,
            PDColor color)
            throws IOException {

        content.beginText();


        content.setFont(
                font,
                fontSize
        );


        content.setNonStrokingColor(
                color
        );


        content.newLineAtOffset(
                x,
                y
        );


        content.showText(
                safe(text)
        );


        content.endText();
    }


    // =============================================================
    // FORMAT MONEY
    // =============================================================

    private String formatMoney(
            BigDecimal value) {

        if (value == null) {

            return "0.00";
        }


        return String.format(
                Locale.US,
                "%,.2f",
                value
        );
    }


    // =============================================================
    // FORMAT DATE
    // =============================================================

    private String formatDate(
            LocalDate date) {

        if (date == null) {

            return "-";
        }


        return date.format(
                DateTimeFormatter.ofPattern(
                        "dd-MMM-yyyy"
                )
        );
    }


    // =============================================================
    // FORMAT PAY PERIOD
    // =============================================================

    private String formatPayPeriod(
            String payMonth) {

        if (payMonth == null ||
                payMonth.isBlank()) {

            return "-";
        }


        try {

            YearMonth yearMonth =
                    YearMonth.parse(
                            payMonth
                    );


            return yearMonth
                    .getMonth()
                    .getDisplayName(
                            TextStyle.FULL,
                            Locale.ENGLISH
                    )
                    + " "
                    + yearMonth.getYear();

        } catch (Exception e) {

            return payMonth;
        }
    }


    // =============================================================
    // SAFE STRING
    // =============================================================

    private String safe(
            String value) {

        if (value == null ||
                value.isBlank()) {

            return "-";
        }


        return value;
    }
}