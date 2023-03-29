import React, { useEffect, useState } from 'react';
import tw, { styled, css } from 'twin.macro';

import { books } from 'api/data';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from 'components/common/Button';
import Coin from '../../assets/icons/Coin.svg';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from 'api/axios';
import requests from 'api/config';
import CommentForm from 'components/common/CommentForm';
import { userStore } from 'store/userStore';

const queryClient = new QueryClient();
const book = books[0]; //책 1개 더미데이터

const BodyContainer = styled.div`
  ${tw`flex flex-col items-center pt-[5%]`}
`;

const BookInfoContainer = styled.div`
  ${tw`flex w-2/3 space-x-16`}
`;
const BookImgWrapper = styled.div`
  ${tw`w-80 h-96 rounded-lg shadow-lg`}
  ${(props) =>
    css`
      background-image: url(${props.imgSrc});
      background-size: cover;
    `}
`;
const MainInfoContainer = styled.div`
  ${tw`flex w-2/3 flex-col m-0 p-[2%]`}
`;
const TitleContainer = styled.div`
  ${tw`flex justify-between text-3xl pb-[2%]`}
`;
const TitleWrapper = styled.div``;
const ArtistWrapper = styled.div`
  ${tw`flex items-end text-xl`}
`;
const ArtistImgWrapper = styled.div``;

const ContentWrapper = styled.div`
  ${tw`pb-[2%]`}
  ${css`
    // white-space: pre-line; //줄바꿈 옵션(들여쓰기 x)
  `}
`;
const SubInfoContainer = styled.div`
  ${tw`flex justify-end space-x-2 pt-2`}
`;
const PriceWrapper = styled.div`
  ${tw`flex justify-end`}
`;
const LikeBtnWrapper = styled.div`
  ${tw`w-fit h-[24px] p-1 text-sub-bold bg-btnBlack text-white rounded-full flex justify-center items-center shadow cursor-pointer`}
`;

const ServiceContainer = styled.div`
  ${tw`flex justify-end space-x-2 pt-2`}
`;

const LinkWrapper = styled.div`
  ${tw`flex justify-end text-base m-0`}
`;

const PriceImgWrapper = styled.div`
  ${tw`m-0 pr-1`}
`;
const LikesWrapper = styled.div``;
const CommentContainer = styled.div``;

function BookDetail({ userId }) {
  const params = useParams(); //{ bookId: 27 }
  const bookId = params.bookId;
  const navigate = useNavigate();
  const [book, setBook] = useState();

  useEffect(() => {
    authApi(requests.GET_BOOK_DETAIL(userId, bookId)).then((res) => {
      setBook(res.data.bookDetail);
      console.log(res.data.bookDetail);
    });
  }, []);

  const [isLiked, setIsLiked] = useState(false);
  const title = book.bookTitle;
  const artistId = book.artistId;
  const artistNickname = book.artistNickname;
  const bookContent = book.bookSummary;
  const bookImgUrl = book.bookImgUrl;
  const bookPrice = '무료';
  // const bookLikes = book.numOfLike;

  const likeBook = () => {
    setIsLiked(true);
    //관심목록 추가 API 호출
    authApi.post(requests.POST_BOOKLIKE(userId, bookId)).then((res) => {
      if (res.data.message === 'success') {
        authApi(requests.GET_BOOK_DETAIL(userId, bookId)).then((res) => {
          setBook(res.data.bookDetail);
          console.log(res.data.bookDetail);
        });
      }
    });
  };

  const dislikeBook = () => {
    setIsLiked(false);
    //관심목록 제거 API 호출
    authApi.delete(requests.DELETE_BOOKLIKE(userId, bookId)).then((res) => {
      if (res.data.message === 'success') {
        authApi(requests.GET_BOOK_DETAIL(userId, bookId)).then((res) => {
          setBook(res.data.bookDetail);
          console.log(res.data.bookDetail);
        });
      }
    });
  };

  const gotoViewer = async () => {
    try {
      // console.log('userID: ', userId, 'bookId; ', bookId);
      await authApi(requests.GET_BOOK_AUTH(userId, bookId)).then((res) => {});
    } catch (error) {}
  };
  return (
    <BodyContainer>
      <BookInfoContainer>
        <BookImgWrapper imgSrc={bookImgUrl} />
        <MainInfoContainer>
          <TitleContainer>
            <TitleWrapper>{title}</TitleWrapper>
            <ArtistWrapper>
              <ArtistImgWrapper />
              {artistNickname}
            </ArtistWrapper>
          </TitleContainer>
          <ContentWrapper>{bookContent}</ContentWrapper>
          <SubInfoContainer>
            <LikeBtnWrapper>
              {!isLiked ? (
                <button onClick={likeBook}>관심목록 추가</button>
              ) : (
                <button onClick={dislikeBook}>관심 취소</button>
              )}
            </LikeBtnWrapper>
            <LikesWrapper>{}</LikesWrapper>
          </SubInfoContainer>
          <ServiceContainer>
            <PriceWrapper>
              <PriceImgWrapper>
                <img src={Coin} alt="coin" />
              </PriceImgWrapper>
              {bookPrice}
            </PriceWrapper>
            <LinkWrapper>
              <Button
                title="동화 보러가기 →"
                buttonType="mint"
                onClick={gotoViewer}
              />
            </LinkWrapper>
          </ServiceContainer>
        </MainInfoContainer>
      </BookInfoContainer>

      <CommentContainer>
        <CommentForm />
      </CommentContainer>
    </BodyContainer>
  );
}

export default BookDetail;