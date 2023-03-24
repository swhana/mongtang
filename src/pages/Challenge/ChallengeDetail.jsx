import React from 'react';
import tw, { styled, css } from 'twin.macro';

import BookShelf from 'components/common/BookShelf';
import { challengeDetails } from 'api/data';
import { Link } from 'react-router-dom';
import Button from 'components/common/Button';

const BodyContainer = styled.div`
  ${tw`flex flex-col items-center pt-[5%]`}
`;

const BookTitleWrapper = styled.p`
  ${tw`text-3xl pl-[2%] pt-[5%] pb-[2%]`}
`;
const ChallengeInfoContainer = styled.div`
  ${tw`flex flex-col flex-wrap w-2/3`}
`;
const BookContainer = styled.div`
  ${tw`p-48`}
`;
const BestBookContainer = styled.div`
  ${tw``}
`;
const LikedBookContainer = styled.div``;
const RecentBookContainer = styled.div``;

const TitleWrapper = styled.p`
  ${tw`text-5xl m-0 pb-2 pt-[10%]`}
`;
const ContentWrapper = styled.p`
  ${tw`text-2xl m-0`}
`;
const LinkWrapper = styled.div`
  ${tw`flex justify-end text-base m-0`}
`;

function ChallengeDetail({ challenge }) {
  const title = challengeDetails.challenge.challengeTitle;
  const content = challengeDetails.challenge.challengeSummary;
  const id = challengeDetails.challenge.challengeId;

  return (
    <BodyContainer>
      <ChallengeInfoContainer>
        <TitleWrapper>{title}</TitleWrapper>
        <ContentWrapper>{content}</ContentWrapper>
        <LinkWrapper>
          <Link>
            <Button title="동화 만들기 →" buttonType="mint" />
          </Link>
        </LinkWrapper>
      </ChallengeInfoContainer>
      <BookContainer>
        <BestBookContainer>
          <BookTitleWrapper>베스트 동화</BookTitleWrapper>
          <BookShelf
            books={challengeDetails.best}
            width="w-40"
            height="h-48"
            size="b-12"
          />
        </BestBookContainer>
        <LikedBookContainer>
          <BookTitleWrapper>최근 인기 동화</BookTitleWrapper>
          <BookShelf
            books={challengeDetails.liked}
            width="w-40"
            height="h-48"
            size="b-12"
          />
        </LikedBookContainer>
        <RecentBookContainer>
          <BookTitleWrapper>최신 동화</BookTitleWrapper>
          <BookShelf
            books={challengeDetails.recent}
            width="w-40"
            height="h-48"
            size="b-12"
          />
        </RecentBookContainer>
      </BookContainer>
    </BodyContainer>
  );
}

export default ChallengeDetail;