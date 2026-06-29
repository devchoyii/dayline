package io.dayline.dto;

import lombok.Data;

public @Data class TranslationRequest {
    
    private String targetLanguage;
    private String text;
}
