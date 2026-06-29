package io.dayline.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.dayline.dto.TopicRecommendResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TopicService {

    @Value("${openai.api-key}")
    private String apiKey;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.url}")
    private String url;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String SYSTEM_PROMPT = """
            당신은 외국어 회화 연습을 도와주는 AI 어시스턴트입니다.

            규칙:
            - 사용자에게 입력된 targetLanguage에 맞는 주제를 한국어로 제안합니다.
            - 각 주제(topic)는 3개를 제안합니다.
            - 각 주제에 대해 단어 3개를 targetLanguage로 함께 제안합니다.
            - 단어는 일상 회화, 감정 표현, 의견 전달에 유용한 단어 위주로 골라주세요.
            - 같은 주제의 단어가 중복되지 않게 구성합니다.
            - 결과는 간결하게 작성합니다.
            - topic, vocabularies, word, meaning, pron 필드를 반드시 포함합니다.
            - pron 필드는 단어의 발음 표기를 의미합니다.
            - 반드시 JSON만 반환합니다.
            - topic 과 meaning 은 한국어로 반환합니다.

            입력:
            - targetLanguage: {language}

            출력 형식:
            {
                "topics": [
                    {
                        "topic": "string",
                        "vocabularies": [
                            {"word": "string", "meaning": "string", "pron": "string"},
                            {"word": "string", "meaning": "string", "pron": "string"},
                            {"word": "string", "meaning": "string", "pron": "string"}
                        ]
                        },
                    {
                        "topic": "string",
                        "vocabularies": [
                            {"word": "string", "meaning": "string", "pron": "string"},
                            {"word": "string", "meaning": "string", "pron": "string"},
                            {"word": "string", "meaning": "string", "pron": "string"}
                        ]
                    },
                    {
                        "topic": "string",
                        "vocabularies": [
                            {"word": "string", "meaning": "string", "pron": "string"},
                            {"word": "string", "meaning": "string", "pron": "string"},
                            {"word": "string", "meaning": "string", "pron": "string"}
                        ]
                    }
                ]
            }
            """;

    public TopicRecommendResponse recommendTopics(String targetLanguage) {
        WebClient client = WebClient.create();
        
        Map<String,Object> body = Map.of(
            "model", model,
            "messages", List.of(
                Map.of(
                    "role","system",
                    "content", SYSTEM_PROMPT
                ),
                Map.of(
                    "role","user",
                    "content", targetLanguage
                )
            )
        );

        try {
            String response = client.post()
                    .uri(url)
                    .header("Authorization","Bearer " + apiKey)
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

            return objectMapper.readValue(content, TopicRecommendResponse.class);
        
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
