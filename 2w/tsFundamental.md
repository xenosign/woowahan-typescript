## 제네릭

- 타입을 동적으로 지정하기 위하여 타입을 전달하는 일종의 매개 변수
- 함수에서 매개변수를 받아서 사용하는 것 처럼, 타입을 전달하여 변수 할당 시점에 타입 지정이 가능

```ts
// 제네릭으로 타입을 전달
interface Mobile<T> {
  name: string;
  price: number;
  // 할당 시점에 타입을 받아서 타입 지정
  option: T;
}

const m1: Mobile<object> = {
  name: 's21',
  price: 1000,
  option: {
    color: 'red',
    coupon: false,
  },
};

const m2: Mobile<{ color: string; coupon: boolean }> = {
  name: 's21',
  price: 1000,
  option: {
    color: 'red',
    coupon: false,
  },
};

const m3: Mobile<string> = {
  name: 's21',
  price: 1000,
  option: 'good',
};
```

- 아래와 같이 공용 함수를 만들 때, 특정 타입에 따라 매개변수 타입이 달라지는 경우에 유용하게 사용이 가능하다

```ts
interface User {
  name: string;
  age: number;
}

interface Car {
  name: string;
  color: string;
}

interface Book {
  price: number;
}

const user: User = { name: 'a', age: 10 };
const car: Car = { name: 'bmw', color: 'red' };
const book: Book = { price: 3000 };

function showName<T extends { name: string }>(data: T): string {
  return data.name;
}

showName(user);
showName(car);
showName(book); // ERR
```

## 유틸리티

### keyof

- 특정 타입의 키 값을 문자열 union 형태로 받는 키워드

```ts
interface User {
  id: number;
  name: string;
  age: number;
  gender: 'm' | 'f';
}

type UserKey = keyof User; // 'id' | 'name' | 'age' | 'gender'

const uk: UserKey = 'id';
const uk2: UserKey = 'coupon'; // ERR
```

### Partial<T>

- 타입의 프로퍼티를 전부 Optional 로 변경 하는 키워드

```ts
interface User {
  id: number;
  name: string;
  age: number;
  gender: 'm' | 'f';
}

// ERR
let admin: User = {
  id: 1,
  name: 'boob',
};

// OK
let admin2: Partial<User> = {
  id: 1,
  name: 'boob',
};
```

### Required<T>

- 타입의 모든 프로퍼티를 필수로 변경

```ts
interface UserOptional {
  id: number;
  name: string;
  age?: number;
}

// ERR
let admin3: Required<UserOptional> = {
  id: 1,
  name: 'Bob',
};

// OK
let admin4: Required<UserOptional> = {
  id: 1,
  name: 'Bob',
  age: 12,
};
```

### Readonly<T>

- 최초 할당만 가능하고, 수정이 불가능
- Type 계의 const

```ts
interface UserReadonly {
  id: number;
  name: string;
  age?: number;
}

let admin5: Readonly<UserReadonly> = {
  id: 1,
  name: 'Bob',
  age: 12,
};

admin5.id = 5; // ERR
```

### Record<K, T>

- 키와 타입을 연관지어 타입을 생성하는 키워드

```ts
interface Score {
  '1': 'A' | 'B' | 'C' | 'D';
  '2': 'A' | 'B' | 'C' | 'D';
  '3': 'A' | 'B' | 'C' | 'D';
  '4': 'A' | 'B' | 'C' | 'D';
}

const score = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
};

const scoreRecord: Record<'1' | '2' | '3' | '4', 'A' | 'B' | 'C' | 'D'> = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
};

interface UserRecord {
  id: number;
  name: string;
  age: number;
}

function isValid(user: UserRecord): Record<keyof UserRecord, boolean> {
  const result = {
    id: user.id > 0,
    name: user.name !== '',
    age: user.age > 19,
  };
  return result;
}

// 또는
function isValid(user: UserRecord) {
  const result: Record<keyof UserRecord, boolean> = {
    id: user.id > 0,
    name: user.name !== '',
    age: user.age > 19,
  };
  return result;
}
```

### Pick<T, K>

- 타입에서 특정 프로퍼티만 가져오는 키워드

```ts
interface UserPick {
  id: number;
  name: string;
  age: number;
}

const admin6: Pick<UserPick, 'id' | 'name'> = {
  id: 1,
  name: 'tetz',
};
```

### Omit<T, K>

- 타입에서 특정 프로퍼티만 제외하는 키워드

```ts
interface UserOmit {
  id: number;
  name: string;
  age: number;
}

const admin7: Omit<UserOmit, 'id' | 'age'> = {
  name: 'tetz',
};
```

### Exclude<T1, T2>

- 특정 타입에서 다른 타입의 요소를 뺀 타입을 사용

```ts
type T1 = number | string | boolean;
type T2 = boolean;
type T3 = Exclude<T1, T2>; // number | string

type UserT1 = {
  id: number;
  name: string;
  age: number;
  gender: 'm' | 'f';
};

type UserT2 = {
  age: number;
  gender: 'm' | 'f';
};

type UserT3 = {
  [K in Exclude<keyof UserT1, keyof UserT2>]: UserT1[K];
};
const admin8: UserT3 = {
  id: 1,
  name: 'tetz',
};
```

### NonNullable<Type>

- null 과 undefined 를 제외하고 타입을 생성

```ts
type T4 = number | string | null | undefined;
type T5 = NonNullable<T4>; // string | number
```
