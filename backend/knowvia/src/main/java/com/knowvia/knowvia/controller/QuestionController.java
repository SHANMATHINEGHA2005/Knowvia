package com.knowvia.knowvia.controller;

import com.knowvia.knowvia.entity.Question;
import com.knowvia.knowvia.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    public Question addQuestion(@RequestBody Question question) {
        return questionService.saveQuestion(question);
    }

    @GetMapping
    public List<Question> getQuestions() {
        return questionService.getAllQuestions();
    }
}