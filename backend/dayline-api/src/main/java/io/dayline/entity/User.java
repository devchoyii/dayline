package io.dayline.entity;

import java.time.LocalDateTime;

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
    private String provider; // GOOGLE

    @Column(nullable = false, unique = true)
    private String providerUserId; // 구글에서 제공하는 고유 사용자 ID

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_login_at", nullable = false)
    private LocalDateTime lastLoginAt;

    public User(String email, String name, String provider, String providerUserId, LocalDateTime createdAt, LocalDateTime lastLoginAt) {
        this.email = email;
        this.name = name;
        this.provider = provider;
        this.providerUserId = providerUserId;
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
    }
    
}
