package io.dayline.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class DiaryRequest {
    private Long id;
    private String targetLanguage;
    private LocalDate  diaryDate;
    private String content;
}
