package com.stayhome.controller;

import com.stayhome.dto.AuthResponse;
import com.stayhome.dto.LoginRequest;
import com.stayhome.dto.RegisterRequest;
import com.stayhome.dto.UserResponse;
import com.stayhome.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthIntegrationTest {

    @Mock private AuthService authService;
    @InjectMocks private AuthController authController;

    @Test
    void registerCallsAuthService() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Amina")
                .email("amina@example.com")
                .password("amina123")
                .build();
        UserResponse response = UserResponse.builder().id(1L).email("amina@example.com").build();
        when(authService.register(request)).thenReturn(response);

        ResponseEntity<UserResponse> res = authController.register(request);

        assertEquals(HttpStatus.CREATED, res.getStatusCode());
        assertEquals("amina@example.com", res.getBody().getEmail());
        verify(authService).register(request);
    }

    @Test
    void loginCallsAuthService() {
        LoginRequest request = LoginRequest.builder().email("amina@example.com").password("amina123").build();
        AuthResponse response = AuthResponse.builder().token("token").build();
        when(authService.login(request)).thenReturn(response);

        ResponseEntity<AuthResponse> res = authController.login(request);

        assertEquals(HttpStatus.OK, res.getStatusCode());
        assertEquals("token", res.getBody().getToken());
        verify(authService).login(request);
    }
}
