package com.hrm.payroll.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @OneToOne
    @JoinColumn(name = "payslip_id", nullable = false)
    private Payslip payslip;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String status;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    @Column(
    	    name = "error_message",
    	    columnDefinition = "TEXT"
    	)
    	private String errorMessage;

    @Column(name = "retry_count")
    private Integer retryCount = 0;
}