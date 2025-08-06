package com.tienda.app.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    private static final RequestMatcher[] EXCLUDED_PATHS = new RequestMatcher[]{
        new AntPathRequestMatcher("/api/stripe/webhook", null)
    };



    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return Arrays.stream(EXCLUDED_PATHS)
            .anyMatch(matcher -> matcher.matches(request));
    }
//    protected boolean shouldNotFilter(HttpServletRequest request) {
//        for (RequestMatcher matcher : EXCLUDED_PATHS) {
//            if (matcher.matches(request)) {
//                return true;
//            }
//        }
//        return false;
//    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        String path = request.getRequestURI();
        System.out.println("Request path: " + path);

        final String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        log.info("Authorization header: {}", authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7).trim();

            if (token.split("\\.").length == 3) {
                try {
                    username = this.jwtUtil.extractUsername(token);
                } catch (JwtException e) {
                    log.error("Error al extraer el username del token: {}", e.getMessage());
                }
            } else {
                log.warn("Token format is invalid: {}", token);
            }
        } else {
            log.warn("Authorization header is missing or does not start with Bearer");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            if (this.jwtUtil.validateToken(token, username)) {
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
