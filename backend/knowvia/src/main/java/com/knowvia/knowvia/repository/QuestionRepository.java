package com.knowvia.knowvia.repository;

import com.knowvia.knowvia.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {

}