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

\*\* [p.154] 아 설명 진짜...... -\_-+

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

\*\* [p.156] 반환타입 이 그림에 의미는 뭔가요? 그리고 어떻게 일겅야 하는거죠?
