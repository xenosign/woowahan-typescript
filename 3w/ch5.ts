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

// 배민 예시 코드
interface PayMethodBaseFromRes {
  financialCode: string;
  name: string;
}

interface Bank extends PayMethodBaseFromRes {
  fullName: string;
}

interface Card extends PayMethodBaseFromRes {
  appCardType?: string;
}

type PayMethodInterface = {
  companyName: string;
  // ...
};

type PayMethodInfo<T extends Bank | Card> = T & PayMethodInterface;

type PayMethodType = PayMethodInfo<Card> | PayMethodInfo<Bank>;

// export const useGetRegisteredList = (
//   type: 'card' | 'appcard' | 'bank'
// ): UseQueryResult<PayMethodType[]> => {
//   const url = `baeminpay/codes/${type === 'appcard' ? 'card' : type}`;

//   const fetcher = fetcherFactory<PayMethodType[]>({
//     onSuccess: (res) => {
//       const usablePocketList =
//         res?.filter(
//           (pocket: PocketInfo<Card> | PocketInfo<Bank>) =>
//             pocket?.useType === 'USE'
//         ) ?? [];
//       return usablePocketList;
//     },
//   });

//   const result = useCommonQuery<PayMethodType[]>(url, undefined, fetcher);

//   return result;
// };

// type PayMethodType2<T extends 'card' | 'appcard' | 'bank'> = T extends
//   | 'card'
//   | 'appcard'
//   ? Card
//   : Bank;

// export const useGetRegisteredList = <T extends 'card' | 'appcard' | 'bank'>(
//   type: T
// ): UseQueryResult<PayMethodType2<T>[]> => {
//   const url = `baeminpay/codes/${type === 'appcard' ? 'card' : type}`;

//   const fetcher = fetcherFactory<PayMethodType2<T>[]>({
//     onSuccess: (res) => {
//       const usablePocketList =
//         res?.filter(
//           (pocket: PocketInfo<Card> | PocketInfo<Bank>) =>
//             pocket?.useType === 'USE'
//         ) ?? [];
//       return usablePocketList;
//     },
//   });

//   const result = useCommonQuery<PayMethodType2<T>[]>(url, undefined, fetcher);

//   return result;
// };

const testFunc = (param: 'card' | 'bank'): void => {
  console.log(param);
};

// testFunc('appcard');

type MyType1<T> = T extends infer R ? R : null;

const a1: MyType1<number> = 123;
console.log(typeof a1); //number

// // 사실 위와 같은 코드는 아래와 동일하다
// type MyNormalType<T> = T extends number ? number : null;

// type MyInferType<T> = T extends infer R ? R : null;

// // 기존에 지정한 union 이외의 타입을 지정하려 하면 아래와 같이 에러 발생 -> 따라서 타입이 추가되면 MyNormalType 에 조건부에 union 타입을 지속적으로 추가 필요
// const testNormal: MyNormalType<string> = 'string';

// // 전달 받은 타입을 infer 로 추론한 R 을 사용하여 타입을 지정하므로, 타입이 추가될 때마다 union 타입을 추가할 필요가 없음. 유틸리티 타입으로 활용 가능
// const testInfer: MyInferType<string> = 'string';

type FuncReturnType<T extends (...args: any) => any> = string | number; // 유니온 타입

function fn(num: number) {
  return num;
}

const a: ReturnType<typeof fn> = 6;
console.log(a); // 6

// type UnpackMenuNames<T extends ReadonlyArray<MenuItem>> =
//   T extends ReadonlyArray<infer U>
//     ? U extends MainMenu
//       ? U['subMenus'] extends infer V
//         ? V extends ReadonlyArray<SubMenu>
//           ? UnpackMenuNames<V>
//           : U['name']
//         : never
//       : U extends SubMenu
//       ? U['name']
//       : never
//     : never;

type TestType1<T> = {
  test: string;
  test2: T;
};

type InnerType1 = {
  test: string;
  test2: number;
};

type UnpackTest<T extends TestType1<InnerType1>> = T extends TestType1<infer U>
  ? U extends InnerType1
    ? U['test'] extends infer V
      ? V extends string
        ? string
        : U['test2']
      : null
    : null
  : null;

type Direction =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight';

type Vertical = 'top' | 'bottom';
type Horizon = 'left' | 'right';

type DirectionTemplete = Vertical | `${Vertical}${Capitalize<Horizon>}`;

// type CreditCard = {
//   card: string;
// };

// type Account = {
//   account: string;
// };

// function withdraw(type: CreditCard | Account) {
//   // Do sth
// }

// withdraw({ card: 'hyundai', account: 'hana' });

// type CreditCard = {
//   type: 'card';
//   card: string;
// };

// type Account = {
//   type: 'account';
//   account: string;
// };

// function withdraw(type: CreditCard | Account) {
//   // Do sth
// }

// withdraw({ type: 'card', card: 'hyundai', account: 'hana' });

// type PickOne<T> = {
//   [P in keyof T]: Record<P, T[P]> &
//     Partial<Record<Exclude<keyof T, P>, undefined>>;
// }[keyof T];

// type PickOne1<T> = {
//   [P in keyof T]: T[P] & Partial<Record<Exclude<keyof T, P>, undefined>>;
// }[keyof T];

// type PickOne2<T> = T extends infer U ? { [K in keyof U]: U[K] } : undefined;

// type CreditCard = {
//   card: string;
// };

// type Account = {
//   account: string;
// };

// type CardOrAccount = PickOne<CreditCard | Account>;

// type CardOrAccount1 = PickOne1<CreditCard | Account>;

// type CardOrAccount2 = PickOne2<CreditCard | Account>;

// function withdraw(type: CardOrAccount) {
//   // Do sth
// }

// withdraw({ card: 'hyundai' });

// function withdraw1(type: CardOrAccount1) {
//   // Do sth
// }

// withdraw1({ card: 'hyundai' });

// function withdraw2(type: CardOrAccount2) {
//   // Do sth
// }

// withdraw2({ card: 'hyundai' });

// type Test<T> = {
//   [P in keyof T]: T[P];
// }[keyof T];

// type TestType = Test<Account>;

// const arr: TestType = [{ account: '1' }];

// type CreditCard = {
//   card: string;
// };

// type Account = {
//   account: string;
// };
// type One<T> = { [P in keyof T]: Record<P, T[P]> }[keyof T];

// type ExcludeOne<T> = {
//   [P in keyof T]: Partial<Record<Exclude<keyof T, P>, undefined>>;
// }[keyof T];

// type CardAndAccount = CreditCard & Account;

// type PickOne<T> = One<T> & ExcludeOne<T>;

// type PickOneType = PickOne<CardAndAccount>;

// const testObj: PickOneType = { card: 'str' };

// type Two<T> = { [P in keyof T]: Record<P, T[P]> };

// type TestTwo = Two<{ card: string }>;

// const twoObj: TestTwo = { card: { card: 'test' } };

// type One<T> = { [P in keyof T]: Record<P, T[P]> }[keyof T];
// type ExcludeOne<T> = {
//   [P in keyof T]: Partial<Record<Exclude<keyof T, P>, undefined>>;
// }[keyof T];

// type PickOne<T> = One<T> & ExcludeOne<T>;

// type CreditCard = {
//   card: string;
// };

// type Account = {
//   account: string;
// };

// type CardOrAccount = PickOne<CreditCard & Account>;

// function withdraw(type: CardOrAccount) {
//   // do sth
// }

// withdraw({ card: 'card' });

// type CreditCard = {
//   card: string;
// };

// type Account = {
//   account: string;
// };

// type PickOne<T> = {
//   [P in keyof T]: Record<P, T[P]> &
//     Partial<Record<Exclude<keyof T, P>, undefined>>;
// }[keyof T];

// type CardOrAccount = PickOne<CreditCard & Account>;

// function withdraw(type: CardOrAccount) {
//   // Do sth
// }

// withdraw({ card: 'hyundai' }); // ERR 발생, never 타입으로 설정

// 예시
type CreditCard = {
  card: string;
};

type Account = {
  account: string;
};

type One<T> = { [P in keyof T]: Record<P, T[P]> }[keyof T];

// 위의 코드에서 3)의 상태에서 TestOne 은 card: Record<'card', string> | account: Record<'age', string> 이라는 유니온 값을 가짐
// 그런데 이러면 속성 값을 둘 다 가져도 걸러내지 못하기 때문에 ExcludeOne 이라는 타입을 합쳐줘서 필요없는 속성에는 undefined 를 강제 시켜줘야함

type ExcludeOne<T> = {
  [P in keyof T]: Partial<Record<Exclude<keyof T, P>, undefined>>;
}[keyof T];

// PickOne 은 전달 받은 속성 값을 전부 가진 타입과, 공통되지 않은 속성은 undefined 로 강제되는 타입의 합집합의 형태를 가진다
type PickOne<T> = One<T> & ExcludeOne<T>;

// 여기서 조건이 & 로 변경 시발!!!!!
type CardOrAccount = PickOne<CreditCard & Account>; // 합집합의 속성이 각기 반환된다

function withdraw(type: CardOrAccount) {
  // do sth
}

withdraw({ card: 'card' });

// type NonNullable<T> = T extends null | undefined ? never : T;

function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

const nullType: null = null;
const notNullType: string = 'string';

console.log(isNonNullable(nullType));
console.log(isNonNullable(notNullType));
