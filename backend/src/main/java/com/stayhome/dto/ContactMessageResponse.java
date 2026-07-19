package com.stayhome.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactMessageResponse {
    private Long id;
    private String name;
    private String emailOrPhone;
    private String message;
    private LocalDateTime createdAt;
}
