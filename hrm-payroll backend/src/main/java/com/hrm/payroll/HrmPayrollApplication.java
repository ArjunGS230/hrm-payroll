package com.hrm.payroll;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class HrmPayrollApplication {

    public static void main(String[] args) {

        SpringApplication.run(
                HrmPayrollApplication.class,
                args
        );
    }
}