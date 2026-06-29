package io.dayline.dto;

import lombok.Data;

public  @Data class CorrectionDto {

    private String original;
    private String corrected;
    private String reason;
    
}
