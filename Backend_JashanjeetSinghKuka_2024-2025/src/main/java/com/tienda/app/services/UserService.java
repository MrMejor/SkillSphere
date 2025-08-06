package com.tienda.app.services;

import com.tienda.app.dtos.auth.*;
import com.tienda.app.models.Role;
import com.tienda.app.models.UserInfo;
import com.tienda.app.security.JwtUtil;
import com.tienda.app.models.User;

import com.tienda.app.repositories.RoleRepository;
import com.tienda.app.repositories.UserInfoRepository;
import com.tienda.app.repositories.UserRepository;
import com.tienda.app.repositories.PostRepository;
import com.tienda.app.repositories.CommentRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserInfoRepository userInfoRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
                       UserInfoRepository userInfoRepository , PostRepository postRepository , CommentRepository commentRepository , AuthenticationManager authenticationManager,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userInfoRepository = userInfoRepository;
      this.postRepository = postRepository;
      this.commentRepository = commentRepository;
      this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return this.userRepository.findByUsername(username)
                .map(user -> org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password(user.getPassword())
                        .authorities(user.getRole().getRoleName().name())
                        .build()
                ).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }


    public List<User> getAllUsers() {
        return this.userRepository.findAll();
    }

    public Optional<User> getUserById(long id) {
        return this.userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        return this.userRepository.findByUsername(username);
    }

    public void deleteUserById(long id) {
        this.userRepository.deleteById(id);
    }

    @Transactional
    public User createUser( RegisterRequest userFromFront) {

        if (this.userRepository.existsByUsername(userFromFront.getUsername())) {
            throw new IllegalArgumentException("User already exists");
        }

        else {
            Role role = this.roleRepository.findByRoleName(userFromFront.getRoleName()).orElseThrow(
                    () -> new IllegalArgumentException("Role no permitido")
            );

            User user = new User();
            user.setUsername(userFromFront.getUsername());
            user.setPassword(
                    this.passwordEncoder.encode(userFromFront.getPassword())
            );
            user.setRole(role);
            user = this.userRepository.save(user);

            UserInfo userInfo = new UserInfo();
            userInfo.setUser(user);
            userInfo.setFirstName(userFromFront.getFirstName());
            userInfo.setLastName(userFromFront.getLastName());
            userInfo.setAddress(userFromFront.getAddress());

            this.userInfoRepository.save(userInfo);
            return user;
        }

    }


    public LoginResponse login( LoginRequest credentials) {
        // Comprobamos si el usuario existe
        User user = this.userRepository.findByUsername(credentials.getUsername()).orElseThrow(
                () -> new BadCredentialsException("User not found")
        );

        // Comprobamos si la contraseña no coincide con la que tenemos en la base de datos
        if (!this.passwordEncoder.matches(credentials.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        LoginResponse loginData = new LoginResponse();
        loginData.setUsername(credentials.getUsername());
        loginData.setRole(user.getRole().getRoleName());
        loginData.setToken(this.jwtUtil.generateToken(credentials.getUsername()));

        return loginData;
    }

    public boolean checkToken( CheckTokenRequest checkTokenRequest) {
        return this.jwtUtil.validateToken(
                checkTokenRequest.getToken(),
                checkTokenRequest.getUsername()
        );
    }

    // Method to fetch a user by username
    public User getUserByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        return userOptional.orElse(null); // Return null if the user is not found
    }

    public void changePassword(String username, String oldPassword, String newPassword) {
        // Find the user by username
        User user = this.userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Verify the old password
        if (!this.passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        // Encode and set the new password
        user.setPassword(this.passwordEncoder.encode(newPassword));
        this.userRepository.save(user);
    }

    public void updateUserProfilePicture(String username, String base64Image) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (base64Image != null && !base64Image.isEmpty()) {
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);
            user.setProfilePicture(imageBytes);
        } else {
            user.setProfilePicture(null);
        }

        userRepository.save(user);
    }

    public byte[] getUserProfilePicture(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getProfilePicture();
    }

    @Transactional
    public void updateUserProfile(String username, UserProfileUpdateRequest updateRequest) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserInfo userInfo = user.getUserInfo();
        if (userInfo == null) {
            userInfo = new UserInfo();
            userInfo.setUser(user);
        }

        userInfo.setFirstName(updateRequest.getFirstName());
        userInfo.setLastName(updateRequest.getLastName());
        userInfo.setAddress(updateRequest.getAddress());

        userInfoRepository.save(userInfo);
    }

    public List<UserPostSummaryDTO> getAllUserPostSummaries() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> {
            String fullName = "";
            if (user.getUserInfo() != null) {
                fullName = user.getUserInfo().getFirstName() + " " + user.getUserInfo().getLastName();
            }
            String username = user.getUsername();
            long postCount = postRepository.findBySellerUsernameOrderByCreatedAtDesc(username).size();
            return new UserPostSummaryDTO(fullName, username, postCount, user.getRole().getRoleName().name());
        }).collect( Collectors.toList());
    }

    @Transactional
    public void deleteUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Long userId = user.getId();

        // Delete all associated entities in the correct order
        commentRepository.deleteAllByUserId(userId);  // Comments referencing posts
        postRepository.deleteAllByUserId(userId);    // Posts referencing user
        userInfoRepository.deleteByUser(user);       // UserInfo referencing user

        // Then delete the user
        userRepository.delete(user);
    }

}
