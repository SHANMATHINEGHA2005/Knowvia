/*package com.knowvia.knowvia.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")  // maps to http://localhost:8080/
    public String home() {
        return "Knowvia World!";
    }
}*/

package com.knowvia.knowvia.controller;

import com.knowvia.knowvia.entity.User;
import com.knowvia.knowvia.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/")  // Base URL for HomeController
public class HomeController {

    private final UserService userService;

    public HomeController(UserService userService) {
        this.userService = userService;
    }

    // Home page
    @GetMapping
    public String home() {
        return "Welcome to Knowvia!";
    }

    // Get all users
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    // Add a new user
    @PostMapping("/users")
    public User addUser(@RequestBody User user) {
        return userService.saveUser(user);
    }
}