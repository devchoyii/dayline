package io.dayline.controller;

import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Void> saveDiary(@RequestBody DiaryRequest request) {
        daylineService.saveDiary(request);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/select")
    public ResponseEntity<DiaryResponse> selectDiary(@RequestBody DiaryRequest request) {
        DiaryResponse response = daylineService.selectDiary(request);
        return ResponseEntity.ok(response);
    }
}
