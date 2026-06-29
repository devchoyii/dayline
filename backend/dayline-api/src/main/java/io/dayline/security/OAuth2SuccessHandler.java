package io.dayline.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import io.dayline.entity.User;
import io.dayline.repository.UserRepository;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String providerId = oAuth2User.getAttribute("sub");
        User user = userRepository.findByProviderUserId(providerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtTokenProvider.createToken(user.getId(), user.getEmail(), user.getName());

        getRedirectStrategy().sendRedirect(request, response, "http://localhost:5173?token=" + token);
    }
}
