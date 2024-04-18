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

- 이름이 다른 객체라도 가진 속성이 동일하다면 타입 스크립트는 서로 호환이 가능한 동일한 타입으로 판단

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

- 클래스로 구현한 코드

```ts
class Person {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

class Developer {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

function greet(p: Person) {
  console.log(`Hello, I'm ${p.name}`);
}

const developer = new Developer("tetz", 40);

greet(developer); // Hello, I'm tetz
```

### 2.2.4 자바스크립트를 닮은 타입스크립트

- 타입스크립트는 타입을 좀 더 강하게 강제하지만, 결국 자바스크립트의 슈퍼셋이므로 객체의 비교에 있어서 명목적 타이핑이 아닌 덕 타이핑을 기반으로 한다
- 다만, 타입스크립트는 컴파일 단계에서 타이핑을 검사하여 런타임에 타이핑을 검사하는 자바스크립트의 덕 타이핑의 문제를 해결한다

### 2.2.5 구조적 타이핑의 결과

- 구조적 타이핑은 결국 강제에 있어서 한계를 가지기 때문에 문제 발생이 가능, 따라서 타입스크립트는 명목적 타이핑 언어의 특징을 가미한 유니온 같은 방법을 채택하였다

### 2.2.6 타입스크립트의 점진적 타입 확인

- 컴파일 타입에 타입을 검사하지만, 피룡에 따라 타입 선언 생략을 허용하는 방식
- 생략 된 경우는 동적으로 검사를 수행하고 필요에 따라 암시적 타입 변환이 일어난다

### 2.2.7 자바스크립트 슈퍼엣으로서의 타입스크립트

### 2.2.8 값 vs 타입

- 값과 타입은 타입스크립트에서 별도의 네임스페이스에 존재하여 서로 이름이 같아도 문제가 발생하지 않는다
- 타입스크립트가 컴파일이 완료 되면 타입으로만 사용되는 요소는 정보가 사라진다

\*\* [p. 62]const enum? 개념 잡기

### 2.2.9 타입을 확인하는 방법

-
