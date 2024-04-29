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
