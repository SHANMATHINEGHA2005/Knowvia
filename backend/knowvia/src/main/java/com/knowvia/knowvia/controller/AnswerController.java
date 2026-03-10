package com.knowvia.knowvia.controller;

import com.knowvia.knowvia.entity.Answer;
import com.knowvia.knowvia.repository.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AnswerController {

    @Autowired
    private AnswerRepository repo;

    @PostMapping("/answers")
    public Answer addAnswer(@RequestBody Answer answer) {
        return repo.save(answer);
    }

    @GetMapping("/answers/{questionId}")
    public List<Answer> getAnswers(@PathVariable Long questionId) {
        return repo.findByQuestionId(questionId);
    }

    @PutMapping("/answers/like/{id}")
    public Answer likeAnswer(@PathVariable Long id) {

        Answer a = repo.findById(id).get();

        a.setLikes(a.getLikes() + 1);

        return repo.save(a);
    }

    @PutMapping("/answers/dislike/{id}")
    public Answer dislikeAnswer(@PathVariable Long id) {

        Answer a = repo.findById(id).get();

        a.setDislikes(a.getDislikes() + 1);

        return repo.save(a);
    }

    @PutMapping("/answers/best/{id}")
    public Answer markBest(@PathVariable Long id) {

        Answer a = repo.findById(id).get();

        a.setBestAnswer(true);

        return repo.save(a);
    }
}