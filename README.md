# 프로젝트 일지
1일 1커밋을 목표로 매일 진행사항 정리

## 2023/03/08 
### 전문가 리뷰 14:20~14:50
멘토 : 조영도
내용
프라이빗 네트워크의 경우 NFT의 가치가 퍼블릭에 비해 상대적으로 떨어지게 된다.(플랫폼에 NFT가 종속되기 때문)
컨테스트(챌린지) 방식으로 구성하게 된다면 투표를 통해서 상위권의 작품에게 NFT를 발행해주는 방식은 어떨지 싶음
비용적인 측면도 있고, 가치를 가지는 토큰이기 때문에 무작위적인 발행은 가치의 희소성을 떨어뜨린다고 생각함
저작권 보호만이 목적이면 우리 플랫폼을 통하지 않아도 됨.(이미 등록만 하면 되는 OpenSea와 같은 서비스가 있기 때문)
NFT의 가치가 부여되는 순간은 누가 NFT를 발행했는지가 핵심. 단순히 저작활동을 통해서 발행된 NFT와 본 플랫폼의 컨테스트를 통해 인증을 받은 NFT의 가치는 다르게 될 것. 또한 NFT가 실질적으로 저작권을 보호해줄 수는 없음.

사전질문1
원래는 NFT가 가리키는 메타데이터를 조작하게 설계되면 안된다. 하지만 실제로 이를 지키고 있는 서비스는 많지 않음. NFT 프로젝트를 참고할 때 주의할 것

사전질문 2
NFT는 저작권이나 지적 재산권과는 관련없음. 현재로서는 디지털 자산에 대한 소유권에 대한 인증서에 불과.

사전질문 3
할 수만 있다면 Sepolia 및 Goerli와 같은 테스트 서버라도 활용해보는 것이 좋다. 프라이빗 네트워크도 좋은 방안. 프라이빗에서 발행한 NFT를 퍼블릭 네트워크로 재배포를 하는 브릿지라는 기술이 있긴 하지만 프로젝트 진행에 있어서 가스비가 걸림돌이 되어서는 안되기 때문에 구현 가능성을 고려해 우선순위를 낮출 필요가 있다. 실제 회사의 경우 이더리움을 구매함

추가질문 1
자체지갑을 제공하고 싶다. 기존에 생각했던 것은 프라이빗 네트워크 상의 지갑을 만드는 것이었는데 퍼블릭 네트워크도 문제가 없는지?
퍼블릭 네트워크로 하는 것도 프라이빗과 큰 차이가 없고, 생성할 때 비용이 들지도 않음. 단 작가가 자기 지갑에 들어간 NFT를 다른 플랫폼에서도 사용할 수 있어야 하기 때문에 거래소 등에서 제공하는 중앙형 지갑과는 다르게 구성해야 할 수도 있다.
작가의 작품에 대한 권리를 좀더 중요시한다면 진입장벽을 고려하더라도 탈중앙형 지갑, 사용성을 좀더 중요시한다면 중앙형 지갑으로의 방향을 생각해볼 법하다.

=> NFT는 그 주 좋아요순 TOP3 동화에 발행

### API 설계
동화 관심목록 조회까지 작성완료
작가 팔로우 기능 작성 
