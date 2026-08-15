package com.knowvia.knowvia.controller;

import com.knowvia.knowvia.entity.User;
import com.knowvia.knowvia.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    // Browser check
    @GetMapping("/")
    public String home() {
        return "Knowvia Auth API is running";
    }

    // Browser check for signup
    @GetMapping("/signup")
    public String signupInfo() {
        return "Signup endpoint works. Use POST method to create account.";
    }

    // Browser check for login
    @GetMapping("/login")
    public String loginInfo() {
        return "Login endpoint works. Use POST method to login.";
    }

    // Signup API
    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userRepository.save(user);
    }

    // Login API
    @PostMapping("/login")
    public User login(@RequestBody User loginUser) {
        logger.info("=== Login attempt started ===");

        if (loginUser == null) {
            logger.error("Login request body was null.");
            throw new RuntimeException("Login request body is empty");
        }

        String emailFromFrontend = loginUser.getEmail();
        String passwordFromFrontend = loginUser.getPassword();

        logger.info("Email received from frontend: {}", emailFromFrontend);
        logger.info("Password received from frontend: {}", passwordFromFrontend);

        if (emailFromFrontend == null || emailFromFrontend.trim().isEmpty()) {
            logger.error("Email received from frontend is null or empty.");
            throw new RuntimeException("Email is required");
        }

        if (passwordFromFrontend == null) {
            logger.error("Password received from frontend is null.");
            throw new RuntimeException("Password is required");
        }

        String trimmedEmail = emailFromFrontend.trim();
        String trimmedPassword = passwordFromFrontend.trim();

        logger.info("Trimmed email from frontend: {}", trimmedEmail);
        logger.info("Trimmed password from frontend: {}", trimmedPassword);

        User user = userRepository.findByEmail(trimmedEmail)
                .orElseThrow(() -> {
                    logger.error("User not found for email: {}", trimmedEmail);
                    return new RuntimeException("User not found");
                });

        String passwordFromDatabase = user.getPassword();
        logger.info("Password retrieved from database: {}", passwordFromDatabase);

        if (passwordFromDatabase == null) {
            logger.error("Password retrieved from database is null.");
            throw new RuntimeException("Stored password is missing");
        }

        String trimmedPasswordFromDatabase = passwordFromDatabase.trim();
        logger.info("Trimmed password from database: {}", trimmedPasswordFromDatabase);

        boolean passwordsEqual = trimmedPassword.equals(trimmedPasswordFromDatabase);
        logger.info("Whether both passwords are equal: {}", passwordsEqual);

        if (!passwordsEqual) {
            logger.error("Password comparison failed for email: {}", trimmedEmail);
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}