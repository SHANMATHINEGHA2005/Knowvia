package com.knowvia.knowvia.controller;

import com.knowvia.knowvia.entity.Answer;
import com.knowvia.knowvia.entity.Question;
import com.knowvia.knowvia.entity.User;
import com.knowvia.knowvia.repository.AnswerRepository;
import com.knowvia.knowvia.repository.QuestionRepository;
import com.knowvia.knowvia.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AnswerController {

    @Autowired
    private AnswerRepository repo;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    // 🔥 ADD ANSWER WITH POINTS
    @PostMapping("/answers")
    public Answer addAnswer(@RequestBody Map<String, Object> body) {

        Long questionId = Long.valueOf(body.get("questionId").toString());
        String answerText = body.get("answerText").toString();
        Long userId = Long.valueOf(body.get("userId").toString());

        Question q = questionRepository.findById(questionId).orElse(null);
        User u = userRepository.findById(userId).orElse(null);

        Answer answer = new Answer();
        answer.setQuestion(q);
        answer.setAnswerText(answerText);
        answer.setUser(u);

        // 🔥 ADD POINTS
        if (u != null) {
            u.setPoints(u.getPoints() + 10);
            userRepository.save(u);
        }

        return repo.save(answer);
    }

    // GET ANSWERS
    @GetMapping("/answers/{questionId}")
    public List<Answer> getAnswers(@PathVariable Long questionId) {
        return repo.findByQuestion_Id(questionId);
    }

    // LIKE
    @PutMapping("/answers/like/{id}")
    public Answer likeAnswer(@PathVariable Long id) {
        Answer a = repo.findById(id).get();
        a.setLikes(a.getLikes() + 1);
        return repo.save(a);
    }

    // DISLIKE
    @PutMapping("/answers/dislike/{id}")
    public Answer dislikeAnswer(@PathVariable Long id) {
        Answer a = repo.findById(id).get();
        a.setDislikes(a.getDislikes() + 1);
        return repo.save(a);
    }

    // BEST ANSWER
    @PutMapping("/answers/best/{id}")
    public Answer markBest(@PathVariable Long id) {
        Answer a = repo.findById(id).get();
        a.setBestAnswer(true);
        return repo.save(a);
    }
}