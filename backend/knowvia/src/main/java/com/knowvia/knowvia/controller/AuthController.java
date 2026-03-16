package com.knowvia.knowvia.controller;

import com.knowvia.knowvia.entity.User;
import com.knowvia.knowvia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

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

        User user = userRepository.findByEmail(loginUser.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(loginUser.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}