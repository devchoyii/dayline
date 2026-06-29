package io.dayline.dto;

import lombok.Data;

@Data
public class FeedbackRequest {
    private String targetLanguage;
    private String diary;
}
