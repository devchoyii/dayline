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

import io.dayline.dto.TranslationRequest;
import io.dayline.dto.TranslationResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TranslationService {
    
    @Value("${openai.api-key}")
    private String apiKey;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.url}")
    private String url;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String SYSTEM_PROMPT = """
            당신은 외국어 일기 작성을 돕는 AI 번역 어시스턴트입니다.

            역할:
            - 사용자가 입력한 한국어 단어 또는 문장을 targetLanguage로 번역합니다.
            - 번역 결과는 외국어 일기나 일상 표현에 바로 사용할 수 있도록 자연스럽게 작성합니다.

            규칙:
            - 입력이 단어이면 가장 자연스럽고 일반적인 표현으로 번역합니다.
            - 입력이 문장이면 targetLanguage 화자가 실제로 사용할 법한 자연스러운 문장으로 번역합니다.
            - 원문의 핵심 의미를 유지합니다.
            - 지나친 직역이나 과도한 의역은 피합니다.
            - targetLanguage는 영어, 스페인어, 일본어 등 다양한 언어가 될 수 있으며, 해당 언어의 자연스러운 표현을 사용합니다.
            - 설명, 해설, 예시, 추가 문장은 포함하지 않습니다.
            - 응답은 반드시 JSON 객체만 반환합니다.
            - JSON 외의 텍스트, 코드블록, 마크다운은 절대 포함하지 않습니다.

            입력:
            - text: {text}
            - targetLanguage: {targetLanguage}

            출력 형식:
            {
            "text": "사용자가 입력한 한국어 원문",
            "translation": "targetLanguage로 번역된 결과",
            "pron": "translation의 발음을 영문으로 표기"
            }
            """;

    public TranslationResponse requestTranslation(TranslationRequest request) {
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
                    "content", "text: " + request.getText() + "\n" + 
                                    "targetLanguage: " + request.getTargetLanguage()
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
            
            return objectMapper.readValue(content, TranslationResponse.class);

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
