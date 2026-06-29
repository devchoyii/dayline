package io.dayline.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.dayline.dto.FeedbackRequest;
import io.dayline.dto.FeedbackResponse;
import io.dayline.service.FeedbackService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public FeedbackResponse aiFeedback(@RequestBody FeedbackRequest body) {

        FeedbackResponse feedbackResponse = new FeedbackResponse();
        feedbackResponse = feedbackService.aiFeedback(body);

        System.out.println(feedbackResponse);

        return feedbackResponse;
    }
}
