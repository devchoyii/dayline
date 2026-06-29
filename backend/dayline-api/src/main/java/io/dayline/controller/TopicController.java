package io.dayline.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.dayline.dto.TopicRecommendResponse;
import io.dayline.service.TopicService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/topics")
public class TopicController {
    
    private final TopicService topicService;

    @PostMapping("/recommend")
    public TopicRecommendResponse recommend(@RequestParam("targetLanguage") String targetLanguage) {
        
        TopicRecommendResponse topicRecommendResponse = new TopicRecommendResponse();
        topicRecommendResponse = topicService.recommendTopics(targetLanguage);

        System.out.println(topicRecommendResponse);

        return topicRecommendResponse;
    }
}
