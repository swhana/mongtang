import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import tw, { styled, css } from 'twin.macro';

import requests from 'api/config';
import { defaultApi, authApi } from 'api/axios';

import ProfileImg2 from 'components/common/ProfileImg2';
import Button from 'components/common/Button';
import moveToEdit from 'assets/icons/moveToEdit.svg';
import UserIcon from 'assets/images/UserIcon.svg';
import WithdrawalModal from 'pages/Withdrawal/WithdrawalModal';

const ProfileContainer = styled.div`
  ${tw`flex flex-col items-center justify-center w-full z-10`}
`;
const ButtonContainer = styled.div`
  ${tw`flex my-2 justify-center`}
`;
const InfoContainer = styled.div`
  ${tw`flex justify-between items-center mt-2 mx-[200px] border-b-2`}
`;
const InfoWrapper = styled.div`
  ${tw`flex flex-col`}
`;
const InfoTitle = styled.span`
  ${tw`justify-start text-[30px]`}
`;
const InfoContent = styled.span`
  ${tw`justify-start text-[35px]`}
`;
const ProfileImgContainer = styled.div`
  ${tw`flex justify-center items-center pt-[80px]`}
`;
const ImgWrapper = styled.div`
  ${tw`relative`}
`;
const ImgAddBtn = styled.div`
  ${tw`w-5 h-5 absolute right-0 bottom-0 fill-black drop-shadow-lg cursor-pointer`}
`;

function MyProfileEdit() {
  //프로필 조회 API 추가
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem('userId'));
  const [userNickname, setUserNickname] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userImage, setUserImage] = useState();
  const [newImage, setNewImage] = useState();

  useEffect(() => {
    const get_user = async () => {
      try {
        const { data } = await authApi.get(requests.GET_PROFILE(userId));
        setUserNickname(data.profile.userNickname);
        setUserInfo(data.profile.userInfo);
        setUserImage(data.profile.profileImgURL);
        return console.log(data);
      } catch (error) {
        throw error;
      }
    };

    get_user();
  }, []);

  const onClose = () => {
    setIsModalOpen(false);
  };

  const handleClickAddImage = () => {
    document.getElementById('imageInput').click();
  };
  const handleUserImage = (event) => {
    const file = event.target.files[0];
    setNewImage(file);
  };
  const changeToDefaultImg = () => {
    console.log('12');
    setNewImage(URL.createObjectURL(UserIcon));
  };
  const submitHandler = () => {
    console.log('asdad');
    const formData = new FormData();
    if (newImage === 0) {
      formData.append('userImg', userImage);
    } else {
      formData.append('userImg', newImage);
    }
    const patch_profile_image = async () => {
      try {
        const response = await authApi.patch(
          requests.PATCH_PROFILE_IMAGE(userId),
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        // console.log(response);
        return response;
      } catch (error) {
        throw error;
      }
    };
    patch_profile_image();

    navigate('/myprofile');
  };
  return (
    <div>
      {isModalOpen ? <WithdrawalModal onClose={onClose} /> : null}
      <ProfileImgContainer>
        <ImgWrapper>
          {newImage ? (
            <ProfileImg2 userImg={URL.createObjectURL(newImage)} />
          ) : (
            <ProfileImg2 userImg={userImage} />
          )}
          <ImgAddBtn onClick={handleClickAddImage}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
            </svg>
          </ImgAddBtn>
        </ImgWrapper>
      </ProfileImgContainer>
      <input
        id="imageInput"
        type="file"
        accept="img/*"
        onChange={handleUserImage}
        className="display: hidden"
        multiple={false}
      />
      <ProfileContainer>
        <ButtonContainer>
          <div className="mx-2" onClick={changeToDefaultImg}>
            <Button title="기본사진" buttonType="black" className="" />
          </div>
          <div className="mx-2" onClick={submitHandler}>
            <Button title="저장" buttonType="black" className="" />
          </div>
        </ButtonContainer>
      </ProfileContainer>
      <input
        id="imageInput"
        type="file"
        accept="img/*"
        onChange={handleUserImage}
        className="display: hidden"
        multiple={false}
      />
      <InfoContainer>
        <InfoWrapper>
          <InfoTitle>닉네임</InfoTitle>
          <InfoContent>{userNickname}</InfoContent>
        </InfoWrapper>
        <div onClick={() => navigate('/myprofile/edit/nickname')}>
          <img src={moveToEdit} alt="edit button" className="cursor-pointer" />
        </div>
      </InfoContainer>
      {/* <InfoContainer>
        <InfoWrapper>
          <InfoTitle>이메일</InfoTitle>
          <InfoContent>wkas1921@naver.com</InfoContent>
        </InfoWrapper>
      </InfoContainer> */}
      <InfoContainer>
        <InfoWrapper>
          <InfoTitle>자기소개</InfoTitle>
          {userInfo ? (
            <InfoContent>{userInfo}</InfoContent>
          ) : (
            <InfoContent>자기소개를 작성해주세요</InfoContent>
          )}
        </InfoWrapper>
        <div onClick={() => navigate('/myprofile/edit/introduction')}>
          <img src={moveToEdit} alt="edit button" className="cursor-pointer" />
        </div>
      </InfoContainer>
      <InfoContainer>
        <InfoTitle>회원탈퇴</InfoTitle>
        <div onClick={() => setIsModalOpen(true)}>
          <img src={moveToEdit} alt="edit button" className="cursor-pointer" />
        </div>
      </InfoContainer>
    </div>
  );
}

export default MyProfileEdit;