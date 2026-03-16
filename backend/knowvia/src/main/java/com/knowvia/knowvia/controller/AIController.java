package com.knowvia.knowvia.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AIController {

    private static final String API_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    private static final String API_KEY = "GROQ_API_KEY";

    @PostMapping("/ai")
    public String getAIAnswer(@RequestBody Map<String,String> request){

        try{

            String question = request.get("question");

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization","Bearer " + API_KEY);

            Map<String,Object> body = new HashMap<>();

            body.put("model","llama-3.1-8b-instant");

            List<Map<String,String>> messages = new ArrayList<>();

            // System instruction
            Map<String,String> system = new HashMap<>();
            system.put("role","system");
            system.put("content","You are an educational assistant for the Knowvia platform. Explain concepts clearly for students using simple language. Use a short paragraph and bullet points if helpful.");

            messages.add(system);

            Map<String,String> message = new HashMap<>();
            message.put("role","user");
            message.put("content",question);
            //message.put("content","Answer clearly. Use a short paragraph and bullet points if necessary: " + question);

            messages.add(message);

            body.put("messages",messages);

            HttpEntity<Map<String,Object>> entity =
                    new HttpEntity<>(body,headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(API_URL,entity,String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            return root
                    .get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText();

        }
        catch(Exception e){
            return "Error calling AI API: " + e.getMessage();
        }
    }
}