package com.ssafy.mongttang.service;



import com.ssafy.mongttang.dto.AuthProvider;
import com.ssafy.mongttang.dto.UserPrincipalDto;
import com.ssafy.mongttang.dto.user.OAuth2UserInfoDto;
import com.ssafy.mongttang.dto.user.OAuth2UserInfoFactory;
import com.ssafy.mongttang.entity.User;
import com.ssafy.mongttang.exception.OAuth2AuthenticationProcessingException;
import com.ssafy.mongttang.repository.UserRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@Getter
public class CommonOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfoDto oAuth2UserInfo) {
        User user = oAuth2UserInfo.toEntity(oAuth2UserRequest);
        return userRepository.saveAndFlush(user);
    }

    @Transactional
    protected OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        OAuth2UserInfoDto oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());
        if(StringUtils.isEmpty(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }
        Optional<User> userOptional = userRepository.findByUserProviderAndUserProviderId(AuthProvider.valueOf(oAuth2UserInfo.getProvider()), oAuth2UserInfo.getProviderId());

        User user = null;
        if(userOptional.isPresent()) {
            user = userOptional.get();
        }
        else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }
        return new UserPrincipalDto(user, oAuth2User.getAttributes());
    }
}
