package com.ssafy.mongttang.handler.oauth2;


import com.ssafy.mongttang.config.AppProperties;
import com.ssafy.mongttang.dto.UserPrincipalDto;
import com.ssafy.mongttang.exception.BadRequestException;
import com.ssafy.mongttang.repository.HttpCookieOAuth2AuthorizationRequestRepository;
import com.ssafy.mongttang.service.TokenProviderService;
import com.ssafy.mongttang.util.CookieUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLEncoder;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static com.ssafy.mongttang.repository.HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME;


@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final TokenProviderService tokenProvider;
    private final AppProperties appProperties;
    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;
    private final RedisTemplate redisTemplate;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {


        String targetUrl = determineTargetUrl(request, response, authentication);
        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication ) {
        Optional<String> redirectUri = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);

        if(redirectUri.isPresent() && !isAuthorizedRedirectUri(redirectUri.get())) {
            throw new BadRequestException("Sorry! We've got an Unauthorized Redirect URI and can't proceed with the authentication");
        }

        String targetUrl = redirectUri.orElse(getDefaultTargetUrl());
        String token = tokenProvider.createAccessToken(authentication);

        UserPrincipalDto userPrincipalDto = (UserPrincipalDto) authentication.getPrincipal();

        String newRefreshToken = tokenProvider.createRefreshToken();

        redisTemplate.opsForValue()
                .set("RT:" + userPrincipalDto.getUser().getUserId(), newRefreshToken, appProperties.getAuth().getRefreshTokenExpiry(), TimeUnit.MILLISECONDS);
//        // DB 저장
//        RefreshToken oldRefreshToken = refreshTokenRepository.findByUser_UserId(userPrincipalDto.getUser().getUserId());
//        if (oldRefreshToken != null) {
//            oldRefreshToken.setRefreshToken(newRefreshToken);
//        } else {
//            oldRefreshToken = new RefreshToken(userPrincipalDto.getUser(), newRefreshToken);
//        }
//        refreshTokenRepository.saveAndFlush(oldRefreshToken);
        CookieUtils.addCookie(response, "refreshToken", newRefreshToken,180);

        try {
            String nickName = userPrincipalDto.getUser().getUserNickname();
            if(nickName == null){
                return UriComponentsBuilder.fromUriString(targetUrl)
                        .queryParam("userId", userPrincipalDto.getUser().getUserId())
                        .queryParam("nickName", nickName)
                        .queryParam("accessToken", token)
                        .build().toUriString();
            } else {
                return UriComponentsBuilder.fromUriString(targetUrl)
                        .queryParam("userId", userPrincipalDto.getUser().getUserId())
                        .queryParam("nickName", URLEncoder.encode(nickName, "UTF-8"))
                        .queryParam("accessToken", token)
                        .build().toUriString();
            }

        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    }

    private boolean isAuthorizedRedirectUri(String uri) {
        URI clientRedirectUri = URI.create(uri);

        return appProperties.getOauth2().getAuthorizedRedirectUris()
                .stream()
                .anyMatch(authorizedRedirectUri -> {
                    // Only validate host and port. Let the clients use different paths if they want to
                    URI authorizedURI = URI.create(authorizedRedirectUri);
                    if(authorizedURI.getHost().equalsIgnoreCase(clientRedirectUri.getHost())
                            && authorizedURI.getPort() == clientRedirectUri.getPort()) {
                        return true;
                    }
                    return false;
                });
    }
}
