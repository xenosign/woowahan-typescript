# 7장. 비동기 호출

## 7.1 API 요청

### 7.1.1 fetch 로 API 요청하기

- 비동기 호출 코드는 변경 요구에 취약하며, 정책이 추가 될 때마다 비동기 코드를 수정해야하는 번거로움이 발생

### 7.1.2 서비스 레이어로 분리하기

- 변경이 될 수 있다는 점을 감안하여 비동기 호출 코드는 컴포넌트 영역에서 분리하여 서비스 레이어에서 처리가 필요

### 7.1.3 Axios 활용하기

- fetch 는 내장 라이브러리의 한계가 있어서 다양한 기능을 제공하는 Axios 를 사용

```ts
const apiRequester: AxiosInstance = axios.create({
  baseURL: 'https://api.baemin.com',
  timeout: 5000,
});

const fetchCart = (): AxiosPromise<FetchCartResponse> =>
  apiRequester.get<FetchCartResponse>('cart');

const postCart = (
  postCartRequest: PostCartRequest
): AxiosPromise<PostCartResponse> =>
  apiRequester.post<PostCartResponse>('cart', postCartRequest);
```

- API Entry 가 2개 이상인 경우 각 서버의 기본 URL 을 호출하는 인스턴스를 따로 구성하여 사용

```ts
const apiRequester: AxiosInstance = axios.create(defaultConfig);
const orderApiRequester: AxiosInstance = axios.create({
  baseURL: 'https://api.baemin.or/',
  ...defaultConfig,
});
const orderCartApiRequester: AxiosInstance = axios.create({
  baseURL: 'https://cart.baemin.order/',
  ...defaultConfig,
});
```

### 7.1.4 Axios 인터셉터 사용하기

- 서버에 따라 헤더를 설정해야하는 로직을 위해 Axios 인터셉터를 사용
- 또한 Class 로 구성된 API Builder 를 사용하여 데이터 체인을 사용하여 각각의 통신에 따른 요청, 에러처리, 데이터 리턴 등을 편리하게 사용
- 단, 보일러플레이트 코드가 길다는 단점이 존재한다

```ts
const fetchJobNameList = async (name?: string, size?: number) => {
  const api = APIBuilder.get('/apis/web/jobs')
    .withCredentials(true); // 이제 401 에러가 나는 경우, 자동으로 에러를 탐지하는 인터셉터를 사용하게 된다
    .params({ name, size }) // body가 없는 axios 객체도 빌더 패턴으로 쉽게 만들 수 있다
    .build();

  const { data } = await api.call<Response<JobNameListResponse>>();
  return data;
};
```

### 7.1.5 API 응답 타입 지정하기

- 서버에서 오는 응답을 통일함에 있어서 Update, Create 같이 응답이 없을 수 있는 API 가 존재하므로 따로 처리가 필요
- 따라서, 응답에 대한 타입은 apiRequester 가 모르게 관리되어야 한다

### 7.1.6 뷰 모델(View Model) 사용하기

- 새로운 프로젝트의 경우 백엔드 서버의 스펙이 자주 변경되므로 뷰 모델을 사용하여 API 변경에 따른 범위를 한정해야 한다
- 뷰 모델을 만들면 API 응답이 변경되어도 UI 에 영향을 안주는 형태로 개발이 가능하다

- 뷰 모델 적용 전 코드

```ts
interface ListResponse {
  items: ListItem[];
}

const fetchList = async (filter?: ListFetchFilter): Promise<ListResponse> => {
  const { data } = await api
    .params({ ...filter })
    .get('apis/get-list-summaries')
    .call<Response<ListResponse>>();
  return { data };
};
```

- 뷰 모델 적용 후 코드

```ts
interface JobListResponse {
  jobItems: JobListItemResponse[];
}

class JobListItem {
  constructor(item: JobListItemResponse) {
    /* JobListItemResponse에서 JobListItem 객체로 변환해주는 코드 */
  }
}

class JobList {
  readonly totalItemCount: number;
  readonly items: JobListItemResponse[];
  constructor({ jobItems }: JobListResponse) {
    this.totalItemCount = jobItems.length;
    this.items = jobItems.map((item) => new JobListItem(item));
  }
}

const fetchJobList = async (
  filter?: ListFetchFilter
): Promise<JobListResponse> => {
  const { data } = await api
    .params({ ...filter })
    .get('/apis/get-list-summaries')
    .call<Response<JobListResponse>>();
  return new JobList(data);
};
```

- 단, 각각의 API 에 따라 뷰 모델도 1개씩 추가를 해야하는 문제가 발생한다
- 따라서, API 응답의 변경에 따라 클라이언트 코드를 수정하는 비용을 줄이면서도 도메인의 일관성을 지킬 수 있는 절충안을 찾아야 한다
- 백엔드 개발자와의 상의를 통해 API 응답 변화를 최대한 줄이기, 뷰 모델에 추가한 값을 getter 알기 등 다양한 방법 적용이 가능하다

### 7.1.7 Superstruct 를 사용해 런타임에서 응답 타입 검증하기

- Superstruct 라이브러리를 사용하면 런타임 데이터 유효성 검사가 가능하여 런타임 오류를 해결 가능

```ts
import { Infer, number, object, string } from 'superstruct';

const User = object({
  id: number(),
  email: string(),
  name: string(),
});

type User = Infer<typeof User>;

type User = { id: number; email: string; name: string };

function isUser(user: User) {
  assert(user, User);
  console.log('적절한 유저입니다.');
}

const userA = {
  id: 4,
  email: 'test@gg.com',
  name: 'lhs',
};

const userB = {
  id: 4,
  email: 'test@gg.com',
  name: 5,
};

isUser(userA); // 적절한 유저입니다
isUser(userB); // ERR 발생
```

### 7.1.8 실제 API 응답 시의 Superstruct 활용 사례

- 타입 스크립트의 타입은 컴파일 타입에서 타입을 검증
- Superstruct 를 사용하여 실제로 통신이 이루어 졌을 때 응답 데이터의 타입을 검증

```ts
import { assert } from 'superstruct';

function isListItem(listItems: ListItem[]) {
  listItems.forEach((listItem) => assert(listItem, ListItem));
}
```

## 7.2 API 상태 관리하기
