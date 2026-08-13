package com.hrm.payroll.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leave_balances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "employee_id", nullable = false, unique = true)
    private Employee employee;

    @Builder.Default
    @Column(name = "casual_leave")
    private Integer casualLeave = 12;

    @Builder.Default
    @Column(name = "sick_leave")
    private Integer sickLeave = 12;

    @Builder.Default
    @Column(name = "earned_leave")
    private Integer earnedLeave = 15;
}