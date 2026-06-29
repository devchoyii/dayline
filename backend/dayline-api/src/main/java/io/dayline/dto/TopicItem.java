package io.dayline.dto;

import java.util.List;

import lombok.Data;

public @Data class TopicItem {
    
    private String topic;
    private List<VocabularyItem> vocabularies;
}
