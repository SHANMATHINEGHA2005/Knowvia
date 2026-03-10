package com.knowvia.knowvia.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AIController {

    @PostMapping("/ai")
    public String getAIAnswer(@RequestBody Map<String, String> body) {

        try {

            String question = body.get("question");

            RestTemplate restTemplate = new RestTemplate();

            String url = "https://api.affiliateplus.xyz/api/chatbot?message="
                    + question
                    + "&botname=Knowvia&ownername=Student";

            Map response = restTemplate.getForObject(url, Map.class);

            if (response != null && response.get("message") != null) {
                return response.get("message").toString();
            }

            return "AI could not generate an answer.";

        } catch (Exception e) {

            return "AI service temporarily unavailable.";

        }
    }
}

/*package com.knowvia.knowvia.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AIController {

    @PostMapping("/ai")
    public String getAIAnswer(@RequestBody Map<String, String> body) {

        String question = body.get("question");

        RestTemplate restTemplate = new RestTemplate();

        String url = "https://api.affiliateplus.xyz/api/chatbot?message="
                + question
                + "&botname=Knowvia&ownername=Student";

        Map response = restTemplate.getForObject(url, Map.class);

        return response.get("message").toString();
    }
}*/