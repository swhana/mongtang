package com.ssafy.mongttang.entity;

import com.ssafy.mongttang.dto.AuthProvider;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
@Entity
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user")
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @Column(length = 30)
    @NotNull
    private String userEmail;

    @Column(length = 11)
    @NotNull
    private String userRole;

    @Column(length = 50)
    private String userNickname;

    @Enumerated(EnumType.STRING)
    @Column(length = 6)
    @NotNull
    private AuthProvider userProvider;

    @Column
    @NotNull
    private String userProviderId;

    @Column
    private String userInfo;

    @Column
    private String userProfileImg;

    @Column
    private String userPrivateKey;

    @Builder
    public User(String userEmail, AuthProvider userProvider, String userProviderId ){
        this.userEmail = userEmail;
        this.userNickname = " ";
        this.userRole = "ROLE_READER";
        this.userProvider = userProvider;
        this.userProviderId = userProviderId;
        this.userProfileImg = "defaultImg";
    }

    public void changeNickname(String nickname) {
        this.userNickname = nickname;
    }

    public void changeProfileImg(String userProfileImg) {
        this.userProfileImg = userProfileImg;
    }

    public void changeUserInfo(String userInfo) {
        this.userInfo = userInfo;
    }

    public void changeWallet(String wallet) {
        this.userPrivateKey = wallet;
    }

    public void deleteUser() {
        changeNickname("(알 수 없음)");
        this.userProviderId = "del";
    }
}