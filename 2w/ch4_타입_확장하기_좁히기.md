# 4장. 타입 확장하기 좁히기

## 4.1 타입 확장하기

- 기존 타입을 이용해서 새로운 타입을 정의하는 것
- extends, 교차 타입, 유니온 타입등을 사용하여 타입을 확장

### 4.1.1 타입 확장의 장점

- 중복되는 타입 선언을 확장으로 처리하여 코드 중복 방지
- 확장을 활용하면 요구사항에 따른 타입을 손쉽게 만들어 사용이 가능

```ts
// interface 사용
interface BaseMenuItem {
  itemName: string | null;
  itemImgUrl: string | null;
  itemDiscountAmount: number;
  stock: number | null;
}

// 확장을 사용하여 중복 코드 방지
interface BaseCartItem extends BaseMenuItem {
  quantity: number;
}

// type 을 사용한 예시
type BaseMenuItem = {
  itemName: string | null;
  itemImgUrl: string | null;
  itemDiscountAmount: number;
  stock: number | null;
};

type BaseCartItem = {
  quantity: number;
} & BaseMenuItem;

const cart: BaseCartItem = {
  itemName: 'pizza',
  itemImgUrl: null,
  itemDiscountAmount: 10,
  stock: null,
  quantity: 1,
};
```

### 4.1.2 유니온 타입

- 여러 타입의 합집합을 의미하는 타입
- 유니온 타입으로 선언된 값은 유니온 타입에 포함된 모든 타입이 공통으로 가지고 있는 속성에만 접근이 가능하므로 주의 필요

\*\* [p.123] 교집합 아닌가요?
\*\* [p.123] 속성의 집합이 아니라 값의 집합이라고 생각해야 유니온 타입이 합집합이라는 개념을 이해할 수 있다? -> ???? 어떤 값이 들어올지는 런타입에 결정이 되므로 접근이 가능한 속성은 안전성을 위해 교집합의 개념으로 접근이 가능하고, 실제 들어오는 값은 합집합의 개념이다 라고 하면 될거를....

```ts
interface CookingStep {
  orderId: string;
  price: number;
}

interface DeliveryStep {
  orderId: string;
  time: number;
  distance: string;
}

function getDeliveryDistance(step: CookingStep | DeliveryStep) {
  return step.distance; // ERR, 공통 속성이 아니므로 에러 발생
}
```

### 4.1.3 교차 타입

- 이게 찐 합집합의 개념, & 연산자를 사용하며 모든 속성이 합집합의 개념으로 들어온다

```
다시 말하지만 타입스크립트의 타입을 속성의 집합이 아니라 값의 집합으로 이해해야 한다.
BaedalProgress 교차 타입은 CookingStep이 가진 속성(orderId, time, price)과 DeliveryStep
이 가진 속성(orderId, time, distance)을 모두 만족(교집합)하는 값의 타입(집합)이라고 해석할 수있다.
```

\*\* [p.124] 설명이 이게 맞나여? 이걸 이렇게 설명하면 누가 알아 듣나.... 아니다... 내가 바보인가?

```ts
interface CookingStep {
  orderId: string;
  price: number;
}

interface DeliveryStep {
  orderId: string;
  time: number;
  distance: string;
}

type BedalProgress = CookingStep & DeliveryStep;

function logBedalInfo(progress: BedalProgress) {
  console.log(`주문 금액 : ${progress.price}`);
  console.log(`배달 거리 : ${progress.distance}`);
}
```

- 교차 타입 사용시 타입이 서로 호환되지 않는 경우, 두 타입을 모두 만족하는 경우에만 유지가되므로 아래와 같은 상황이 나온다

```ts
type IdType = string | number;
type Numeric = number | boolean;

type Universal = IdType & Numeric; // number type 으로 지정 된다

const universalVal: Universal = 1;
```

### 4.1.4 extends 와 교차 타입

- extends 키워드를 사용하면 교차 타입 작성이 가능하다
- 단, extends 키워드를 사용한 타입은 실제 교차 타입과 100% 상응하지 않는다
- 단, 유니온 타입과 교차 타입을 사용한 새로운 타입은 오직 type 키워드로만 선언이 가능하므로 type 을 사용해야 한다

```ts
interface DeliveryTip {
  tip: number;
}

// ERR, number 에 string 을 할당하려고 하므로 에러 발생
interface Filter extends DeliveryTip {
  tip: string;
}

// type 사용하면 교차 타입으로 선언되어 tip 은 never 가 된다
type DeliveryTipType = {
  tip: number;
};

type FilterType = DeliveryTip & {
  tip: string;
};
```

\*\* [p.127] 이건 이렇게 쓰면 안된다는 예시로 말을 해줘야 하는거 아닙니까?

## 4.1.5 배달의민족 메뉴 시스템에 타입 확장 적용하기

- 배민 메뉴에서 특정 경우 gif 파일과 text 가 필요한 경우 타입을 확장하는 케이스

- 확장을 사용하지 않고, 기존 타입에 속성을 추가하는 경우

```ts
interface Menu {
  name: string;
  image: string;
  gif?: string;
  text?: string;
}

const specialMenuList: Menu[] = [
  { name: '찜', image: '찜.jpg', gif: '찜.gif' },
  { name: '찌개', image: '찌개.jpg', gif: '찌개.gif' },
];

// 매개변수로 받는 배열의 요소에 text 가 있을지 없을지를 모르고 해당 값을 처리하여 원하는 결과를 얻을 수 없다
// 해당 속성에 문자열이 빈 문자열이 아니면 배열로 리턴하는 함수이지만, 실제로는 속성 값 자체가 존재하지 않아 undefined 와 비교하여
// 실제로 원했던 결과와는 전혀 다른 결과가 발생
const getTextFromMenu = (menuList: Menu[]) => {
  return menuList.filter((menu) => menu.text != '');
};

console.log(getTextFromMenu(specialMenuList));
```

- 타입을 확장하여 사용하는 방식, 해당 방법을 사용하면 배열의 요소의 타입을 강제할 수 있으므로 좀 더 안정적으로 사용이 가능하다

```ts
// 2. 타입 확장 활용
interface Menu {
  name: string;
  image: string;
}

interface SpecialMenu extends Menu {
  gif: string;
}

interface PackageMenu extends Menu {
  text: string;
}

const specialMenuList2: SpecialMenu[] = [
  { name: '찜', image: '찜.jpg', gif: '찜.gif' },
  { name: '찌개', image: '찌개.jpg', gif: '찌개.gif' },
];

const getGifUrlFromSpecialMenuList = (specialMenuList: SpecialMenu[]) => {
  return specialMenuList.filter((specialMenu) => specialMenu.gif != '');
};

console.log(getGifUrlFromSpecialMenuList(specialMenuList2));
```

## 4.2 타입 좁히기 - 타입 가드

### 4.2.1 타입 가드에 따라 분기 처리하기

- 타입 가드는 런타임에 조건문을 사용하여 타입을 검사하고 타입 범위를 좁혀주는 기능
- 주로 typeof, instanceof, in 과 같은 연산자를 사용하여 처리

### 4.2.2 원시 타입을 추론할 때: typeof 연산자 활용하기

- typeof 연산자를 활용하여 검사할 수 있는 타입 목록
- string / number / boolean / undefined / object / function / bigint / symbol

```ts
// 함수 타입을 먼저 지정하고, 변수에 타입을 할당한 뒤 함수 구현
const replaceHyphen: (date: string | Date) => string | Date = (date) => {
  if (typeof date === 'string') {
    return date.replace(/-/g, '/');
  }

  return date;
};

// 변수에 함수를 직접 할당, 위와 달리 TS 가 함수를 보고 함수의 타입을 추론
const replaceHyphen2 = (date: string | Date): string | Date => {
  if (typeof date === 'string') {
    return date.replace(/-/g, '/');
  }

  return date;
};
```

### 4.2.3 인스턴스화된 객체 타입을 판별할 때: instanceof 연산자 활용하기

- 인스턴스화 된 객체 타입을 판별하는 타입 가드가 필요할 때에는 instanceof 연산자를 사용한다

```ts
interface Range {
  start: Date;
  end: Date;
}

interface DatePickerProps {
  selectedDates?: Date | Range;
}

const DatePicker = ({ selectedDates }: DatePickerProps) => {
  const [selected, setSelected] = useState(convertToRange(selectedDates));
};

export function convertToRange(selected?: Date | Range): Range | undefined {
  return selected instanceof Date
    ? { start: selected, end: selected }
    : selected;
}
```

### 4.2.4 객체의 속성이 있는지 없느지에 따른 구분: in 연산자 활용하기

- A in B 로 사용, A 속성이 B 객체에 존재하는지 여부를 체크

```ts
interface BasicNoticeDialogProps {
  noticeTitle: string;
  noticeBody: string;
}

interface NoticeDialogWithCookieProps extends BasicNoticeDialogProps {
  cookieKey: string;
  noForADay?: boolean;
  neverAgain?: boolean;
}

export type NoticeDialogProps =
  | BasicNoticeDialogProps
  | NoticeDialogWithCookieProps;

// 받아온 매개변수 객체에 cookieKey 속성이 존재하는지를 확인 후, 각기 다른 컴포넌트를 반환하는 훅
const NoticeDialog: React.FC<NoticeDialogProps> = (props) => {
  if ('cookieKey' in props) return <NoticeDialogWithCookie {...props} />;
  return <NoticeDialogProps {...props} />;
};
```

### 4.2.5 is 연산자로 사용자 정의 타입 가드 만들어 활용하기

- A is B 형태로 사용, 함수의 리턴 값이 true 일 경우 A 매개 변수 타입을 B 타입으로 취급

```ts
export type EntityType = IDocument | IFolder;

export const documentGuard = (item: EntityType): item is IDocument => {
  // 해당 조건이 참이면 item 은 IDocument 타입
  return item.itemType === 'document'; // 명제를 만족할 조건(boolean 값을 반환해야 함)
};

export const folderGuard = (item: EntityType): item is IFolder => {
  // 해당 조건이 참이면 item 은 IFolder 타입
  return item.itemType === 'folder'; // 명제를 만족할 조건(boolean 값을 반환해야 함)
};
```

- 배민 예시

```ts
// x 매개변수가 destinationCodeList 배열에 포함되어 있으면 x 는 DestinationCode 이므로 x is DestinationCode 에 의해 DestinationCode 타입으로 처리
const isDestinationCode = (x: string): x is DestinationCode =>
  destinationCodeList.includes(x);

const getAvailableDestinationNameList = async (): Promise<
  DestinationName[]
> => {
  const data = await AxiosRequest<string[]>('get', '.../destinations');
  const destinationNames: DestinationName[] = [];
  data?.forEach((str) => {
    // 타입 명제를 사용하느 isDestinationCode 를 사용해야만 TS 가 str 을 DestinationCode 타입으로 좁힐 수 있고 그렇지 않을경우 string 으로 추론하여 아래의 에러가 발생한다
    if (isDestinationCode(str)) {
      destinationNames.push(DestinationNameSet[str]);

      /* isDestinationCode의 반환 값에 is를 사용하지 않고 boolean이라고 한다면 다음 에러가 발생한다
      
      - Element implicitly has an ‘any’ type because expression of type ‘string’ can’t be used to index type ‘Record<”MESSAGE_PLATFORM” | “COUPON_PLATFORM” | “BRAZE”, “통합메시지플랫폼” | “쿠폰대장간” | “braze”>’ */
    }
  });
  return destinationNames;
};
```
