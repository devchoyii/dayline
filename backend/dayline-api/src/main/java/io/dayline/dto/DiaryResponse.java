package io.dayline.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class DiaryResponse {
    private Long id;
    private String targetLanguage;
    private LocalDate diaryDate;
    private String content;
}
