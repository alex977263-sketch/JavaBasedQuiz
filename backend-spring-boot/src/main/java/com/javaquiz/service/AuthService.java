package com.javaquiz.service;

import com.javaquiz.dto.AuthResponse;
import com.javaquiz.dto.LoginRequest;
import com.javaquiz.dto.RegisterRequest;
import com.javaquiz.entity.Role;
import com.javaquiz.entity.RoleName;
import com.javaquiz.entity.SystemSettings;
import com.javaquiz.entity.User;
import com.javaquiz.exception.BadRequestException;
import com.javaquiz.repository.RoleRepository;
import com.javaquiz.repository.SystemSettingsRepository;
import com.javaquiz.repository.UserRepository;
import com.javaquiz.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SystemSettingsRepository systemSettingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final DtoMapper mapper;
    private final AuditLogService auditLogService;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmailOrUsername(),
                        request.getPassword()
                )
        );

        String token = jwtTokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmailOrUsername())
                .or(() -> userRepository.findByUsername(request.getEmailOrUsername()))
                .orElseThrow(() -> new BadRequestException("User account not found"));

        auditLogService.record(
                user.getEmail(),
                user.getPrimaryRole().name(),
                "USER_LOGIN",
                "User",
                user.getId(),
                "Authenticated successfully via JWT"
        );

        return AuthResponse.builder()
                .accessToken(token)
                .user(mapper.toUserDto(user))
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        SystemSettings settings = systemSettingsRepository.findById(1L).orElse(null);
        if (settings != null && Boolean.FALSE.equals(settings.getRegistrationOpen())) {
            throw new BadRequestException("New user registration is currently disabled by administrator.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists.");
        }

        String baseUsername = request.getEmail().split("@")[0]
                .replaceAll("[^a-zA-Z0-9_]", "_")
                .toLowerCase();
        String username = userRepository.existsByUsername(baseUsername)
                ? baseUsername + "_" + System.currentTimeMillis() % 10000
                : baseUsername;

        RoleName requestedRole = request.getRole() != null ? request.getRole() : RoleName.ROLE_PARTICIPANT;
        Role role = roleRepository.findByName(requestedRole)
                .orElseThrow(() -> new BadRequestException("Role not configured: " + requestedRole));

        User newUser = User.builder()
                .username(username)
                .email(request.getEmail().trim().toLowerCase())
                .fullName(request.getFullName().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .collegeOrCompany(request.getCollegeOrCompany())
                .isEnabled(true)
                .roles(new HashSet<>(Set.of(role)))
                .build();

        User saved = userRepository.save(newUser);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(saved.getEmail(), request.getPassword())
        );

        auditLogService.record(
                saved.getEmail(),
                saved.getPrimaryRole().name(),
                "USER_REGISTER",
                "User",
                saved.getId(),
                "Registered new account"
        );

        return AuthResponse.builder()
                .accessToken(jwtTokenProvider.generateToken(authentication))
                .user(mapper.toUserDto(saved))
                .build();
    }
}
