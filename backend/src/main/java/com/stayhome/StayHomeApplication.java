package com.stayhome;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class StayHomeApplication {
    public static void main(String[] args) {
        SpringApplication.run(StayHomeApplication.class, args);
    }

    @Bean
    public CommandLineRunner migrateDatabase(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE orders MODIFY COLUMN status VARCHAR(30) NOT NULL DEFAULT 'PENDING'");
                jdbcTemplate.execute("ALTER TABLE orders MODIFY COLUMN payment_status VARCHAR(30) NOT NULL DEFAULT 'UNPAID'");
                System.out.println("DATABASE MIGRATION: successfully converted status and payment_status to VARCHAR.");
            } catch (Exception e) {
                System.err.println("DATABASE MIGRATION ERROR: " + e.getMessage());
            }
        };
    }
}
