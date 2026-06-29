package io.dayline.dto;

import lombok.Data;

public @Data class TranslationResponse {
    
    private String text;
    private String translation;
    private String pron;
}
