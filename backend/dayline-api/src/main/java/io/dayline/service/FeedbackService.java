package io.dayline.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.dayline.dto.FeedbackRequest;
import io.dayline.dto.FeedbackResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    @Value("${openai.api-key}")
    private String apiKey;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.url}")
    private String url;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String SYSTEM_PROMPT = """
            You are an AI writing feedback assistant for language learners.

            Task:
            - Read the user's diary in targetLanguage.
            - Find grammar, vocabulary, expression, naturalness, and sentence-flow issues.
            - Give practical, kind, easy-to-understand feedback.
            - Write all feedback in Korean.
            - Do not repeat the whole diary.

            Output rules:
            - Return only one valid JSON object.
            - Do not include markdown, code fences, comments, or extra text outside JSON.
            - Use double quotes for every JSON string. Never use single quotes.
            - Escape quotes inside string values correctly.
            - If there are no corrections, use an empty array.
            - If a string value is not available, use an empty string.

            Required JSON shape:
            {
              "summary": "Write a 1-2 sentence overall summary in Korean",
              "corrections": [
                {
                  "original": "Part of the original diary text",
                  "corrected": "Corrected expression",
                  "reason": "Briefly explain in Korean why this correction is better"
                }
              ],
              "encouragement": "Write a short encouraging message in Korean"
            }
            """;

    public FeedbackResponse aiFeedback(FeedbackRequest request) {
        WebClient client = WebClient.create();

        Map<String, Object> body = Map.of(
            "model", model,
            "response_format", Map.of("type", "json_object"),
            "temperature", 0,
            "messages", List.of(
                Map.of(
                    "role", "system",
                    "content", SYSTEM_PROMPT
                ),
                Map.of(
                    "role", "user",
                    "content", "targetLanguage: " + request.getTargetLanguage() + "\n" +
                                    "diary: " + request.getDiary()
                )
            )
        );

        try {
            String response = client.post()
                    .uri(url)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(response);
            String content = root
                    .get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText();

            content = content
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            try {
                return objectMapper.readValue(content, FeedbackResponse.class);
            } catch (JsonProcessingException e) {
                System.out.println("Invalid AI JSON content:");
                System.out.println(content);
                throw e;
            }

        } catch (WebClientResponseException e) {
            System.out.println("HTTP status: " + e.getStatusCode());
            System.out.println("Response body: " + e.getResponseBodyAsString());

            throw new RuntimeException("OpenAI API response error", e);

        } catch (WebClientRequestException e) {
            System.out.println("Request failed: " + e.getMessage());

            throw new RuntimeException("OpenAI API request error", e);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
