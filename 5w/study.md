# 8장. JSX에서 TSX로

## 8.1 리액트 컴포넌트의 타입

### 8.1.1 클래스컴포넌트 타입

- React.Component 와 React.PureComponent 를 상속 받아서 사용
- props 의 상태 타입을 제네릭으로 받는다

### 8.1.2 함수 컴포넌트 타입

- React.FC 와 React.VFC 로 타입을 지정하여 컴포넌트 사용
- v16 까지는 React.VFC 의 경우 children props 가 없다
- v18 에 이르러 React.FC 에서도 children 이 사라져서 별도로 타이핑이 필요

### 8.1.3 Children props 타입 지정

```ts
type PropsWithChildren<P> = P & { children?: ReactNode | undfined };
```

- 보편적으로 ReactNode 또는 undfined 사용

### 8.1.4 render 메서드와 함수 컴포넌트의 반환 타입 - React.ReactElement vs JSX.Element vs React.ReactNode

- ReactNode ⊃ ReactElement ⊃ Jsx.Element 의 포함 관계를 가진다

### 8.1.5 ReactElement, ReactNode, JSX.Element 활용하기

#### ReactElement

- JSX 는 리액트 엘리먼트를 생성하기 위한 문법이며, JSX 문법을 Babel 이 트랜스파일하여 createElement 메서드 호출문으로 리액트 엘리먼트를 생성
- 따라서 ReactElement 타입은 JSX의 createElement 로 인해 생성된 리액트 엘리먼트를 나타내는 타입

```tsx
const element = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello, world!'
);

// 주의: 다음 구조는 단순화되었다
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!',
  },
};

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {
      // ...
    }
    // ...
  }
}
```

### ReactNode

- ReactChild 를 포함하여 boolean, null, undefined 등 훨씬 넓은 범주로써 render 함수가 반환 가능한 모든 형태

#### JSX.Element

- ReactElement 의 특정 타입으로 props 와 타입 필드를 any 로 가지는 타입

### 8.1.6 사용 예시

#### ReactNode

- prop 을 활용하여 리액트 컴포넌트가 다양한 형태를 가지게 할 때 유용하다

```tsx
type PropsWithChildren<P = unkown> = P & {
  children?: ReactNode | undefined;
};

interface MyProps {
  // ...
}

type MyComponentProps = PropsWithChildren<MyProps>;
```

#### JSX.Element

- props 를 전달받아 render props 패턴으로 컴포넌트 구현할 때 유용
- icon prop 을 JSX.Element 타입으로 선언하여 해당 prop 이 JSX 문법만 사용하도록 강제

```tsx
interface Props {
  icon: JSX.Element;
}

const Item = ({ icon }: Props) => {
  // prop으로 받은 컴포넌트의 props에 접근할 수 있다
  const iconSize = icon.props.size;

  return <li>{icon}</li>;
};

// icon prop에는 JSX.Element 타입을 가진 요소만 할당할 수 있다
const App = () => {
  return <Item icon={<Icon size={14} />} />;
};
```

#### ReactElement

- JSX.Element 는 암시적으로 props 가 any 타입으로 지정이 되므로, ReactElement 를 사용하여 직접 props 타입을 명시 할 수 있다
- 실제적으로 JSX.Element 를 사용했을 때와 달리 icon.props 에 접근하면 직접 지정한 타입이 추론 된 것 확인 가능

```tsx
interface IconProps {
  size: number;
}

interface Props {
  // ReactElement의 props 타입으로 IconProps 타입 지정
  icon: React.ReactElement<IconProps>;
}

const Item = ({ icon }: Props) => {
  // icon prop으로 받은 컴포넌트의 props에 접근하면, props의 목록이 추론된다
  const iconSize = icon.props.size;

  return <li>{icon}</li>;
};
```

### 8.1.7 리액트에서 기본 HTML 요소 타입 활용하기

#### DetailedHTMLProps 와 ComponentWithoutRef

- DetailedHTMLProps 를 활용하면 아래와 같이 간단하기 HTML 태그의 속성고 호환되는 타입 선언이 가능

```tsx
type NativeButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type ButtonProps = {
  onClick?: NativeButtonProps['onClick'];
};
```

- ComponentWithoutRef 도 마찬가지로 HTML 의 특정 속성이 호환되는 타입 선언이 가능하다

```tsx
type NativeButtonType = React.ComponentPropsWithoutRef<'button'>;
type ButtonProps = {
  onClick?: NativeButtonType['onClick'];
};
```

#### 언제 ComponentWithoutRef 를 사용하면 좋을까

- 클래스형 컴포넌트와 달리 함수형 컴포넌트의 경우 props 받은 ref 가 button 컴포넌트를 제대로 바라보지 못하는 이슈가 존재
- React.forwardRef 메서드르 활용하면 이러한 제약 극복이 가능
- 반면, ComponentWithoutRef 는 ref 를 포함하지 않아 DetailedHTMLProps, HTMLProps, ComponentPropsWithRef 같이 ref 를 포함하여 위와 같은 이유로 예기치 못한 오류를 발생 시키는 것을 예방할 수 있다

## 8.2 타입스크립트로 리액트 컴포넌트 만들기

### 8.2.1 JSX 로 구현된 Select 컴포넌트

- JSX 로 구성된 컴포넌트의 경우는 각 속성에 어떤 타입을 전달해야 할 지 명확하게 알기 어렵다

### 8.2.2 JSDoc 으로 일부 타입 지정하기

### 8.2.3 props 인터페이스 적용하기

- options 의 타입을 정의하여 option 의 유형을 명확히 하고, onChange 에는 리턴 타입이 void 임을 명시

```tsx
type Option = Record<string, string>; // {[key: string]: string}

interface SelectProps {
  options: Option;
  selectedOption?: string;
  onChange?: (selected?: string) => void;
}

const Select = ({
  options,
  selectedOption,
  onChange,
}: SelectProps): JSX.Element => {
  //...
};
```

### 8.2.4 리액트 이벤트

- 리액트의 이벤트는 브라우저의 일반적인 이벤트가 DOM 에 등록되어 실행되는 것과 달리 ReactNode 에서 실행이 되는 형태이므로 브라우저와 동일하게 작동하지 않는다

### 8.2.5 훅에 타입 추가하기

- 타입을 명확하게 지정하지 않으면 TS 가 타입을 string 등으로 추론하여 입력하면 안되는 값이 입력 될 수 있으므로 명확하게 타입을 지정해야 한다
- keyof typeof 를 사용하여 특정 타입의 키 값을 유니온 값으로 추출하여 사용

```tsx
// 타입이 string 으로 추론되어 원치 않는 값이 넘어가는 경우
const [fruit, changeFruit] = useState('apple');

// error가 아님
const func = () => {
  changeFruit('orange');
};

// keyof typeof 로 타입을 유니온 형태로 강제하는 코드
type Fruit = keyof typeof fruits; // 'apple' | 'banana' | 'blueberry';
const [fruit, changeFruit] = useState<Fruit | undefined>('apple');

// 에러 발생
const func = () => {
  changeFruit('orange');
};
```

\*\* [p.274] 이번에는 제대로 keyof typeof 를 썼군여 ㅋㅋㅋㅋ

### 8.2.6 제네릭 컴포넌트 만들기

- Selct 컴포넌트에 전달되는 props 의 타입을 기반으로 타입이 추론되어, 잘못된 옵션을 전달하면 에러가 발생하는 타입 지정

```tsx
interface SelectProps<OptionType extends Record<string, string>> {
  options: OptionType;
  selectedOption?: keyof OptionType;
  onChange?: (selected?: keyof OptionType) => void;
}

const Select = <OptionType extends Record<string, string>>({
  options,
  selectedOption,
  onChange,
}: SelectProps<OptionType>) => {
  // Select component implementation
};
```

### 8.2.7 HTMLAttributes, ReactProps 적용하기

- className, id 와 같은 속성은 리액트에서 제공하는 타입을 사용하면 더 정확하게 타입 설정이 가능

```tsx
type ReactSelectProps = React.ComponentPropsWithoutRef<'select'>;

interface SelectProps<OptionType extends Record<string, string>> {
  id?: ReactSelectProps['id'];
  className?: ReactSelectProps['className'];
  // ...
}
```

### 8.2.8 styled-components 를 활용한 스타일 정의

- CSS-in-JS 라이브러리인 styled-components 를 활용하면 컴포넌트 스타일에 대한 타입을 추가 가능

```tsx
// 필요한 스타일 정의
const theme = {
  fontSize: {
    default: '16px',
    small: '14px',
    large: '18px',
  },
  color: {
    white: '#FFFFFF',
    black: '#000000',
  },
};

type Theme = typeof theme;
type FontSize = keyof Theme['fontSize'];
type Color = keyof Theme['color'];

// 부모 컴포넌트에서 원하는 스타일 적용을 위해 StyleSelect 컴포넌트에서 SelectStyleProps 타입을 상속
interface SelectStyleProps {
  color: Color;
  fontSize: FontSize;
}

const StyledSelect = styled.select<SelectStyleProps>`
  color: ${({ color }) => theme.color[color]};
  font-size: ${({ fontSize }) => theme.fontSize[fontSize]};
`;

// Partial 을 사용하여 전달한 스타일 타입을 선택적으로 설정이 가능
interface SelectProps extends Partial<SelectStyleProps> {}

const Select = <OptionType extends Record<string, string>>({
  fontSize = 'default',
  color = 'black',
}: SelectProps<OptionType>) => {
  return <StyledSelect fontSize={fontSize} color={color} />;
};
```

### 8.2.9 공변성과 반공변성

- 타입 A 가 B 의 서브 타입일 때 공변성을 가진다고 말한다. 그로 인해 타입은 보통 좁은 타입에서 넓은 타입으로 할당이 가능
- 일반적인 타입들은 공변성을 가지고 있으므로 좁은 타입에서 넓은 타입으로 할당이 가능
- 하지만 제네릭 타입을 가진 함수는 반공변성을 가지게 되어, 역으로 좁은 타입 `T<A>` 를 `T<B>` 에 적용이 불가능

```tsx
type PrintUserInfo<U extends User> = (user: U) => void;

let printUser: PrintUserInfo<User> = (user) => console.log(user.id);

let printMember: PrintUserInfo<Member> = (user) => {
  console.log(user.id, user.nickName);
};

printMember = printUser; // OK.
printUser = printMember; // Error - Property 'nickName' is missing in type 'User' but required in type 'Member'.
```

\*\* [p.280] 좁은 타입을 가지는 함수를 넓은 타입에 적용하려 하면 매개 변수에서 없는 부분이 발생하므로, 문제가 발생하기 때문으로 추측

\*\* [p.280] 그런데 onChange 의 경우는 화살표 함수와 일반 함수의 차이인데 왜? 화살표 함수는 반공변성을 띠고, 일반 함수는 이변성을 띨까?

# 9장. 훅

## 9.1 리액트 훅

- 리액트 훅 추가 이전에는 프로젝트 규모가 커질 수록 생명 주기 함수에서만 로직을 구현해야 했기 때문에, 비슷한 로직을 재사용 할 수 없는 문제 그리고 사이드 이펙트가 발생
- 리액트 훅의 도입으로 비지니스 로직을 재사용하거나 테스트 하는 것이 용이해짐

### 9.1.1 useState

- useState 와 타입 스크립트를 사용하면 잘못된 속성의 추가로 인하여 예기치 못한 사이드 이펙트가 생기는 것을 방지할 수 있다

```tsx
import { useState } from "react";

interface Member {
  name: string;
  age: number;
}

const MemberList = () => {
  const [memberList, setMemberList] = useState<Member[]>([]);

  // member의 타입이 Member 타입으로 보장된다
  const sumAge = memberList.reduce((sum, member) => sum + member.age, 0);

  const addMember = () => {
  // 🚨 Error: Type ‘Member | { name: string; agee: number; }’
  // is not assignable to type ‘Member’
    setMemberList([
      ...memberList,
      {
        name: "DokgoBaedal",
        agee: 11,
      },
    ]);
  };

  return (
    // ...
  );
};
```

### 9.1.2 의존성 배열을 사용하는 훅

#### useEffect 와 useLayoutEffect

```tsx
function useEffect(effect: EffectCallback, deps?: DependencyList): void;
type DependencyList = ReadonlyArray<any>;
// Destructor 는 컴포넌트 마운트가 해제 될 때 실행되는 함수, deps 배열의 변경에 따라 실행이 반복
type EffectCallback = () => void | Destructor;
```

#### useMemo 와 useCallback

```tsx
type DependencyList = ReadonlyArray<any>;

function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
function useCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T;
```

### 9.1.3 useRef

#### 자식 컴포넌트에 ref 전달하기

- forwardRef 를 사용
- ForwardedRef 에는 MutableRefObject 만 올 수 있으므로 RefObject 보다 넓은 타입이기 때문에 부모 컴포넌트에서의 ref 선언과 상관 없이 자식 컴포넌트가 ref 를 사용 가능

```tsx
type ForwardedRef<T> =
  | ((instance: T | null) => void)
  | MutableRefObject<T | null>
  | null;
```

#### useImperativeHandle

- 해당 훅을 활용하면 부모 컴포넌트에서 ref 를 통해 자식 컴포넌트에서 정의한 커스터마이징 메서드를 호출 가능

```tsx
// useImperativeHandle 를 사용한 메서드 커스터마이징
type CreateFormHandle = Pick<HTMLFormElement, 'submit'>;

type CreateFormProps = {
  defaultValues?: CreateFormValue;
};

const JobCreateForm: React.ForwardRefRenderFunction<
  CreateFormHandle,
  CreateFormProps
> = (props, ref) => {
  // useImperativeHandle Hook을 사용해서 submit 함수를 커스터마이징한다
  useImperativeHandle(ref, () => ({
    submit: () => {
      /* submit 작업을 진행 */
    },
  }));

  // ...
};

// 자식 ref 를 불러와서 커스터마이징 된 메서드를 사용
const CreatePage: React.FC = () => {
  // `CreateFormHandle` 형태를 가진 자식의 ref를 불러온다
  const refForm = useRef<CreateFormHandle>(null);

  const handleSubmitButtonClick = () => {
    // 불러온 ref의 타입에 따라 자식 컴포넌트에서 정의한 함수에 접근할 수 있다
    refForm.current?.submit();
  };

  // ...
};
```

#### useRef 의 여러 가지 특성

## 9.2 커스텀 훅

### 9.2.1 나만의 훅 만들기

```tsx
import { useState } from 'react';

const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  return { value, onChange };
};
```

### 9.2.2 타입스크립트로 커스텀 훅 강화하기

```tsx
import { useState, useCallback, ChangeEvent } from 'react';

// ✅ initialValue에 string 타입을 정의
const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  // ✅ 이벤트 객체인 e에 ChangeEvent<HTMLInputElement> 타입을 정의
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return { value, onChange };
};

export default useInput;
```

# 10장. 상태 관리

## 10.1 상태 관리

### 10.1.1 상태

- 지역 상태(useState, useReducer) / 전역 상태 / 서버 상태(React Query, SWR)

### 10.1.2 상태를 잘 관리하기 위한 가이드

#### 시간이 지나도 변하지 않는다면 상태가 아니다

- 객체의 참조 동일성을 유지하기 위해 useMemo 를 사용하는 것은 성능 향상을 위해 사용하는 것이 아니므로 올바른 사용 방법이 아니다
- `useState(() => new Store())` 같이 초깃값을 콜백으로 지정하는 지연 초기화 방식을 도입하여 비용을 줄이는 것이 좋다
- 제일 좋은 방법은 렌더링에 영향을 받지 않는 useRef 를 사용하는 것이 좋다. 다만 렌더링 마다 새로운 인스턴스 생성을 막기 위해 아래와 같이 작성을 추천

```tsx
import { useRef } from 'react';

const store = useRef<Store>(null);

if (!store.current) {
  store.current = new Store();
}
```

\*\* [p.309] 지연 초기화 사용 팁은 좋으나 당연한 소리를....

#### 파생된 값은 상태가 아니다

- 리액트 앱에서의 상태도 SSOT(Single Source Of Truth) 를 적용해야 한다
- props 로 받은 데이터의 동기화를 위해 useEffect 를 사용해서는 안되며, 동일 출처에서 데이터를 사용할 수 있도록 상태 끌어올리기(Lifting State Up) 기법을 사용한다

```tsx
import React, { useState } from 'react';

type UserEmailProps = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};

const UserEmail: React.VFC<UserEmailProps> = ({ email, setEmail }) => {
  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  return (
    <div>
      <input type="text" value={email} onChange={onChangeEmail} />
    </div>
  );
};
```

- 또한 내부 상태 동기화를 위해서 모든 값을 state 로 지정하는 것이 아니라, 일반 변수로 변경하여 특정 state 가 변경 시 값을 계산 후 변수에 담는 방법을 통해 단일 출처를 유지할 수 있다
- 성능적 측면으로는 useMemo 를 사용하여 결과를 메모제이션 하면 성능 개선도 가능하다

#### useState vs useReducer, 어떤 것을 사용해야 할까?

- 구조가 복잡하고 클 경우 useState 보다는 useReducer 를 통해 관리하는 편이 좋다

\*\* [p.313] 당연한 소리를2... ㅋㅋㅋ

### 10.1.3 전역 상태 관리와 상태 관리 라이브러리

#### Context API

```tsx
import { useReducer } from 'react';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateProvider.Provider value={{ state, dispatch }}>
      <ComponentA />
      <ComponentB />
    </StateProvider.Provider>
  );
}
```

- 위와 같이 Context API 를 통해 전역 상태 관리를 하는 것은 주입된 값이나 참조가 변경 될 때마다 모든 컴포넌트가 리렌더링 되기 때문에 대규모 어플리케이션에서는 권장하지 않는다
- 적절한 관심사 분리를 통해 구성은 가능하나 불필요한 리렌더링과 상태 복잡도의 증가를 막기는 어렵다
