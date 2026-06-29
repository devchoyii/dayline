package io.dayline.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.dayline.dto.TranslationRequest;
import io.dayline.dto.TranslationResponse;
import io.dayline.service.TranslationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/translation")
public class TranslationController {
    
    private final TranslationService translationService;

    @PostMapping
    public TranslationResponse requestTranslation(@RequestBody TranslationRequest body) {
        
        TranslationResponse response = new TranslationResponse();
        response = translationService.requestTranslation(body);

        System.out.println(response);

        return response;
    }

}
