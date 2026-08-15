package com.knowvia.knowvia.controller;

import com.knowvia.knowvia.entity.User;
import com.knowvia.knowvia.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaderboard")   // base URL
@CrossOrigin(origins = "http://localhost:3000")
public class LeaderboardController {

    private final UserRepository userRepository;

    public LeaderboardController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET: http://localhost:8080/leaderboard
    @GetMapping
    public List<User> getLeaderboard() {
        return userRepository.findTop10ByOrderByPointsDesc();
    }
}