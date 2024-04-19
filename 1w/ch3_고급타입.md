# 3장. 고급 타입

## 3.1 타입스크립트만의 독자적 타입 시스템

### 3.1.1 any 타입

- JS 에 존재하는 모든 값을 오류 없이 받을 수 있다. 즉, 이전의 JS 의 기본적 사용 방법
- 사용을 지양해야할 패턴, noImplicitAny 옵션으로 강제 가능

#### 어쩔 수 없는 3가지 사례

- 개발 단계에서 임시로 갑 지정 필요 시
- 어떤 값을 받을지 또는 넘겨줄지 정할 수 없을 때
- 값을 예측할 수 없을 때 암묵적으로 사용

### 3.1.2 unknown 타입

- any 를 제외한 다른 타입으로 선언된 변수에는 할당 불가능
- 할당 시점에는 에러가 발생하지 않지만, 아무런 값이 할당 되지 않은채로 실행되면 컴파일 에러 발생
- any 는 무조건 넘어가지만, unknown 은 타입을 강제하여 버그 가능성을 줄일 수 있다

\*\* [p.86] 깨진 유리창 이론에 대해서 어찌 생각하시나요? 실제로 사례를 본적이 있나요?
\*\* [p.87] as unknown as Type 에 대해 왜 서로 싸우죠? ㅋㅋㅋ

### 3.1.3 void 타입

- JS 에서 리턴이 없으면 undefined 가 자동으로 반환, 따라서 void 사용 필요!
- 변수에도 할당이 가능, 단 undefined 또는 null 만 지정 가능

### 3.1.4 never 타입

- 값을 반환할 수 없는 타입으로, 명시적으로 구분하여 사용이 필요

#### 값을 반환할 수 없는 예

- 에러를 던지는 경우(throw 에 의한 에러)
- 무한히 함수가 실행되는 경우(무한 루프)

### 3.1.5 Array 타입

- Object.prototype.toString.call() 을 사용하면 Array 데이터 타입 확인 가능
- JS 와는 달리 TS 에서는 배열에 아무 데이터 타입만 넣는 것이 불가능 하며, 별도의 문법이 필요하므로 배울 필요가 있다

```ts
const array1: number[] = [1, 2, 3];
const array2: Array<number> = [1, 2, 3];
```

- 배열에 여러 타입을 관리하려면 유니온 타입을 사용

```ts
const array1: number[] | string[] = [1, 'str1'];
const array2: Array<number | string> = [2, 'str2'];
```

- 튜플은 이러한 TS 의 배열에 길이 제한까지 추가한 타입, 배열보다 강제성을 더 줄 수 있다

```ts
const tuple1: [number] = [1];
const tuple2: [number, string, boolean] = [1, 'str', true];
```

- 전개 연산자를 사용하여 튜플과 배열의 성질을 혼합하여 사용 가능

```ts
const httpStatusFromPaths: [number, string, ...string[]] = [
  400,
  'Bad Request',
  '/users/:id',
  '/users/:userId',
];
```

- 옵셔널 프로퍼티를 필요에 따라 사용 가능

```ts
const optionalTuple1: [number, number, number?] = [1, 2];
```

### 3.1.6 enum 타입

- 열거형 데이터 타입으로, 구조체를 만들 때 사용
- 각각의 열거 데이터에 0 부터 값을 삽입, 또는 명시 가능
- 문자열 상수를 만들어 타입 안정성, 가독성, 명확한 의미 전달 및 높은 응집력의 효과
- 단, TS 가 자동으로 추론한 값을 사용하는 것은 지양
- 단, 할당된 값을 넘어서는 범위의 경우 문제 발생의 여지가 있다
- enum 은 JS 로 변환시 IIFE 로 변환 되므로, 번들링의 사이즈가 증가하는 이슈 발생
  - const enum 또는 as const assertion 을 사용해서 해결 가능

```ts
enum ProgrammingLang {
  Typescript,
  Javascript,
  Java,
  Cplusplus = 12,
}

console.log(ProgrammingLang.Typescript); // 0
console.log(ProgrammingLang.Cplusplus); // 12
console.log(ProgrammingLang[200]); // undefined
```

- const enum 을 사용하면 정의되지 않은 데이터에 대한 접근 및 의도하지 않은 값의 할당을 방지할 수 있다

```ts
const enum NUMBER {
  ONE = 1,
  TWO = 2,
}

const myNum: NUMBER = 100; // ERR

const enum STRING_NUMBER {
  ONE = 'ONE',
  TWO = 'TWO',
}

const myStringNum: STRING_NUMBER = 'THREE'; // ERR
```

\*\* [p. 97] 이거 에러 나지 않나요?
