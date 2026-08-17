package com.hrm.payroll.entity;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // USERNAME
    // =====================================================

    @Column(
            nullable = false,
            unique = true
    )
    private String username;


    // =====================================================
    // EMAIL
    // =====================================================

    @Column(
            nullable = false,
            unique = true
    )
    private String email;


    // =====================================================
    // PHONE NUMBER
    // =====================================================

    @Column(
            nullable = false,
            unique = true
    )
    private String phoneNumber;


    // =====================================================
    // PASSWORD
    // =====================================================

    @Column(nullable = false)
    private String password;


    // =====================================================
    // ROLE
    // =====================================================

    @Column(nullable = false)
    private String role;


    // =====================================================
    // ACCOUNT STATUS
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AccountStatus status =
            AccountStatus.PENDING;


    // =====================================================
    // ACTIVE
    // =====================================================

    @Column(nullable = false)
    @Builder.Default
    private boolean active = false;
}