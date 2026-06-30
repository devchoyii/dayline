package io.dayline.service;

import java.time.LocalDateTime;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import io.dayline.entity.User;
import io.dayline.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException{
        OAuth2User oAuth2User = super.loadUser(request);
        // 여기에서 사용자 정보를 처리하여 User 엔티티에 저장하거나 업데이트하는 로직을 구현할 수 있습니다.
        // 예: userRepository.save(...);

        String providerUserId = oAuth2User.getAttribute("sub"); // 구글의 고유 사용자 ID
        String email = oAuth2User.getAttribute("email"); // 구글에서 제공하는 이메일
        String name = oAuth2User.getAttribute("name"); // 구글에서 제공하는 이름

        User user = userRepository.findByProviderUserId(providerUserId)
                .orElseGet(() -> {
                    LocalDateTime now = LocalDateTime.now();
                    User newUser = new User(email, name, "GOOGLE", providerUserId, now, now);
                    return userRepository.save(newUser);
                });

        return oAuth2User;
    }
    
}
