package com.javaquiz;

import com.javaquiz.security.CustomUserDetailsService;
import com.javaquiz.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class JwtTokenProviderTest {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Test
    void generatesAndValidatesJwtTokenForAuthenticatedPrincipal() {
        UserDetails details = userDetailsService.loadUserByUsername("creator@javaquiz.com");
        var auth = new UsernamePasswordAuthenticationToken(details, null, details.getAuthorities());

        String token = jwtTokenProvider.generateToken(auth);
        assertThat(token).isNotBlank();
        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
        assertThat(jwtTokenProvider.getEmailFromToken(token)).isEqualTo("creator@javaquiz.com");
    }

    @Test
    void rejectsMalformedOrTamperedTokens() {
        assertThat(jwtTokenProvider.validateToken("invalid.jwt.token")).isFalse();
        assertThat(jwtTokenProvider.validateToken("")).isFalse();
    }
}
