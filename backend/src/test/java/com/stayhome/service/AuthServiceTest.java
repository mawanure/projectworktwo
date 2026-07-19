package com.stayhome.service;

import com.stayhome.dto.AuthResponse;
import com.stayhome.dto.LoginRequest;
import com.stayhome.dto.RegisterRequest;
import com.stayhome.dto.UserResponse;
import com.stayhome.entity.Role;
import com.stayhome.entity.User;
import com.stayhome.exception.EmailAlreadyExistsException;
import com.stayhome.repository.UserRepository;
import com.stayhome.security.JwtUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtUtils jwtUtils;

    @InjectMocks private AuthService authService;

    @Test
    void registerSuccessful() {
        RegisterRequest req = RegisterRequest.builder()
                .name("Test User")
                .email("test@example.com")
                .password("password123")
                .phone("01700000000")
                .build();

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        
        User savedUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .password("hashedPassword")
                .role(Role.CUSTOMER)
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserResponse res = authService.register(req);

        assertNotNull(res);
        assertEquals("test@example.com", res.getEmail());
        assertEquals(Role.CUSTOMER, res.getRole());
    }

    @Test
    void registerThrowsEmailAlreadyExists() {
        RegisterRequest req = RegisterRequest.builder()
                .email("existing@example.com")
                .build();

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(req));
    }

    @Test
    void loginSuccessful() {
        LoginRequest req = LoginRequest.builder()
                .email("test@example.com")
                .password("password123")
                .build();

        User user = User.builder()
                .id(1L)
                .email("test@example.com")
                .role(Role.CUSTOMER)
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(jwtUtils.generateToken("test@example.com", "CUSTOMER")).thenReturn("jwtToken");

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("jwtToken", res.getToken());
        assertEquals("test@example.com", res.getUser().getEmail());
    }
}
