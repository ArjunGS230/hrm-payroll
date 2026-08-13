package com.hrm.payroll.config;

import com.hrm.payroll.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    // =====================================================
    // PASSWORD ENCODER
    // =====================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // =====================================================
    // CORS CONFIGURATION
    // =====================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        // React frontend
        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173"
                )
        );

        // HTTP methods
        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        // Request headers
        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type",
                        "Accept"
                )
        );

        // Allow browser to read response headers
        configuration.setExposedHeaders(
                List.of(
                        "Authorization"
                )
        );

        // We are using JWT in Authorization header,
        // so browser cookies are not required.
        configuration.setAllowCredentials(false);


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // =================================================
                // CORS
                // =================================================

                .cors(cors -> cors.configurationSource(
                        corsConfigurationSource()
                ))


                // =================================================
                // CSRF
                // =================================================

                .csrf(csrf ->
                        csrf.disable()
                )


                // =================================================
                // DISABLE FORM LOGIN
                // =================================================

                .formLogin(form ->
                        form.disable()
                )


                // =================================================
                // DISABLE BASIC AUTH
                // =================================================

                .httpBasic(basic ->
                        basic.disable()
                )


                // =================================================
                // STATELESS JWT
                // =================================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeHttpRequests(auth -> auth


                        // =========================================
                        // PUBLIC APIs
                        // =========================================

                        .requestMatchers(
                                "/api/auth/**",
                                "/api/test"
                        ).permitAll()


                        // =========================================
                        // EMPLOYEE APIs
                        // =========================================

                        .requestMatchers(
                                "/api/employees/**"
                        ).hasAnyRole(
                                "HR",
                                "EMPLOYEE"
                        )


                        // =========================================
                        // LEAVE APIs
                        // =========================================

                        .requestMatchers(
                                "/api/leaves/**"
                        ).hasAnyRole(
                                "HR",
                                "EMPLOYEE"
                        )


                        // =========================================
                        // SALARY STRUCTURE APIs
                        // =========================================

                        .requestMatchers(
                                "/api/salary-structures/**"
                        ).hasRole("HR")


                        // =========================================
                        // PAYROLL APIs
                        // =========================================

                        .requestMatchers(
                                "/api/payroll/**"
                        ).hasRole("HR")


                        // =========================================
                        // PAYSLIP APIs
                        // =========================================

                        .requestMatchers(
                                "/api/payslips/**"
                        ).hasRole("HR")


                        // =========================================
                        // EVERYTHING ELSE
                        // =========================================

                        .anyRequest().authenticated()
                )


                // =================================================
                // JWT FILTER
                // =================================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // =====================================================
    // AUTHENTICATION MANAGER
    // =====================================================

    @Bean
    public org.springframework.security.authentication.AuthenticationManager
    authenticationManager(
            org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }
}