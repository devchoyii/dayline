package io.dayline.dto;

import java.util.List;

import lombok.Data;

public @Data class TopicRecommendResponse {

    private List<TopicItem> topics;
}
