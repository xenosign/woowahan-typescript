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

## 5.2 템플릿 리터럴 타입 활용하기

- 타입을 특정 문자열로 지정하여 고유한 타입을 만들어 사용하는 방법
- 타입을 특정 문자열로 검증하여 휴먼 에러 방지 및 자동 완성 기능을 통해 개발 생산성 향상 가능
- TS 4.1 버전 부터는 템플릿 리터럴 타입을 지원하여 리터럴 타입을 더욱 확장하여 사용이 가능

```ts
type HeadingNumber = 1 | 2 | 3 | 4 | 5;
type HeaderTag = `h${HeadingNumber}`;
```

- Direction 타입의 경우 모든 상황을 리터럴로 전부 선언하지 않고, 수직 - 수평에 대한 타입을 템플릿 리터럴 타입으로 조합하여 사용이 가능하다

```ts
// 전부 선언한 리터럴 타입
type Direction =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight';

// 수직 - 수평 타입을 템플릴 리터럴로 조합
type Vertical = 'top' | 'bottom';
type Horizon = 'left' | 'right';

type DirectionTemplete = Vertical | `${Vertical}${Capitalize<Horizon>}`;
```

- 유니온 타입 경우의 수가 너무 많은 경우 TS 의 타입 추론 시간이 너무 오래걸려 에러를 발생 시킬 수 있으므로 적절히 나누어 사용해야 한다

```ts
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Chunk = `${Digit}${Digit}${Digit}${Digit}`;
type PhoneNumberType = `010-${Digit}-${Digit}`;

// 위의 타입은 10^4 의 타입을 2개 연속으로 가지는 타입이므로 최종적으로 (10^4)^2 의 경우의 수를 가지게 되는 안좋은 예시가 된다
```

## 5.3 커스텀 유틸리티 타입 활용하기

### 5.3.1 유틸리티 함수를 활용해 styled-components 의 중복 타입 선언 피하기

- styled-components 를 사용하여 동적 스타일링을 구현하는 경우 styled-components 에 전달하기위한 StyledProps 가 발생
- 하지만 StyledProps 의 경우 컴포넌트에서 받은 Props 의 특정 속성을 그대로 받아오는 것이기 때문에, 따로 선언하여 사용할 경우 코드 중복이 발생한다

- 이러한 상황에서 StyledProps 를 따로 선언하여 사용하는 경우의 코드
- Props 정확하게 동일한 타입의 StyledProps 를 별도로 선언하여 코드 중복이 발생하며, Props 의 속성이 변경되면 StyledProps 도 동일하게 변경을 해줘야 하는 문제점이 발생한다

```ts
// HrComponent.tsx
export type Props = {
  height?: string;
  color?: keyof typeof colors;
  isFull?: boolean;
  className?: string;
}

export const Hr: VFC<Props> = ({ height, color, isFull, className }) => {
  return <HrComponent height={height} color={color} isFull={isFull} className={class Name} />;
};

// style.ts
type StyledProps = {
  height?: string;
  color?: keyof typeof Color;
  isFull?: boolean;
  className?: string;
}
```

- Pick(타입의 특정 속성만 가져오기), Omit(타입의 특정 속성만 빼고 가져오기)를 사용하여 StyledProps 에 필요한 속성만 Props 에서 가져와서 문제점을 수정한 코드

```ts
// HrComponent.tsx
export type Props = {
  height?: string;
  color?: keyof typeof colors;
  isFull?: boolean;
  className?: string;
}

export const Hr: VFC<Props> = ({ height, color, isFull, className }) => {
  return <HrComponent height={height} color={color} isFull={isFull} className={class Name} />;
};

// style.ts
type UtilityStyledProps = Pick<Props, 'height' | 'color' | 'isFull'>;
```

### 5.3.2 PickOne 유틸리티 함수

- TS 에서는 서로 다른 2개 이상의 객체를 유니온 타입으로 받을 때 타입 검사가 제대로 진행되지 않는 이슈가 발생
- 이런 문제를 해결하기 위해 PickOne 이라는 유틸리티 함수가 사용

- CreditCard, 또는 Account 중 하나의 타입만 받고 싶은 상황에서 유니온을 사용하였으나 제대로 타입 검사가 이루어지지 않는 케이스

```ts
type Account = {
  account: string;
};

function withdraw(type: CreditCard | Account) {
  // Do sth
}

withdraw({ card: 'hyundai', account: 'hana' }); // Err 가 발생하지 않는다
```

#### 식별할 수 있는 유니온으로 객체 타입을 유니온으로 받기

- 각각의 타입에 type 이라는 속성을 추가하여 객체를 구분할 수 있도록 처리
- type 에는 유니온이 적용되어 'card', 'account' 를 둘 다 쓸 수 있지만 해당 값이 결정되면 type 검사가 더 명확하게 진행되어 이전과 같이 card, account 속성을 동시에 사용이 불가능해진다

```ts
type CreditCard = {
  type: 'card';
  card: string;
};

type Account = {
  type: 'account';
  account: string;
};

function withdraw(type: CreditCard | Account) {
  // Do sth
}

withdraw({ type: 'card', card: 'hyundai', account: 'hana' }); // account 속성에서 ERR 발생
```

- 하지만 이러한 경우는 모든 경우에 수의 type 을 전부 넣어줘야 하는 문제 및 해당 함수가 호출 되는 부분에 대한 모든 수정이 필요한 한계가 발생

#### PickOne 커스텀 유틸리티 타입 구현하기

- TS 에서 제공하는 유틸리티 타입을 활용하여 커스텀 유틸리티 타입을 만들어 해결이 가능
- 유니온에 의해 합집합 처리가 되는 속성에 옵셔널 undefined 를 붙여 사용자가 고의적으로 undefined 를 넣는게 아니면 타입 에러는 발생 시키는 방법으로 해결하기

```ts
type CreditCard = {
  account?: undefined;
  card: string;
};

type Account = {
  account: string;
  card?: undefined;
};

function withdraw(type: CreditCard | Account) {
  // Do sth
}

withdraw({ card: 'hyundai', account: 'hana' }); // Card 를 의도했다면 account 에 undefined 가 아닌 string 값이 왔으므로 ERR 발생, 반대도 성립
```

- 위의 Case 를 커스텀 유틸리티 타입으로 구현한 타입

\*\* [p.168] 진짜 설명이랑 흐름이 하...... 또 화가 많이 나네

```ts
type CreditCard = {
  card: string;
};

type Account = {
  account: string;
};

type PickOne<T> = {
  [P in keyof T]: Record<P, T[P]> &
    Partial<Record<Exclude<keyof T, P>, undefined>>;
}[keyof T];

// 갑자기 여기 조건은 & 로 변경
type CardOrAccount = PickOne<CreditCard & Account>;

function withdraw(type: CardOrAccount) {
  // Do sth
}

withdraw({ card: 'hyundai' });
```

- GPT 가 추천한 PickOne 타입 버전 코드

```ts
type CreditCard = {
  card: string;
};

type Account = {
  account: string;
};

// 유니온에 합집합으로 모인 속성이 전해진 타입에 포함이면 해당 속성의 타입으로 반환하고, 포함되지 경우라면 undefined 를 고정으로 가지도록 만드는 타입
type PickOne2<T> = T extends infer U ? { [K in keyof U]: U[K] } : undefined;

type CardOrAccount2 = PickOne2<CreditCard | Account>;

function withdraw2(type: CardOrAccount2) {
  // Do sth
}

withdraw2({ card: 'hyundai' });
```

#### PickOne 살펴보기

\*\* [p.169] 뭐라 하나 봅시다잉 ㅋㅋㅋㅋㅋ

```ts
type One<T> = { [P in keyof T]: Record<P, T[P]> }[keyof T];

// 1) P 는 T 객체의 키 값
// 2) 해당 속성값은 Record<P, T[P]> 에 의해 P 라는 키를 가지고 값은 전해진 객체의 값의 타입을 가진다
// 3) 따라서 2)에 의해 전해진 값은 전달된 객체의 키에 값이 Record<P, T[P]> 로 전해진 객체의 유니온 값이 된다
// 4) 최종에서 다시 [keyof T] 의 키값으로 접근하므로 Record<P, T[P]> 의 유니온 값들이 하나로 합쳐지는 효과를 가진다

// 예시
type CreditCard = {
  card: string;
};

type Account = {
  account: string;
};

type One<T> = { [P in keyof T]: Record<P, T[P]> }[keyof T];

// 위의 코드에서 3)의 상태에서 One 타입의 결과물은 card: Record<'card', string> | account: Record<'age', string> 이라는 유니온 값을 가짐
// 그런데 이러면 속성 값을 둘 다 가져도 걸러내지 못하기 때문에 ExcludeOne 이라는 타입을 합쳐줘서 필요없는 속성에는 undefined 를 강제 시켜줘야함

type ExcludeOne<T> = {
  [P in keyof T]: Partial<Record<Exclude<keyof T, P>, undefined>>;
}[keyof T];

// PickOne 은 전달 받은 속성 값을 전부 가진 타입과, 공통되지 않은 속성은 undefined 로 강제되는 타입의 합집합의 형태를 가진다
type PickOne<T> = One<T> & ExcludeOne<T>;

type CardOrAccount = PickOne<CreditCard & Account>;

function withdraw(type: CardOrAccount) {
  // do sth
}

withdraw({ card: 'card' });
withdraw({ card: 'card', account: 'account' }); // ERR
```

\*\* [p.171] 진짜 설명 오질라게 못하네, 게다가 설명 와중에 컨디션은 개같이 변경되고 흐름도 쓰레기고 허허허허허허허허허허허허허허허 개빡친다

### 5.3.3 NonNullable 타입 검사 함수를 사용하여 간편하게 타입 가드하기

#### NonNullable 타입이란?

- 제네릭이 null 또는 undefined 타입일 경우 never 또는 T 를 반환하는 타입, 이를 이용하여 null 이나 undefined 가 아닌 경우를 제외 가능하다

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

#### null, undefined 를 검사하는 isNonNullable 함수

- 해당 함수에 value 로 전달하면 null 이나 undefined 가 아닌 타입으로 타입을 좁힐 수 있다

```ts
function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

const nullType: null = null;
const notNullType: string = 'string';

console.log(isNonNullable(nullType));
console.log(isNonNullable(notNullType));
```

## 5.4 불변 객체 타입으로 활용하기

### 5.4.1 Atom 컴포넌트에서 theme style 객체 활용하기

- theme 객체를 통해 색상을 as const 로 선언하여 불변 객체로 선언하여 사용
- 값을 받을 때에는 리터럴을 이용하여 접근하여 사용

```ts
interface Props {
  fontSize?: string;
  backgroundColor?: string;
  color?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

const Button: FC<Props> = ({ fontSize, backgroundColor, color, children }) => {
  return (
    <ButtonWrap
      fontSize={fontSize}
      backgroundColor={backgroundColor}
      color={color}
    >
      {' '}
      {children}{' '}
    </ButtonWrap>
  );
};

// theme 컬러는 props 로 받아온 값을 적용하기 위해 리터럴 접근법 사용
const ButtonWrap = styled.button<Omit<Props, 'onClick'>>`
  color: ${({ color }) => theme.color[color ?? 'default']};
  background-color: ${({ backgroundColor }) =>
    theme.bgColor[backgroundColor ?? 'default']};
  font-size: ${({ fontSize }) => theme.fontSize[fontSize ?? 'default']};
`;
```

#### 타입스크립트 keyof 연산자로 객체의 키값을 타입으로 추출하기

- keyof 연산자를 사용하면 객체의 키 값을 string 또는 리터럴 유니온으로 반환

```ts
interface ColorType {
  red: string;
  green: string;
  blue: string;
}

type ColorKeyType = keyof ColorType; // 'red' | 'green' | 'blue'
```

#### 타입스크립트 typeof 연산자로 값을 타입으로 다루기

- 컬러 객체의 타입 자체를 반환하는 typeof 를 사용

#### 객체의 타입을 활용해서 컴포넌트 구현하기

```ts
import { FC } from 'react';
import styled from 'styled-components';

const colors = {
  black: '#000000',
  gray: '#222222',
  white: '#FFFFFF',
  mint: '#2AC1BC',
};

const theme = {
  colors: {
    default: colors.gray,
    ...colors,
  },
  backgroundColor: {
    default: colors.white,
    gray: colors.gray,
    mint: colors.mint,
    black: colors.black,
  },
  fontSize: { default: '16px', small: '14px', large: '18px' },
};

// theme 객체의 타입을 추출하여 타입을 만들기
// 그 와중에 typeof keyof 순서 바뀐거 실화냐....
type ColorType = keyof typeof theme.colors;
type BackgroundColorType = keyof typeof theme.backgroundColor;
type FontSizeType = keyof typeof theme.fontSize;

// Props 에 theme 객체의 타입을 추출하여 적용한 타입을 적용
interface Props {
  color?: ColorType;
  backgroundColor?: BackgroundColorType;
  fontSize?: FontSizeType;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

const Button: FC<Props> = ({ fontSize, backgroundColor, color, children }) => {
  return (
    <ButtonWrap
      fontSize={fontSize}
      backgroundColor={backgroundColor}
      color={color}
    >
      {children}
    </ButtonWrap>
  );
};

const ButtonWrap = styled.button<Omit<Props, 'onClick'>>`
  color: ${({ color }) => theme.color[color ?? 'default']};
  background-color: ${({ backgroundColor }) =>
    theme.bgColor[backgroundColor ?? 'default']};
  font-size: ${({ fontSize }) => theme.fontSize[fontSize ?? 'default']};
`;
```

\*\* [p.178] typeof keyof 순서가 바뀐거는 진짜 이 예제코드가 진짜 배민에서 쓰이는가 하는 의문이 드네요.. ㅂㄷㅂㄷ
\*\* 예제 화면으로 나온거만봐도 TestComponent 인거 보면, 책 쓰려고 걍 막 코드 만든게 아닌가 하는 의심도...

## 5.5 Record 원시 타입 키 개선하기

### 5.5.1 무한한 키를 집합으로 가지는 Record
