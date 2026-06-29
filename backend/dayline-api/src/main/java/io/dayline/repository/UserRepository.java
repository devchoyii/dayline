package io.dayline.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import io.dayline.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    Optional<User> findByProviderUserId(String providerUserId);

    
}
