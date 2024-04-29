# 5장. 타입 활용하기

## 5.1 조건부 타입

- TS 의 조건부 타입은 JS 의 삼항 연산자와 동일하게 사용이 가능
- 중복되는 타입 코드를 줄이고 상황에 따른 적절한 타입을 얻거나, 더욱 정확한 타입 추론이 가능하다

### 5.1.1 extends 와 제네릭을 활용한 조건부 타입

- 조건부 타입으로 extends 가 사용되면 인터페이스의 그것과는 다른 의미로 사용이 된다

```ts
// 타입 T 가 U 에 할당이 가능하면 X 타입, 아니면 Y 타입으로 결정
T extends U ? X : Y;

// 사용 예시
interface Bank {
  finalcialCode: string;
  companyName: string;
  name: string;
  fullName: string;
}

interface Card {
  finalcialCode: string;
  companyName: string;
  name: string;
  appCardType?: string;
}

type PayMethod<T> = T extends 'card' ? Card : Bank;
type CartPayMethodType = PayMethod<'card'>;
type BankPayMethodType = PayMethod<'bank'>;
```

### 5.1.2 조건부 타입을 사용하지 않았을 때의 문제점

- 조건부 타입을 사용하지 않은 코드 예시
- 아래의 코드는 결과적으로 useGetRegisteredList 가 PayMethodType[] 타입을 반환하게 되는데, 해당 타입은 결국 `type PayMethodType = PayMethodInfo<Card> | PayMethodInfo<Bank>` 이므로 `PayMethodInfo<Card>` 와 `PayMethodInfo<Bank>` 의 유니온 타입으로 추론이 되는 구조를 가진다
- 하지만 해당 함수는 매개변수로 `'card' | 'appcard' | 'bank'` 를 받아 타입을 확정해서 반환하는 것을 의도한 함수이므로 의도와는 다른 결과를 가진다

\*\* [p.154] 아 설명 진짜...... 걍 코드만 줬으면 더 빨리 이해했을거 같습니다 -\_-+

```ts
type PayMethodType = PayMethodInfo<Card> | PayMethodInfo<Bank>;

export const useGetRegisteredList = (
  type: 'card' | 'appcard' | 'bank'
): UseQueryResult<PayMethodType[]> => {
  const url = `baeminpay/codes/${type === 'appcard' ? 'card' : type}`;

  const fetcher = fetcherFactory<PayMethodType[]>({
    onSuccess: (res) => {
      const usablePocketList =
        res?.filter(
          (pocket: PocketInfo<Card> | PocketInfo<Bank>) =>
            pocket?.useType === 'USE'
        ) ?? [];
      return usablePocketList;
    },
  });

  const result = useCommonQuery<PayMethodType[]>(url, undefined, fetcher);

  return result;
};
```

### 5.1.3 extends 조건부 타입을 활요앟여 개선하기

- PayMethodType 에 조건부 타입을 적용하여 매개변수를 받는 타이밍에 리턴 데이터의 타입을 확정하여 위에서 문제가 되었던 점을 개선 할 수 있다
- PayMethodType 에 조건부 타입이 적용되어 매개변수로 타입 리터럴이 전달 되는 순간, 제네릭에 의해 useGetRegisteredList 함수의 리턴 데이터의 타입이 확정되어 애초의 의도를 지키는 형태의 함수가 된다

```ts
type PayMethodType2<T extends 'card' | 'appcard' | 'bank'> = T extends
  | 'card'
  | 'appcard'
  ? Card
  : Bank;

// 개선된 useGetRegisteredList
export const useGetRegisteredList = <T extends 'card' | 'appcard' | 'bank'>(
  type: T
): UseQueryResult<PayMethodType2<T>[]> => {
  const url = `baeminpay/codes/${type === 'appcard' ? 'card' : type}`;

  const fetcher = fetcherFactory<PayMethodType2<T>[]>({
    onSuccess: (res) => {
      const usablePocketList =
        res?.filter(
          (pocket: PocketInfo<Card> | PocketInfo<Bank>) =>
            pocket?.useType === 'USE'
        ) ?? [];
      return usablePocketList;
    },
  });

  const result = useCommonQuery<PayMethodType2<T>[]>(url, undefined, fetcher);

  return result;
};
```

\*\* [p.156]

```
제네릭과 extends를 함께 사용해 제네릭으로 받는 타입을 제한했다. 따라서 개발자는 잘못된 값을 넘길 수없기 때문에 휴먼 에러를 방지할 수 있다.
```

\*\* 이 부분 맞나요? extends 를 적용하기 전에도 `type: 'card' | 'appcard' | 'bank'` 와 같이 매개 변수에 리터럴 유니온 타입을 적용했기 때문에 애초에 잘못된 값을 넘길 여지가 없지 않나요?

\*\* 두번째 내용인 반환 값을 사용자가 원하는 값으로 구체화하는 건 확실한데....

\*\* [p.156] 반환타입 이 그림 의미는 뭔가요? 그리고 어떻게 읽어야 하는거죠?

### 5.1.4 infer 를 활용해서 타입 추론하기

#### infer 의 사용

- 조건부 타입의 조건식이 참으로 평가 될 때 infer 키워드 사용이 가능
- 해당 키워드를 사용하는 이유는 추후에 추론된 U 를 제네릭 처럼 활용이 가능하여 다양한 시도가 가능해 지기 때문

```ts
T extends number ? X : Y;

// 위의 코드와는 달리 추로 된 U 를 대응되는 식에서 사용이 가능
T extends infer U ? X : Y
```

- 그런데 위 처럼 사용하면 아래와 같은 의문이 생긴다, 이걸 왜쓰지? 걍 타입 지정하면 되는 것이 아닌가?

```ts
type MyType<T> = T extends infer R ? R : null;

const a: MyType<number> = 123;
console.log(typeof a); //number

// 사실 위와 같은 코드는 아래와 동일하다
type MyType<T> = T extends number ? number : null;
```

#### infer 의 활용

- infer 를 활용하면 특정 타입을 반환하는 타입을 만들 때, 타입이 추가될 때마다 조건부의 union 타입에 타입을 추가할 필요 없이 전달 받은 타입을 추론하여 바로 사용이 가능하여 유틸리티 타입으로 사용이 가능하다

- 간단한 예시

```ts
type MyNormalType<T> = T extends number ? number : null;

type MyInferType<T> = T extends infer R ? R : null;

// 기존에 지정한 union 이외의 타입을 지정하려 하면 아래와 같이 에러 발생 -> 따라서 타입이 추가되면 MyNormalType 에 조건부에 union 타입을 지속적으로 추가 필요
const testNormal: MyNormalType<string> = 'string';

// 전달 받은 타입을 infer 로 추론한 R 을 사용하여 타입을 지정하므로, 타입이 추가될 때마다 union 타입을 추가할 필요가 없음. 유틸리티 타입으로 활용 가능
const testInfer: MyInferType<string> = 'string';
```

- 함수에 적용한 복잡한 예시

```ts
// infer 미적용 코드, 특정 타입이 추가될 때마다 유니온 타입에 추가 필요
type FuncReturnType<T extends (...args: any) => any> = string | number; // 유니온 타입

function fn(num: number) {
  return num;
}

const a: ReturnType<typeof fn> = 6;
console.log(a); // 6

// infer 적용 코드, 함수의 리턴 타입을 알아서 추론하여 union 추가 필요 없이 리턴 타입 활용 가능
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;

function fn(num: number) {
  return num.toString();
}

const a: ReturnType<typeof fn> = 'Hello';
```

\*\* 참고 블로그
\*\* https://velog.io/@from_numpy/TypeScript-infer

#### 다시 책 내용

- extends 사용시 infer 키워드를 추가하여 타입을 추론하는 방식이 가능하다

```ts
// Promise 로 감싸진 배열을 받아서, 해당 배열의 타입을 반환하거나 아닐경우 any 를 반환하는 타입
type UnpackPromise<T> = T extends Promise<infer K>[] ? K : any;

const promises = [Promise.resolve('Mark'), Promise.resolve(38)];

type Expected = UnpackPromise<typeof promises>; // string | number
```

\*\* [p.158] 아니... 라우팅을 모르는 사람이 이걸 보고 있겠냐고요..... 그리고 라우팅 모르는데 이 예시 코드들 이해하면.... 그거슨 바로 코딩천재
\*\* 내용 설명이나 더 잘해줬으면 하는 작은 소망이... 그런데 이건 다 제가 TS 를 잘몰라서 생기는 이슈겠...

- 실제 배민 예시 코드

```ts
type PermissionNames = '기기 정보 관리' | '안전모 인증 관리' | '운행 여부 조회';

type UnpackMenuNames<T extends ReadonlyArray<MenuItem>> =
  T extends ReadonlyArray<infer U>
    ? U extends MainMenu
      ? U['subMenus'] extends infer V
        ? V extends ReadonlyArray<SubMenu>
          ? UnpackMenuNames<V>
          : U['name']
        : never
      : U extends SubMenu
      ? U['name']
      : never
    : never;

export type PermissionNames = UnpackMenuNames<typeof menuList>;
```

\*\* [p.161] 와 이 코드 뭐죠? Type 에서 재귀가 가능한 거였군요... 그리고 전 남이 이렇게 3항 연산자로 코드 짜오면... 걍 안읽을거 같은데....
\*\* 메뉴가 중첩 구조로 있는 경우에는 잘 작동하겠지만, 타입을 이렇게 써야하는게 최선일까요?
