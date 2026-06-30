package io.dayline.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    public Diary(User user, LocalDate diaryDate, String targetLanguage, String content, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.user = user;
        this.diaryDate = diaryDate;
        this.targetLanguage = targetLanguage;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public void updateContent(String content, LocalDateTime updatedAt) {
        this.content = content;
        this.updatedAt = updatedAt;
    }
}
