package io.dayline.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "diaries",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_diary_user_language_date",
        columnNames = {"user_id", "target_language", "diary_date"}
        )
)
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class Diary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "diary_date", nullable = false)
    private LocalDate diaryDate; // YYYY-MM-DD 

    @Column(name = "target_language", nullable = false)
    private String targetLanguage;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "created_at", nullable = false)
    private String createdAt; // ISO 8601 형식의 날짜와 시간 (예: 2024-06-01T12:00:00Z)

    @Column(name = "updated_at", nullable = false)
    private String updatedAt; // ISO 8601 형식의 날짜와 시간 (예: 2024-06-01T12:00:00Z)

    public Diary(User user, LocalDate diaryDate, String targetLanguage, String content, String createdAt, String updatedAt) {
        this.user = user;
        this.diaryDate = diaryDate;
        this.targetLanguage = targetLanguage;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public void updateContent(String content, String updatedAt) {
        this.content = content;
        this.updatedAt = updatedAt;
    }
}
