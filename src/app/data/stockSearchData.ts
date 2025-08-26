import { MarketType } from '@/types/stock';

export interface SearchItem {
  symbol: string;
  name: string;
  marketType: MarketType;
  keywords: string[];
}

// 한국 주식 데이터
export const KR_STOCKS: SearchItem[] = [
  // 대기업 - 삼성그룹
  { symbol: '005930', name: '삼성전자', marketType: 'kr', keywords: ['삼성전자', '삼성', 'samsung', 'electronics'] },
  { symbol: '207940', name: '삼성바이오로직스', marketType: 'kr', keywords: ['삼성바이오로직스', '삼성바이오', '바이오로직스'] },
  { symbol: '006400', name: '삼성SDI', marketType: 'kr', keywords: ['삼성SDI', 'SDI', '삼성에스디아이'] },
  { symbol: '028260', name: '삼성물산', marketType: 'kr', keywords: ['삼성물산', '물산'] },
  { symbol: '032830', name: '삼성생명', marketType: 'kr', keywords: ['삼성생명', '삼성', '생명보험'] },
  { symbol: '018260', name: '삼성에스디에스', marketType: 'kr', keywords: ['삼성에스디에스', '삼성SDS', 'SDS'] },
  { symbol: '009150', name: '삼성전기', marketType: 'kr', keywords: ['삼성전기', '전기', '부품'] },
  { symbol: '016360', name: '삼성증권', marketType: 'kr', keywords: ['삼성증권', '증권'] },
  { symbol: '000830', name: '삼성화재', marketType: 'kr', keywords: ['삼성화재', '화재보험', '보험'] },
  { symbol: '001450', name: '현대해상', marketType: 'kr', keywords: ['현대해상', '해상보험', '보험'] },

  // SK그룹
  { symbol: '000660', name: 'SK하이닉스', marketType: 'kr', keywords: ['SK하이닉스', 'SK', '하이닉스', 'hynix'] },
  { symbol: '096770', name: 'SK이노베이션', marketType: 'kr', keywords: ['SK이노베이션', 'SK', '이노베이션'] },
  { symbol: '017670', name: 'SK텔레콤', marketType: 'kr', keywords: ['SK텔레콤', 'SKT', '에스케이텔레콤'] },
  { symbol: '326030', name: 'SK바이오팜', marketType: 'kr', keywords: ['SK바이오팜', 'SK', '바이오팜'] },
  { symbol: '034730', name: 'SK', marketType: 'kr', keywords: ['SK', '에스케이', 'SK주식회사'] },

  // 현대그룹
  { symbol: '005380', name: '현대차', marketType: 'kr', keywords: ['현대차', '현대자동차', 'hyundai'] },
  { symbol: '012330', name: '현대모비스', marketType: 'kr', keywords: ['현대모비스', '모비스'] },
  { symbol: '267250', name: '현대중공업', marketType: 'kr', keywords: ['현대중공업', '중공업', '조선'] },
  { symbol: '009540', name: '현대중공업지주', marketType: 'kr', keywords: ['현대중공업지주', '중공업지주'] },
  { symbol: '000720', name: '현대건설', marketType: 'kr', keywords: ['현대건설', '건설'] },
  { symbol: '011170', name: '롯데케미칼', marketType: 'kr', keywords: ['롯데케미칼', '롯데', '케미칼', '화학'] },

  // LG그룹
  { symbol: '003550', name: 'LG', marketType: 'kr', keywords: ['LG', '엘지'] },
  { symbol: '066570', name: 'LG전자', marketType: 'kr', keywords: ['LG전자', 'LG', '엘지전자'] },
  { symbol: '051910', name: 'LG화학', marketType: 'kr', keywords: ['LG화학', 'LG', '화학'] },
  { symbol: '373220', name: 'LG에너지솔루션', marketType: 'kr', keywords: ['LG에너지솔루션', 'LG', '배터리', '에너지'] },
  { symbol: '051900', name: 'LG생활건강', marketType: 'kr', keywords: ['LG생활건강', 'LG', '생활건강', '화장품'] },
  { symbol: '032640', name: 'LG유플러스', marketType: 'kr', keywords: ['LG유플러스', 'LG', '유플러스', '통신'] },

  // IT/게임
  { symbol: '035420', name: 'NAVER', marketType: 'kr', keywords: ['네이버', 'NAVER', '네이버corp'] },
  { symbol: '035720', name: '카카오', marketType: 'kr', keywords: ['카카오', 'kakao', '다음카카오'] },
  { symbol: '036570', name: '엔씨소프트', marketType: 'kr', keywords: ['엔씨소프트', 'NC', 'NCSOFT'] },
  { symbol: '251270', name: '넷마블', marketType: 'kr', keywords: ['넷마블', 'netmarble'] },
  { symbol: '112040', name: '위메이드', marketType: 'kr', keywords: ['위메이드', 'wemade', '게임'] },
  { symbol: '263750', name: '펄어비스', marketType: 'kr', keywords: ['펄어비스', '검은사막', '게임'] },
  { symbol: '078340', name: '컴투스', marketType: 'kr', keywords: ['컴투스', '게임'] },
  { symbol: '192080', name: '더블유게임즈', marketType: 'kr', keywords: ['더블유게임즈', 'W게임즈', '게임'] },
  { symbol: '259960', name: '크래프톤', marketType: 'kr', keywords: ['크래프톤', '배틀그라운드', 'PUBG', '게임'] },

  // 통신
  { symbol: '030200', name: 'KT', marketType: 'kr', keywords: ['KT', '케이티', '한국통신'] },
  { symbol: '030000', name: 'KT&G', marketType: 'kr', keywords: ['KT&G', '케이티앤지', '담배'] },

  // 금융
  { symbol: '105560', name: 'KB금융', marketType: 'kr', keywords: ['KB금융', 'KB', '국민은행'] },
  { symbol: '055550', name: '신한지주', marketType: 'kr', keywords: ['신한지주', '신한', '신한은행'] },
  { symbol: '086790', name: '하나금융지주', marketType: 'kr', keywords: ['하나금융지주', '하나', '하나은행'] },
  { symbol: '316140', name: '우리금융지주', marketType: 'kr', keywords: ['우리금융지주', '우리', '우리은행'] },
  { symbol: '024110', name: '기업은행', marketType: 'kr', keywords: ['기업은행', 'IBK', '중소기업은행'] },
  { symbol: '138930', name: 'BNK금융지주', marketType: 'kr', keywords: ['BNK금융지주', 'BNK', '부산은행'] },
  { symbol: '175330', name: 'JB금융지주', marketType: 'kr', keywords: ['JB금융지주', 'JB', '전북은행'] },

  // 바이오/제약/헬스케어
  { symbol: '068270', name: '셀트리온', marketType: 'kr', keywords: ['셀트리온', 'celltrion'] },
  { symbol: '091990', name: '셀트리온헬스케어', marketType: 'kr', keywords: ['셀트리온헬스케어', '셀트리온', '헬스케어'] },
  { symbol: '302440', name: '셀트리온제약', marketType: 'kr', keywords: ['셀트리온제약', '셀트리온', '제약'] },
  { symbol: '128940', name: '한미약품', marketType: 'kr', keywords: ['한미약품', '한미', '약품'] },
  { symbol: '000100', name: '유한양행', marketType: 'kr', keywords: ['유한양행', '유한', '양행', '제약'] },
  { symbol: '185750', name: '종근당', marketType: 'kr', keywords: ['종근당', '제약'] },
  { symbol: '009420', name: '한올바이오파마', marketType: 'kr', keywords: ['한올바이오파마', '한올', '바이오파마'] },
  { symbol: '196170', name: '알테오젠', marketType: 'kr', keywords: ['알테오젠', '바이오', '신약'] },
  { symbol: '214450', name: '파마리서치', marketType: 'kr', keywords: ['파마리서치', '제약', '바이오'] },

  // 자동차/부품
  { symbol: '000270', name: '기아', marketType: 'kr', keywords: ['기아', 'KIA', '기아자동차'] },
  { symbol: '161390', name: '한국타이어앤테크놀로지', marketType: 'kr', keywords: ['한국타이어', '타이어', '한국타이어앤테크놀로지'] },
  { symbol: '298020', name: '효성티앤씨', marketType: 'kr', keywords: ['효성티앤씨', '효성', '타이어코드'] },

  // 조선/중공업
  { symbol: '009540', name: '현대중공업지주', marketType: 'kr', keywords: ['현대중공업지주', '중공업지주'] },
  { symbol: '042660', name: '한화오션', marketType: 'kr', keywords: ['한화오션', '한화', '조선'] },
  { symbol: '010140', name: '삼성중공업', marketType: 'kr', keywords: ['삼성중공업', '삼성', '조선'] },
  { symbol: '034020', name: '두산에너빌리티', marketType: 'kr', keywords: ['두산에너빌리티', '두산', '에너빌리티'] },
  { symbol: '241560', name: '두산밥캣', marketType: 'kr', keywords: ['두산밥캣', '두산', '밥캣', '건설기계'] },

  // 에너지/화학
  { symbol: '001570', name: '금양', marketType: 'kr', keywords: ['금양', '석유화학'] },
  { symbol: '010950', name: 'S-Oil', marketType: 'kr', keywords: ['S-Oil', '에스오일', '석유'] },
  { symbol: '267260', name: '현대일렉트릭', marketType: 'kr', keywords: ['현대일렉트릭', '현대', '전기'] },
  { symbol: '009830', name: '한화솔루션', marketType: 'kr', keywords: ['한화솔루션', '한화', '화학'] },

  // 항공/물류
  { symbol: '003490', name: '대한항공', marketType: 'kr', keywords: ['대한항공', '항공', 'KAL'] },
  { symbol: '020560', name: '아시아나항공', marketType: 'kr', keywords: ['아시아나항공', '아시아나', '항공'] },
  { symbol: '180640', name: '한진칼', marketType: 'kr', keywords: ['한진칼', '한진', '물류'] },
  { symbol: '047050', name: 'POSCO홀딩스', marketType: 'kr', keywords: ['POSCO홀딩스', '포스코', '철강'] },
  { symbol: '005490', name: 'POSCO DX', marketType: 'kr', keywords: ['POSCO DX', '포스코DX', '포스코'] },

  // 유통/서비스/외식
  { symbol: '004170', name: '신세계', marketType: 'kr', keywords: ['신세계', '백화점'] },
  { symbol: '023530', name: '롯데쇼핑', marketType: 'kr', keywords: ['롯데쇼핑', '롯데', 'lotte', '백화점'] },
  { symbol: '004990', name: '롯데지주', marketType: 'kr', keywords: ['롯데지주', '롯데', 'lotte', '지주회사'] },
  { symbol: '282330', name: 'BGF리테일', marketType: 'kr', keywords: ['BGF리테일', 'BGF', '편의점'] },
  { symbol: '007070', name: 'GS리테일', marketType: 'kr', keywords: ['GS리테일', 'GS', '편의점'] },
  { symbol: '078930', name: 'GS', marketType: 'kr', keywords: ['GS', '지에스'] },
  { symbol: '192820', name: '코스맥스', marketType: 'kr', keywords: ['코스맥스', '화장품', 'ODM'] },
  { symbol: '214320', name: '이노션', marketType: 'kr', keywords: ['이노션', '광고', '마케팅'] },

  // 식품/생필품
  { symbol: '280360', name: '롯데웰푸드', marketType: 'kr', keywords: ['롯데웰푸드', '롯데', '웰푸드', '과자', '식품'] },
  { symbol: '097950', name: 'CJ제일제당', marketType: 'kr', keywords: ['CJ제일제당', 'CJ', '제일제당', '식품'] },
  { symbol: '001040', name: 'CJ', marketType: 'kr', keywords: ['CJ', '씨제이'] },
  { symbol: '271560', name: 'LG헬로비전', marketType: 'kr', keywords: ['LG헬로비전', 'LG', '헬로비전', '케이블'] },
  { symbol: '112610', name: '씨에스윈드', marketType: 'kr', keywords: ['씨에스윈드', '풍력', '신재생에너지'] },
  { symbol: '000120', name: 'CJ대한통운', marketType: 'kr', keywords: ['CJ대한통운', 'CJ', '대한통운', '택배', '물류'] },
  { symbol: '003230', name: '삼양식품', marketType: 'kr', keywords: ['삼양식품', '삼양', '라면', '식품'] },
  { symbol: '271940', name: 'KG이니시스', marketType: 'kr', keywords: ['KG이니시스', 'KG', '이니시스', 'PG'] },

  // 반도체/IT부품
  { symbol: '000990', name: 'DB하이텍', marketType: 'kr', keywords: ['DB하이텍', 'DB', '하이텍', '반도체'] },
  { symbol: '042700', name: '한미반도체', marketType: 'kr', keywords: ['한미반도체', '한미', '반도체'] },
  { symbol: '108320', name: '알테시아', marketType: 'kr', keywords: ['알테시아', '알테오젠', 'CDMO'] },

  // 건설/부동산
  { symbol: '000720', name: '현대건설', marketType: 'kr', keywords: ['현대건설', '건설'] },
  { symbol: '009150', name: '삼성전기', marketType: 'kr', keywords: ['삼성전기', '전기', '부품'] },

  // 화학/소재
  { symbol: '004000', name: '롯데정밀화학', marketType: 'kr', keywords: ['롯데정밀화학', '롯데', '화학'] },
  { symbol: '003220', name: '대원제약', marketType: 'kr', keywords: ['대원제약', '대원', '제약'] },

  // 신재생에너지
  { symbol: '267290', name: '경동도시가스', marketType: 'kr', keywords: ['경동도시가스', '경동', '도시가스'] },
  { symbol: '322000', name: 'HD현대미포', marketType: 'kr', keywords: ['HD현대미포', '현대미포', '조선'] },

  // 엔터테인먼트
  { symbol: '041510', name: '에스엠', marketType: 'kr', keywords: ['에스엠', 'SM', 'SM엔터테인먼트'] },
  { symbol: '352820', name: '하이브', marketType: 'kr', keywords: ['하이브', 'HYBE', 'BTS', '빅히트'] },
  { symbol: '122870', name: 'YG엔터테인먼트', marketType: 'kr', keywords: ['YG엔터테인먼트', 'YG', '와이지'] },
  { symbol: '035900', name: 'JYP엔터', marketType: 'kr', keywords: ['JYP엔터', 'JYP', '박진영'] },

  // 기타 인기 종목들
  { symbol: '377300', name: '카카오페이', marketType: 'kr', keywords: ['카카오페이', '카카오', '페이', '핀테크'] },
  { symbol: '323410', name: '카카오뱅크', marketType: 'kr', keywords: ['카카오뱅크', '카카오', '은행', '뱅크'] },
  { symbol: '373220', name: 'LG에너지솔루션', marketType: 'kr', keywords: ['LG에너지솔루션', 'LG', '배터리', '에너지'] },
  { symbol: '247540', name: '에코프로비엠', marketType: 'kr', keywords: ['에코프로비엠', '에코프로', '배터리'] },
  { symbol: '086520', name: '에코프로', marketType: 'kr', keywords: ['에코프로', '배터리', '소재'] },
  { symbol: '066970', name: '엘앤에프', marketType: 'kr', keywords: ['엘앤에프', 'L&F', '배터리'] },
  { symbol: '005070', name: '코스모신소재', marketType: 'kr', keywords: ['코스모신소재', '코스모', '신소재'] },
  { symbol: '005940', name: 'NH투자증권', marketType: 'kr', keywords: ['NH투자증권', 'NH', '농협투자증권'] },
  { symbol: '018880', name: '한라비스테온공조', marketType: 'kr', keywords: ['한라비스테온공조', '한라', '자동차부품'] },
];

// 미국 주식 데이터
export const US_STOCKS: SearchItem[] = [
  // 빅테크 (FAANG+)
  { symbol: 'AAPL', name: 'Apple Inc.', marketType: 'us', keywords: ['애플', 'apple', '아이폰', 'iphone', '맥북'] },
  { symbol: 'MSFT', name: 'Microsoft Corporation', marketType: 'us', keywords: ['마이크로소프트', 'microsoft', '윈도우', 'MS'] },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', marketType: 'us', keywords: ['구글', 'google', 'alphabet', '알파벳'] },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', marketType: 'us', keywords: ['아마존', 'amazon', 'AWS'] },
  { symbol: 'META', name: 'Meta Platforms Inc.', marketType: 'us', keywords: ['메타', 'meta', '페이스북', 'facebook', '인스타그램'] },
  { symbol: 'NFLX', name: 'Netflix Inc.', marketType: 'us', keywords: ['넷플릭스', 'netflix'] },
  { symbol: 'TSLA', name: 'Tesla Inc.', marketType: 'us', keywords: ['테슬라', 'tesla', '일론머스크', '전기차'] },
  
  // AI/반도체
  { symbol: 'NVDA', name: 'NVIDIA Corporation', marketType: 'us', keywords: ['엔비디아', 'nvidia', 'AI', '인공지능', 'GPU'] },
  { symbol: 'AMD', name: 'Advanced Micro Devices', marketType: 'us', keywords: ['AMD', '에이엠디'] },
  { symbol: 'INTC', name: 'Intel Corporation', marketType: 'us', keywords: ['인텔', 'intel'] },
  { symbol: 'QCOM', name: 'QUALCOMM Incorporated', marketType: 'us', keywords: ['퀄컴', 'qualcomm'] },
  { symbol: 'AVGO', name: 'Broadcom Inc.', marketType: 'us', keywords: ['브로드컴', 'broadcom'] },
  { symbol: 'MU', name: 'Micron Technology', marketType: 'us', keywords: ['마이크론', 'micron'] },
  { symbol: 'TSM', name: 'Taiwan Semiconductor', marketType: 'us', keywords: ['TSMC', '대만반도체', 'taiwan semiconductor'] },
  
  // 클라우드/소프트웨어
  { symbol: 'CRM', name: 'Salesforce Inc.', marketType: 'us', keywords: ['세일즈포스', 'salesforce'] },
  { symbol: 'ORCL', name: 'Oracle Corporation', marketType: 'us', keywords: ['오라클', 'oracle'] },
  { symbol: 'ADBE', name: 'Adobe Inc.', marketType: 'us', keywords: ['어도비', 'adobe', '포토샵'] },
  { symbol: 'NOW', name: 'ServiceNow Inc.', marketType: 'us', keywords: ['서비스나우', 'servicenow'] },
  { symbol: 'SNOW', name: 'Snowflake Inc.', marketType: 'us', keywords: ['스노우플레이크', 'snowflake'] },
  { symbol: 'PLTR', name: 'Palantir Technologies', marketType: 'us', keywords: ['팔란티어', 'palantir'] },
  { symbol: 'CRWD', name: 'CrowdStrike Holdings', marketType: 'us', keywords: ['크라우드스트라이크', 'crowdstrike'] },
  { symbol: 'OKTA', name: 'Okta Inc.', marketType: 'us', keywords: ['옥타', 'okta'] },
  
  // 전기차/배터리
  { symbol: 'RIVN', name: 'Rivian Automotive', marketType: 'us', keywords: ['리비안', 'rivian'] },
  { symbol: 'LCID', name: 'Lucid Group Inc.', marketType: 'us', keywords: ['루시드', 'lucid'] },
  { symbol: 'F', name: 'Ford Motor Company', marketType: 'us', keywords: ['포드', 'ford'] },
  { symbol: 'GM', name: 'General Motors Company', marketType: 'us', keywords: ['제너럴모터스', 'GM', '지엠'] },
  
  // 금융
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', marketType: 'us', keywords: ['JP모건', 'jpmorgan', '제이피모건'] },
  { symbol: 'BAC', name: 'Bank of America Corporation', marketType: 'us', keywords: ['뱅크오브아메리카', 'bank of america'] },
  { symbol: 'WFC', name: 'Wells Fargo & Company', marketType: 'us', keywords: ['웰스파고', 'wells fargo'] },
  { symbol: 'GS', name: 'Goldman Sachs Group Inc.', marketType: 'us', keywords: ['골드만삭스', 'goldman sachs'] },
  { symbol: 'MS', name: 'Morgan Stanley', marketType: 'us', keywords: ['모건스탠리', 'morgan stanley'] },
  { symbol: 'C', name: 'Citigroup Inc.', marketType: 'us', keywords: ['씨티그룹', 'citigroup', '시티은행'] },
  { symbol: 'V', name: 'Visa Inc.', marketType: 'us', keywords: ['비자', 'visa'] },
  { symbol: 'MA', name: 'Mastercard Incorporated', marketType: 'us', keywords: ['마스터카드', 'mastercard'] },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.', marketType: 'us', keywords: ['페이팔', 'paypal'] },
  { symbol: 'SQ', name: 'Block Inc.', marketType: 'us', keywords: ['블록', 'block', '스퀘어', 'square'] },
  { symbol: 'COIN', name: 'Coinbase Global Inc.', marketType: 'us', keywords: ['코인베이스', 'coinbase'] },
  
  // 소비재/브랜드
  { symbol: 'KO', name: 'The Coca-Cola Company', marketType: 'us', keywords: ['코카콜라', 'coca cola'] },
  { symbol: 'PEP', name: 'PepsiCo Inc.', marketType: 'us', keywords: ['펩시', 'pepsi'] },
  { symbol: 'NKE', name: 'Nike Inc.', marketType: 'us', keywords: ['나이키', 'nike'] },
  { symbol: 'SBUX', name: 'Starbucks Corporation', marketType: 'us', keywords: ['스타벅스', 'starbucks'] },
  { symbol: 'MCD', name: 'McDonald\'s Corporation', marketType: 'us', keywords: ['맥도날드', 'mcdonalds'] },
  { symbol: 'HD', name: 'Home Depot Inc.', marketType: 'us', keywords: ['홈디포', 'home depot'] },
  { symbol: 'WMT', name: 'Walmart Inc.', marketType: 'us', keywords: ['월마트', 'walmart'] },
  { symbol: 'COST', name: 'Costco Wholesale Corporation', marketType: 'us', keywords: ['코스트코', 'costco'] },
  { symbol: 'TGT', name: 'Target Corporation', marketType: 'us', keywords: ['타겟', 'target'] },
  { symbol: 'PG', name: 'Procter & Gamble Company', marketType: 'us', keywords: ['P&G', '프록터앤갬블'] },
  { symbol: 'UL', name: 'Unilever PLC', marketType: 'us', keywords: ['유니레버', 'unilever'] },
  
  // 미디어/엔터테인먼트
  { symbol: 'DIS', name: 'Walt Disney Company', marketType: 'us', keywords: ['디즈니', 'disney'] },
  { symbol: 'WBD', name: 'Warner Bros. Discovery', marketType: 'us', keywords: ['워너브러더스', 'warner bros'] },
  { symbol: 'PARA', name: 'Paramount Global', marketType: 'us', keywords: ['파라마운트', 'paramount'] },
  { symbol: 'CMCSA', name: 'Comcast Corporation', marketType: 'us', keywords: ['컴캐스트', 'comcast'] },
  { symbol: 'T', name: 'AT&T Inc.', marketType: 'us', keywords: ['AT&T', 'ATT', '에이티앤티'] },
  { symbol: 'VZ', name: 'Verizon Communications', marketType: 'us', keywords: ['버라이즌', 'verizon'] },
  
  // 헬스케어/바이오
  { symbol: 'JNJ', name: 'Johnson & Johnson', marketType: 'us', keywords: ['존슨앤존슨', 'johnson johnson'] },
  { symbol: 'PFE', name: 'Pfizer Inc.', marketType: 'us', keywords: ['화이자', 'pfizer'] },
  { symbol: 'UNH', name: 'UnitedHealth Group', marketType: 'us', keywords: ['유나이티드헬스', 'unitedhealth'] },
  { symbol: 'ABBV', name: 'AbbVie Inc.', marketType: 'us', keywords: ['애브비', 'abbvie'] },
  { symbol: 'MRK', name: 'Merck & Co. Inc.', marketType: 'us', keywords: ['머크', 'merck'] },
  { symbol: 'LLY', name: 'Eli Lilly and Company', marketType: 'us', keywords: ['일라이릴리', 'eli lilly'] },
  { symbol: 'BMY', name: 'Bristol-Myers Squibb', marketType: 'us', keywords: ['브리스톨마이어스', 'bristol myers'] },
  { symbol: 'GILD', name: 'Gilead Sciences Inc.', marketType: 'us', keywords: ['길리어드', 'gilead'] },
  { symbol: 'BIIB', name: 'Biogen Inc.', marketType: 'us', keywords: ['바이오젠', 'biogen'] },
  { symbol: 'AMGN', name: 'Amgen Inc.', marketType: 'us', keywords: ['암젠', 'amgen'] },
  { symbol: 'REGN', name: 'Regeneron Pharmaceuticals', marketType: 'us', keywords: ['리제네론', 'regeneron'] },
  { symbol: 'MRNA', name: 'Moderna Inc.', marketType: 'us', keywords: ['모더나', 'moderna'] },
  { symbol: 'BNTX', name: 'BioNTech SE', marketType: 'us', keywords: ['바이온테크', 'biontech'] },
  
  // 항공우주/산업
  { symbol: 'BA', name: 'Boeing Company', marketType: 'us', keywords: ['보잉', 'boeing'] },
  { symbol: 'CAT', name: 'Caterpillar Inc.', marketType: 'us', keywords: ['캐터필러', 'caterpillar'] },
  { symbol: 'GE', name: 'General Electric Company', marketType: 'us', keywords: ['제너럴일렉트릭', 'general electric', 'GE'] },
  { symbol: 'LMT', name: 'Lockheed Martin Corporation', marketType: 'us', keywords: ['록히드마틴', 'lockheed martin'] },
  { symbol: 'RTX', name: 'Raytheon Technologies', marketType: 'us', keywords: ['레이시온', 'raytheon'] },
  { symbol: 'HON', name: 'Honeywell International', marketType: 'us', keywords: ['하니웰', 'honeywell'] },
  { symbol: 'MMM', name: '3M Company', marketType: 'us', keywords: ['3M', '쓰리엠'] },
  { symbol: 'UPS', name: 'United Parcel Service', marketType: 'us', keywords: ['UPS', '유피에스'] },
  { symbol: 'FDX', name: 'FedEx Corporation', marketType: 'us', keywords: ['페덱스', 'fedex'] },
  
  // 에너지
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', marketType: 'us', keywords: ['엑손모빌', 'exxon mobil'] },
  { symbol: 'CVX', name: 'Chevron Corporation', marketType: 'us', keywords: ['쉐브론', 'chevron'] },
  { symbol: 'COP', name: 'ConocoPhillips', marketType: 'us', keywords: ['코노코필립스', 'conocophillips'] },
  
  // 부동산/REIT
  { symbol: 'AMT', name: 'American Tower Corporation', marketType: 'us', keywords: ['아메리칸타워', 'american tower'] },
  { symbol: 'CCI', name: 'Crown Castle International', marketType: 'us', keywords: ['크라운캐슬', 'crown castle'] },
  { symbol: 'PLD', name: 'Prologis Inc.', marketType: 'us', keywords: ['프롤로지스', 'prologis'] },
  
  // 게임/엔터테인먼트
  { symbol: 'EA', name: 'Electronic Arts Inc.', marketType: 'us', keywords: ['EA', '일렉트로닉아츠', 'electronic arts'] },
  { symbol: 'ATVI', name: 'Activision Blizzard', marketType: 'us', keywords: ['액티비전블리자드', 'activision', '블리자드'] },
  { symbol: 'TTWO', name: 'Take-Two Interactive', marketType: 'us', keywords: ['테이크투', 'take two', 'GTA'] },
  { symbol: 'RBLX', name: 'Roblox Corporation', marketType: 'us', keywords: ['로블록스', 'roblox'] },
  { symbol: 'U', name: 'Unity Software Inc.', marketType: 'us', keywords: ['유니티', 'unity'] },
  
  // 전자상거래/소셜
  { symbol: 'EBAY', name: 'eBay Inc.', marketType: 'us', keywords: ['이베이', 'ebay'] },
  { symbol: 'ETSY', name: 'Etsy Inc.', marketType: 'us', keywords: ['엣시', 'etsy'] },
  { symbol: 'SHOP', name: 'Shopify Inc.', marketType: 'us', keywords: ['쇼피파이', 'shopify'] },
  { symbol: 'TWTR', name: 'Twitter Inc.', marketType: 'us', keywords: ['트위터', 'twitter'] },
  { symbol: 'SNAP', name: 'Snap Inc.', marketType: 'us', keywords: ['스냅', 'snap', '스냅챗'] },
  { symbol: 'PINS', name: 'Pinterest Inc.', marketType: 'us', keywords: ['핀터레스트', 'pinterest'] },
  { symbol: 'UBER', name: 'Uber Technologies', marketType: 'us', keywords: ['우버', 'uber'] },
  { symbol: 'LYFT', name: 'Lyft Inc.', marketType: 'us', keywords: ['리프트', 'lyft'] },
  { symbol: 'DASH', name: 'DoorDash Inc.', marketType: 'us', keywords: ['도어대시', 'doordash'] },
  
  // 스트리밍/OTT
  { symbol: 'ROKU', name: 'Roku Inc.', marketType: 'us', keywords: ['로쿠', 'roku'] },
  { symbol: 'SPOT', name: 'Spotify Technology', marketType: 'us', keywords: ['스포티파이', 'spotify'] },
  { symbol: 'ZM', name: 'Zoom Video Communications', marketType: 'us', keywords: ['줌', 'zoom'] },
  { symbol: 'DOCU', name: 'DocuSign Inc.', marketType: 'us', keywords: ['도큐사인', 'docusign'] },
  
  // 바이오테크/신약개발
  { symbol: 'ILMN', name: 'Illumina Inc.', marketType: 'us', keywords: ['일루미나', 'illumina'] },
  { symbol: 'DXCM', name: 'DexCom Inc.', marketType: 'us', keywords: ['덱스컴', 'dexcom'] },
  { symbol: 'ISRG', name: 'Intuitive Surgical', marketType: 'us', keywords: ['인튜이티브서지컬', 'intuitive surgical'] },
  
  // 우주/항공
  { symbol: 'SPCE', name: 'Virgin Galactic Holdings', marketType: 'us', keywords: ['버진갤럭틱', 'virgin galactic'] },
  
  // 기타 인기종목
  { symbol: 'BRK.A', name: 'Berkshire Hathaway A', marketType: 'us', keywords: ['버크셔해서웨이', 'berkshire hathaway', '워런버핏'] },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway B', marketType: 'us', keywords: ['버크셔해서웨이', 'berkshire hathaway', '워런버핏'] },
];

// 암호화폐 데이터 (대폭 확장)
export const CRYPTO_CURRENCIES: SearchItem[] = [
  // Top 10 메이저 코인
  { symbol: 'bitcoin', name: 'Bitcoin', marketType: 'crypto', keywords: ['비트코인', 'bitcoin', 'btc', 'BTC'] },
  { symbol: 'ethereum', name: 'Ethereum', marketType: 'crypto', keywords: ['이더리움', 'ethereum', 'eth', 'ETH', '이더'] },
  { symbol: 'binancecoin', name: 'BNB', marketType: 'crypto', keywords: ['바이낸스코인', 'binance coin', 'bnb', 'BNB', '바낸코'] },
  { symbol: 'solana', name: 'Solana', marketType: 'crypto', keywords: ['솔라나', 'solana', 'sol', 'SOL'] },
  { symbol: 'ripple', name: 'XRP', marketType: 'crypto', keywords: ['리플', 'ripple', 'xrp', 'XRP'] },
  { symbol: 'usd-coin', name: 'USD Coin', marketType: 'crypto', keywords: ['USD코인', 'usd coin', 'usdc', 'USDC'] },
  { symbol: 'dogecoin', name: 'Dogecoin', marketType: 'crypto', keywords: ['도지코인', 'dogecoin', 'doge', 'DOGE', '도지'] },
  { symbol: 'toncoin', name: 'Toncoin', marketType: 'crypto', keywords: ['톤코인', 'toncoin', 'ton', 'TON', '텔레그램'] },
  { symbol: 'cardano', name: 'Cardano', marketType: 'crypto', keywords: ['카르다노', 'cardano', 'ada', 'ADA'] },
  { symbol: 'tron', name: 'TRON', marketType: 'crypto', keywords: ['트론', 'tron', 'trx', 'TRX'] },

  // Top 20 알트코인
  { symbol: 'avalanche-2', name: 'Avalanche', marketType: 'crypto', keywords: ['아발란체', 'avalanche', 'avax', 'AVAX'] },
  { symbol: 'shiba-inu', name: 'Shiba Inu', marketType: 'crypto', keywords: ['시바이누', 'shiba inu', 'shib', 'SHIB', '시바'] },
  { symbol: 'chainlink', name: 'Chainlink', marketType: 'crypto', keywords: ['체인링크', 'chainlink', 'link', 'LINK'] },
  { symbol: 'bitcoin-cash', name: 'Bitcoin Cash', marketType: 'crypto', keywords: ['비트코인캐시', 'bitcoin cash', 'bch', 'BCH'] },
  { symbol: 'polygon', name: 'Polygon', marketType: 'crypto', keywords: ['폴리곤', 'polygon', 'matic', 'MATIC'] },
  { symbol: 'polkadot', name: 'Polkadot', marketType: 'crypto', keywords: ['폴카닷', 'polkadot', 'dot', 'DOT'] },
  { symbol: 'litecoin', name: 'Litecoin', marketType: 'crypto', keywords: ['라이트코인', 'litecoin', 'ltc', 'LTC'] },
  { symbol: 'internet-computer', name: 'Internet Computer', marketType: 'crypto', keywords: ['인터넷컴퓨터', 'internet computer', 'icp', 'ICP'] },
  { symbol: 'ethereum-classic', name: 'Ethereum Classic', marketType: 'crypto', keywords: ['이더리움클래식', 'ethereum classic', 'etc', 'ETC'] },
  { symbol: 'uniswap', name: 'Uniswap', marketType: 'crypto', keywords: ['유니스왑', 'uniswap', 'uni', 'UNI'] },

  // DeFi 생태계
  { symbol: 'wrapped-bitcoin', name: 'Wrapped Bitcoin', marketType: 'crypto', keywords: ['랩비트코인', 'wrapped bitcoin', 'wbtc', 'WBTC'] },
  { symbol: 'dai', name: 'Dai', marketType: 'crypto', keywords: ['다이', 'dai', 'DAI'] },
  { symbol: 'cosmos', name: 'Cosmos', marketType: 'crypto', keywords: ['코스모스', 'cosmos', 'atom', 'ATOM'] },
  { symbol: 'filecoin', name: 'Filecoin', marketType: 'crypto', keywords: ['파일코인', 'filecoin', 'fil', 'FIL'] },
  { symbol: 'stellar', name: 'Stellar', marketType: 'crypto', keywords: ['스텔라', 'stellar', 'xlm', 'XLM'] },
  { symbol: 'hedera-hashgraph', name: 'Hedera', marketType: 'crypto', keywords: ['헤데라', 'hedera', 'hbar', 'HBAR'] },
  { symbol: 'vechain', name: 'VeChain', marketType: 'crypto', keywords: ['비체인', 'vechain', 'vet', 'VET'] },
  { symbol: 'aptos', name: 'Aptos', marketType: 'crypto', keywords: ['앱토스', 'aptos', 'apt', 'APT'] },
  { symbol: 'arbitrum', name: 'Arbitrum', marketType: 'crypto', keywords: ['아비트럼', 'arbitrum', 'arb', 'ARB'] },
  { symbol: 'optimism', name: 'Optimism', marketType: 'crypto', keywords: ['옵티미즘', 'optimism', 'op', 'OP'] },

  // 레이어2 & 스케일링
  { symbol: 'immutable-x', name: 'Immutable X', marketType: 'crypto', keywords: ['이뮤터블X', 'immutable x', 'imx', 'IMX'] },
  { symbol: 'the-graph', name: 'The Graph', marketType: 'crypto', keywords: ['더그래프', 'the graph', 'grt', 'GRT'] },
  { symbol: 'loopring', name: 'Loopring', marketType: 'crypto', keywords: ['루프링', 'loopring', 'lrc', 'LRC'] },
  
  // 게임/메타버스
  { symbol: 'axie-infinity', name: 'Axie Infinity', marketType: 'crypto', keywords: ['액시인피니티', 'axie infinity', 'axs', 'AXS'] },
  { symbol: 'decentraland', name: 'Decentraland', marketType: 'crypto', keywords: ['디센트럴랜드', 'decentraland', 'mana', 'MANA'] },
  { symbol: 'the-sandbox', name: 'The Sandbox', marketType: 'crypto', keywords: ['더샌드박스', 'the sandbox', 'sand', 'SAND'] },
  { symbol: 'enjincoin', name: 'Enjin Coin', marketType: 'crypto', keywords: ['엔진코인', 'enjin coin', 'enj', 'ENJ'] },
  { symbol: 'gala', name: 'Gala', marketType: 'crypto', keywords: ['갈라', 'gala', 'GALA'] },
  { symbol: 'apecoin', name: 'ApeCoin', marketType: 'crypto', keywords: ['에이프코인', 'apecoin', 'ape', 'APE'] },
  { symbol: 'illuvium', name: 'Illuvium', marketType: 'crypto', keywords: ['일루비움', 'illuvium', 'ilv', 'ILV'] },
  { symbol: 'stepn', name: 'STEPN', marketType: 'crypto', keywords: ['스텝앤', 'stepn', 'gmt', 'GMT'] },

  // AI & 오라클
  { symbol: 'chainlink', name: 'Chainlink', marketType: 'crypto', keywords: ['체인링크', 'chainlink', 'link', 'LINK'] },
  { symbol: 'fetch-ai', name: 'Fetch.ai', marketType: 'crypto', keywords: ['페치', 'fetch ai', 'fet', 'FET'] },
  { symbol: 'singularitynet', name: 'SingularityNET', marketType: 'crypto', keywords: ['싱귤래러티넷', 'singularitynet', 'agix', 'AGIX'] },
  { symbol: 'ocean-protocol', name: 'Ocean Protocol', marketType: 'crypto', keywords: ['오션프로토콜', 'ocean protocol', 'ocean', 'OCEAN'] },
  { symbol: 'band-protocol', name: 'Band Protocol', marketType: 'crypto', keywords: ['밴드프로토콜', 'band protocol', 'band', 'BAND'] },

  // 밈코인
  { symbol: 'pepe', name: 'Pepe', marketType: 'crypto', keywords: ['페페', 'pepe', 'PEPE'] },
  { symbol: 'floki', name: 'FLOKI', marketType: 'crypto', keywords: ['플로키', 'floki', 'FLOKI'] },
  { symbol: 'bonk', name: 'Bonk', marketType: 'crypto', keywords: ['본크', 'bonk', 'BONK'] },
  { symbol: 'dogwifhat', name: 'dogwifhat', marketType: 'crypto', keywords: ['도그위드햇', 'dogwifhat', 'wif', 'WIF'] },

  // 인프라 & 스토리지
  { symbol: 'near', name: 'NEAR Protocol', marketType: 'crypto', keywords: ['니어', 'near protocol', 'near', 'NEAR'] },
  { symbol: 'arweave', name: 'Arweave', marketType: 'crypto', keywords: ['아위브', 'arweave', 'ar', 'AR'] },
  { symbol: 'helium', name: 'Helium', marketType: 'crypto', keywords: ['헬륨', 'helium', 'hnt', 'HNT'] },
  { symbol: 'storj', name: 'Storj', marketType: 'crypto', keywords: ['스토리', 'storj', 'STORJ'] },
  
  // 기타 알트코인
  { symbol: 'algorand', name: 'Algorand', marketType: 'crypto', keywords: ['알고랜드', 'algorand', 'algo', 'ALGO'] },
  { symbol: 'flow', name: 'Flow', marketType: 'crypto', keywords: ['플로우', 'flow', 'FLOW'] },
  { symbol: 'tezos', name: 'Tezos', marketType: 'crypto', keywords: ['테조스', 'tezos', 'xtz', 'XTZ'] },
  { symbol: 'fantom', name: 'Fantom', marketType: 'crypto', keywords: ['팬텀', 'fantom', 'ftm', 'FTM'] },
  { symbol: 'iota', name: 'IOTA', marketType: 'crypto', keywords: ['아이오타', 'iota', 'IOTA'] },
  { symbol: 'elrond-erd-2', name: 'MultiversX', marketType: 'crypto', keywords: ['멀티버스X', 'multiversx', 'egld', 'EGLD'] },
  { symbol: 'klay-token', name: 'Klaytn', marketType: 'crypto', keywords: ['클레이튼', 'klaytn', 'klay', 'KLAY'] },
  { symbol: 'theta-token', name: 'Theta Network', marketType: 'crypto', keywords: ['세타', 'theta', 'THETA'] },
  { symbol: 'monero', name: 'Monero', marketType: 'crypto', keywords: ['모네로', 'monero', 'xmr', 'XMR'] },
  { symbol: 'zcash', name: 'Zcash', marketType: 'crypto', keywords: ['지캐시', 'zcash', 'zec', 'ZEC'] },
  
  // 스테이블코인
  { symbol: 'tether', name: 'Tether', marketType: 'crypto', keywords: ['테더', 'tether', 'usdt', 'USDT'] },
  { symbol: 'binance-usd', name: 'Binance USD', marketType: 'crypto', keywords: ['바이낸스USD', 'binance usd', 'busd', 'BUSD'] },
  { symbol: 'frax', name: 'Frax', marketType: 'crypto', keywords: ['프랙스', 'frax', 'FRAX'] },
  { symbol: 'trueusd', name: 'TrueUSD', marketType: 'crypto', keywords: ['트루USD', 'trueusd', 'tusd', 'TUSD'] },

  // 한국 관련 & 거래소 토큰
  { symbol: 'icon', name: 'ICON', marketType: 'crypto', keywords: ['아이콘', 'icon', 'icx', 'ICX'] },
  { symbol: 'wemix-token', name: 'WEMIX', marketType: 'crypto', keywords: ['위믹스', 'wemix', 'WEMIX'] },
  { symbol: 'crypto-com-chain', name: 'Cronos', marketType: 'crypto', keywords: ['크로노스', 'cronos', 'cro', 'CRO'] },
  { symbol: 'ftx-token', name: 'FTX Token', marketType: 'crypto', keywords: ['FTX토큰', 'ftx token', 'ftt', 'FTT'] },
  { symbol: 'okb', name: 'OKB', marketType: 'crypto', keywords: ['OKB', 'okb'] },
  { symbol: 'kucoin-shares', name: 'KuCoin Token', marketType: 'crypto', keywords: ['쿠코인토큰', 'kucoin token', 'kcs', 'KCS'] },
  { symbol: 'huobi-token', name: 'Huobi Token', marketType: 'crypto', keywords: ['후오비토큰', 'huobi token', 'ht', 'HT'] },

  // 추가 DeFi 토큰
  { symbol: 'maker', name: 'Maker', marketType: 'crypto', keywords: ['메이커', 'maker', 'mkr', 'MKR'] },
  { symbol: 'aave', name: 'Aave', marketType: 'crypto', keywords: ['아베', 'aave', 'AAVE'] },
  { symbol: 'compound-governance-token', name: 'Compound', marketType: 'crypto', keywords: ['컴파운드', 'compound', 'comp', 'COMP'] },
  { symbol: 'yearn-finance', name: 'yearn.finance', marketType: 'crypto', keywords: ['연파이낸스', 'yearn finance', 'yfi', 'YFI'] },
  { symbol: 'curve-dao-token', name: 'Curve DAO Token', marketType: 'crypto', keywords: ['커브', 'curve', 'crv', 'CRV'] },
  { symbol: 'sushiswap', name: 'SushiSwap', marketType: 'crypto', keywords: ['스시스왑', 'sushiswap', 'sushi', 'SUSHI'] },
  { symbol: '1inch', name: '1inch Network', marketType: 'crypto', keywords: ['원인치', '1inch', '1INCH'] },
  { symbol: 'pancakeswap-token', name: 'PancakeSwap', marketType: 'crypto', keywords: ['팬케이크스왑', 'pancakeswap', 'cake', 'CAKE'] },
];

// 전체 검색 데이터
export const ALL_SEARCH_DATA: SearchItem[] = [
  ...KR_STOCKS,
  ...US_STOCKS,
  ...CRYPTO_CURRENCIES,
];

// 마켓별 검색 함수
export function searchItems(query: string, marketType?: MarketType): SearchItem[] {
  const searchData = marketType 
    ? ALL_SEARCH_DATA.filter(item => item.marketType === marketType)
    : ALL_SEARCH_DATA;
    
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) return [];
  
  return searchData
    .filter(item => 
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.symbol.toLowerCase().includes(normalizedQuery) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(normalizedQuery))
    )
    .slice(0, 10); // 최대 10개 결과
}

// 심볼로 검색 아이템 찾기
export function findItemBySymbol(symbol: string): SearchItem | undefined {
  return ALL_SEARCH_DATA.find(item => 
    item.symbol.toLowerCase() === symbol.toLowerCase()
  );
}