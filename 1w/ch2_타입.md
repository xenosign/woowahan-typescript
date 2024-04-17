# 2장. 타입

## 2.1 타입이란

### 2.1.4 강타입과 약타입

- 암묵적 타입 변환 여부에 따라 결정
- 강타입 : 암묵적 변환 X / C++, Java, JS
- 약타입 : 암묵적 변환 O / Python, Ruby, TS

## 2.2 타입 스크립트의 타입 시스템

### 2.2.1 타입 어노테이션 방식

\*\* [p.42] 애너테이션? 어노테이션? ㅋㅋㅋㅋ

- 변수 이름 뒤에 : type 을 붙여서 명시

```ts
let isDone: boolean = false;
let list: number[] = [1, 2, 3];
let x: [string, number];
```

### 2.2.2 구조적 타이핑

- TS 는 다른 언어와 달리 구조를 기반으로 타입을 구분

```ts
interface Developer {
  faceValue: number;
}

interface BankNote {
  faceValue: number;
}

let developer: Developer = { faceValue: 52 };
let bankNote: BankNote = { faceValue: 10000 };

developer = bankNote; // OK
bankNote = developer; // OK
```

### 2.2.3 구조석 서브타이핑

- TS 는 특정 값이 타입을 동시에 가질 수 있다

```ts
interface Pet {
  name: string;
}

interface Cat {
  name: string;
  age: number;
}

let pet: Pet;
let cat: Cat = { name: "Kitty", age: 2 };

pet = cat; // OK
```
