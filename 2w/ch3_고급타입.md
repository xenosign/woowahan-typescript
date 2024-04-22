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

### 3.2.5 맵드 타입(Mapped Types)

- 다른 타입을 기반으로 다른 타입을 선언할 때 사용하는 문법
- 인덱스 시그니처 문법을 사용하면 반복적인 타입 선언을 효과적으로 줄일 수 있다

```ts
type ExampleMapped = {
  a: number;
  b: string;
  c: boolean;
};

type Subset<T> = {
  [K in keyof T]?: T[K];
};

const aExampleMapped: Subset<ExampleMapped> = { a: 3 };
const bExampleMapped: Subset<ExampleMapped> = { b: 'hello' };
const cExampleMapped: Subset<ExampleMapped> = { c: true };
```

- 맵드 타입에서 매핑 시, readonly 또는 ? 수식어 적용이 가능하며, - 를 추가하면 수식어를 제거한 타입 선언이 가능
  - `-readonly [P in keyof T]: T[P];` 로 쓰면 readonly 제거
  - `[P in keyof T]-?: T[P];` 로 쓰면 ? 제거

```ts
type ReadOnlyEx = {
  readonly a: number;
  readonly b: string;
};

let objByReadOnlyEx: ReadOnlyEx = {
  a: 1,
  b: '2',
};

// objByReadOnlyEx.a = 3; // ERR
console.log(objByReadOnlyEx); // { a: 1, b: '2' };

type CreateMutable<T> = {
  // readonly 속성을 제거하여 값을 변화해도 문제 X
  -readonly [P in keyof T]: T[P];
};

type ChangedMutableTypeFromReadOnlyEx = CreateMutable<ReadOnlyEx>;

let objByChangedMutableTypeFromReadOnlyEx = {
  a: 1,
  b: '2',
};

objByChangedMutableTypeFromReadOnlyEx.a = 3;
objByChangedMutableTypeFromReadOnlyEx.b = '4';

console.log(objByChangedMutableTypeFromReadOnlyEx); // { a: 3, b: '4' };

type OptionalEx = {
  a?: number;
  b?: string;
  c: boolean;
};

type Concrete<T> = {
  // ?(optaional) 속성을 제거하여, 해당 속성이 반드시 존재하도록 수정
  [P in keyof T]-?: T[P];
};

type ChandedConcreteTypeFromOptionalEx = Concrete<OptionalEx>;

let objByChandedConcreteTypeFromOptionalEx: ChandedConcreteTypeFromOptionalEx =
  {
    a: 1,
    b: '2',
    c: true,
  };

console.log(objByChandedConcreteTypeFromOptionalEx); // { a: 1, b: '2', c: true };
```

- 배민 예시 코드

```ts
const BottomSheetMap = {
  RECENT_CONTACTS: RecentContactsBottomSheet,
  CARD_SELECT: CardSelectBottomSheet,
  SORT_FILTER: SortFilterBottomSheet,
  PRODUCT_SELECT: ProductSelectBottomSheet,
  REPLY_CARD_SELECT: ReplyCardSelectBottomSheet,
  RESEND: ResendBottomSheet,
  STICKER: StickerBottomSheet,
  BASE: null,
};

export type BOTTOM_SHEET_ID = keyof typeof BottomSheetMap;

// 불필요한 반복이 발생한다
type BottomSheetStore = {
  RECENT_CONTACTS: {
    resolver?: (payload: any) => void;
    args?: any;
    isOpened: boolean;
  };
  CARD_SELECT: {
    resolver?: (payload: any) => void;
    args?: any;
    isOpened: boolean;
  };
  SORT_FILTER: {
    resolver?: (payload: any) => void;
    args?: any;
    isOpened: boolean;
  };
  // ...
};
// Mapped Types를 통해 효율적으로 타입을 선언할 수 있다
type BottomSheetStoreByMapped = {
  [index in BOTTOM_SHEET_ID]: {
    resolver?: (payload: any) => void;
    args?: any;
    isOpened: boolean;
  };
};
```

- as 키워드를 사용하여 키를 재지정하는 코드

```ts
type ChagnedBottomSheetStore = {
  [index in BOTTOM_SHEET_ID as `${index}_BOTTOM_SHEET`]: {
    resolver?: (payload: any) => void;
    args?: any;
    isOpened: boolean;
  };
};
```

\*\* [p.105] 아 이런건 진짜 좀.... ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ

### 3.2.6 템플릿 리터럴 타입(Template Literal Types)

- JS 의 템플릿 리터럴 문자열을 사용하여 기존 타입에 별도의 문자열을 추가한 타입을 선언하는 문법

```ts
type Stage =
  | 'init'
  | 'select-image'
  | 'edit-image'
  | 'decorate-card'
  | 'capture-image';

type StageName = `${Stage}-stage`;
// type StageName = "init-stage" | "select-image-stage" | "edit-image-stage" | "decorate-card-stage" | "capture-image-stage"
```

### 3.2.7 제네릭(Generic)

- 타입 간의 재사용성을 높이기 위해 사용되는 문법으로 C 나 JAVA 에서 가져온 것
- 사용할 타입을 미리 정해두지 않고 실제로 값을 사용할 때 타입을 지정하여 사용하는 방식이다
- 주로 한글자로 축약한 T(Type), E(Element), K(Key), V(Value) 를 사용한다
- 타입 추론이 가능한 경우에는 `<>` 내부에 타입을 명시하지 않아도 컴파일러가 추론하여 대입한다

```ts
function exampleFunc<T>(arg: T): T[] {
  return new Array(3).fill(arg);
}

console.log(exampleFunc('hello')); // [ 'hello', 'hello', 'hello' ]
console.log(3); // [ 3, 3, 3 ]
```

- 다만 제네릭은 타입이 할당 되지 않은 타입이므로 특정 타입에만 존재하는 값을 참조하려고 하면 에러가 발생

```ts
function exampleFunc2<T>(arg: T): number {
  return arg.length; // ERR
}
```

- 대신 제네릭에 extends 키워드를 통해 제약을 걸어주면 해당 속성을 사용할 수 있다

```ts
interface TypeWithLength {
  length: number;
}

function exampleFunc3<T extends TypeWithLength>(arg: T): number {
  return arg.length;
}
```

- 단, TSX 파일 내부에서는 제네릭의 꺽쇠(`<>`)와 JSX 의 꺽쇠를 혼동하기 때문에 extends 키워드를 사용하거나, 함수 선언을 function 으로 한다

```ts
// <T> 를 태그로 인식하여 에러 발생
const arrowExampleFunc = <T>(arg: T) => {
  return new Array(3).fill(arg);
};

// No ERR
const arrowExampleFunc2 = <T extends {}>(arg: T) => {
  return new Array(3).fill(arg);
};

// No ERR
function normalExampleFunc<T>(arg: T) {
  return new Array(3).fill(arg);
}
```

## 3.3 제네릭 사용법

### 3.3.1 함수의 제네릭

- 함수의 매개변수나 반환 값에 다양한 타입을 넣고 싶을 때 사용

```ts
import { ObjectType, EntitySchema, Repository, getConnection } from 'typeorm';

function ReadOnlyRepository<T>(
  target: ObjectType<T> | EntitySchema<T> | string
): Repository<T extends any ? any : never> {
  return getConnection('ro').getRepository(target);
}
```

\*\* [p.109] 안되는 코드 왜케 많죠?

### 3.3.2 호출 시그니처의 제네릭

- 함수의 매개변수와 반환 타입을 미리 선언하는 것
- 제네릭 타입을 어디에 위치 시킬지에 따라 제네릭을 언제 구체 타입으로 한정할지 결정 가능

```ts

```
