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
