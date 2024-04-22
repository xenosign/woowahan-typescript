# 3장. 고급 타입

## 3.2 타입 조합

### 3.2.1 교차 타입(Intersection)

- 여러가지 타입을 결합하여 하나의 단일 타입으로 만드는 것, & 을 사용하여 표기
- 결합한 타입을 모두 만족해야만 한다

```ts
type ProductItem = {
  id: number;
  name: string;
  type: string;
  price: number;
  imgUrl: string;
  quantity: number;
};

type ProductItemWithDiscount = ProductItem & { discountAmount: number };
```

### 3.2.2 유니온 타입(Union)

- 여러가지 타입을 결합하여 하나의 단일 타입으로 만드는 것, | 을 사용하여 표기
- 결합한 타입 중 하나가 될 수 있는 타입을 말한다

```ts
type ProductItem = {
  id: number;
  name: string;
  type: string;
  price: number;
  imgUrl: string;
  quantity: number;
};

type CardItem = {
  id: number;
  name: string;
  type: string;
  imgUrl: string;
};

type PromotionEventItem = ProductItem | CardItem;

const prontPromotionItem = (item: PromotionEventItem) => {
  console.log(item.name);
  console.log(item.quantity); // ERR, CardItem 에서는 quantity 를 보장하지 못함
};
```

### 3.2.3 인덱스 시그니쳐(Index Signatures)

- 속성 이름을 알 수 없지만 타입을 알고 있을 때 사용하는 문법
- 해당 문법을 통해 특정 타입 속성의 타입을 강제할 수 있다
- 인터페이스 내부에 [Key: K]: T 꼴로 타입을 명시한다

```ts
interface IndexSignatureEx {
  [key: string]: number | boolean;
  length: number;
  isValid: boolean;
  name: string; // ERR, number 혹은 boolean 만 가능
}
```

\*\* [p.101] 이런 부분 표현이 조금 재미 있는 것 같습니다. 다른 타입의 특정 속성이 가지는 타입?

### 3.2.4 인덱스드 엑세스 타입(Indexed Access Types)

- 다른 타입의 특정 속성이 가지는 타입을 알아내거나, 해당 타입을 받아오기 위해 사용

```ts
type Example = {
  a: number;
  b: string;
  c: boolean;
};

type indexedAccess = Example['a']; // number
type indexedAccess2 = Example['a' | 'b']; // number | string
type indexedAccess3 = Example[keyof Example]; // number | string | boolean

const indexedAccessVar: indexedAccess = 1;
const indexedAccessVar2: indexedAccess2 = 's';
const indexedAccessVar3: indexedAccess3 = false;
```

- 특정 배열의 요소 타입을 받기 위해 아래와 같은 코드로 구현이 가능하다

```ts
const promotionList = [
  { type: 'product', name: 'chicken' },
  { type: 'product', name: 'pizza' },
  { type: 'card', name: 'cheer-up' },
];

// 책의 에러 코드, 해당 코드는 배열 타입 선언에만 사용 가능
// type ElementOf<T> = typeof T[number];

// 입력받은 제너릭이 특정 타입으로 구성 된 배열인지를 확인하고
// 해당 타입의 배열이 맞다면 배열의 요소를 T[number] 로 인덱싱 하여 요소의 타입을 반환
// 아닐 경우 never 타입으로 반환
type ElementOf<T> = T extends any[] ? T[number] : never;

// promotionList 의 배열 타입을 전달 하여 promotionList 의 요소 타입을 반환 받기
type PromotionElementType = ElementOf<typeof promotionList>; // { type: string; name: string; } | { type: string; name: string; }

const PromotionElementTypeObj: PromotionElementType = {
  type: 'type',
  name: 'name',
};

// 객체일 경우 예시 코드
const promotionObj = {
  promotionListType: {
    type: 'type',
    name: 'name',
  },
};

// type ElementOf<T> = typeof T[number];
type PropertyOf<T> = T extends object ? T : never;

// ElementOf 타입 테스트
type PromotionProertyType = PropertyOf<typeof promotionObj>; // { type: string; name: string; } | { type: string; name: string; }

const PromotionPropertyTypeObj: PromotionProertyType = {
  promotionListType: {
    type: 'type',
    name: 'name',
  },
};
```
