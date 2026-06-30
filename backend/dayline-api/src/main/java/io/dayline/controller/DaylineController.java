package io.dayline.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.dayline.dto.DiaryRequest;
import io.dayline.dto.DiaryResponse;
import io.dayline.service.DaylineService;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/dayline")
public class DaylineController {

    private final DaylineService daylineService;

    @PostMapping("/save")
    public ResponseEntity<Void> saveDiary(@RequestBody DiaryRequest request, Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        daylineService.saveDiary(userId, request);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/select")
    public ResponseEntity<DiaryResponse> selectDiary(@RequestBody DiaryRequest request, Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        DiaryResponse response = daylineService.selectDiary(userId, request);
        return ResponseEntity.ok(response);
    }
}
