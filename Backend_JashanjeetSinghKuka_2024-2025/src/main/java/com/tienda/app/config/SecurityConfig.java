package com.tienda.app.config;


import com.tienda.app.security.JwtAuthenticationFilter;
import com.tienda.app.security.JwtUtil;
import com.tienda.app.repositories.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public SecurityConfig(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> this.userRepository.findByUsername(username)
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password(user.getPassword())
                        .authorities(user.getRole().getRoleName().name())
                        .build()
                ).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(UserDetailsService userDetailsService) {
        return new JwtAuthenticationFilter(this.jwtUtil, userDetailsService);
    }

//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthFilter) throws Exception {
//        http.csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers(
//                                "/users/login",
//                                "/users",
//                                "/users/register",
//                                "/users/check-token",
//                                "/users/profile",
//                                "/users/change-password",
////                              "/products",
//                                "/posts",
////                              "/products/create",
//                                "/posts/create",
////                              "/products/users/{username}",
//                                "/posts/users/{username}",
//                                "/posts/{id}",
//                                "/likes",
//                                "/likes/count/{postId}",
//                                "/likes/check/{postId}/{userId}",
//                                "/comments",
//                                "/comments/post/{postId}",
//                                "/comments/add"
//
//                        ).permitAll()
//                    .requestMatchers( HttpMethod.GET, "/likes/count/**").permitAll()
//                        .anyRequest()
//                        .authenticated()
//
//                )
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthFilter) throws Exception {
http
        .cors( Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/users/login",
                    "/users",
                    "/users/register",
                    "/users/check-token",
                    "/users/profile",
                    "/users/change-password",
                    "/users/{username}/profile-picture",
                    "/users/{username}/purchases",
//                    "/users/count",
                    "/posts",
                    "/posts/create",
                    "/posts/users/{username}",
                    "/posts/{id}",
                    "/posts/{id}/image",
                    "/likes",
                    "/likes/count/{postId}",
                    "/likes/check/{postId}/{userId}",
                    "/comments",
                    "/comments/post/{postId}",
                    "/comments/add",
                    "/create-checkout-session",
                    "/api/stripe/webhook",
                    "/users/admin/user-post-summaries",
                    "/users/delete/{username}"
                ).permitAll()
                .requestMatchers(
                    "/users/delete/**",
                    "/users/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/posts/purchases/check").authenticated()
                .requestMatchers(HttpMethod.GET, "/likes/count/**","/users/count")
                .permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins( List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
