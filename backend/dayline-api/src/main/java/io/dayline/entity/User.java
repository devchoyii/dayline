package io.dayline.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String providerId; // GOOGLE

    @Column(nullable = false, unique = true)
    private String providerUserId; // 구글에서 제공하는 고유 사용자 ID

    @Column(name = "created_at", nullable = false)
    private String createdAt; // ISO 8601 형식의 날짜와 시간 (예: 2024-06-01T12:00:00Z)

    @Column(name = "last_login_at", nullable = false)
    private String lastLoginAt; // ISO 8601 형식의 날짜와 시간 (예: 2024-06-01T12:00:00Z)

    public User(String email, String name, String providerId, String providerUserId, String createdAt, String lastLoginAt) {
        this.email = email;
        this.name = name;
        this.providerId = providerId;
        this.providerUserId = providerUserId;
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
    }
    
}
