package io.dayline.dto;

import java.util.List;

import lombok.Data;

public @Data class FeedbackResponse {

    private String summary;
    private List<CorrectionDto> corrections;
    private String encouragement;
    
}
