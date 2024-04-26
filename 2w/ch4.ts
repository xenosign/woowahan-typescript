// interface BaseMenuItem {
//   itemName: string | null;
//   itemImgUrl: string | null;
//   itemDiscountAmount: number;
//   stock: number | null;
// }

// interface BaseCartItem extends BaseMenuItem {
//   quantity: number;
// }

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

const bedalInfo: BedalProgress = {
  orderId: '1',
  price: 100,
  time: 100,
  distance: '300',
};

logBedalInfo(bedalInfo);

// function getDeliveryDistance(step: CookingStep | DeliveryStep) {
//   return step.distance; // ERR
// }

type IdType = string | number;
type Numeric = number | boolean;

type Universal = IdType & Numeric;

const universalVal: Universal = 1;

interface DeliveryTip {
  tip: number;
}

// interface Filter extends DeliveryTip {
//   tip: string;
// }

// type DeliveryTipType = {
//   tip: number;
// };

// type FilterType = DeliveryTip & {
//   tip: string;
// };

// const filterVal: FilterType = {
//   tip: a,
// };

// 1. 타입에 속성을 추가하여 해결

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

const getTextFromMenu = (menuList: Menu[]) => {
  return menuList.filter((menu) => menu.text != '');
};

console.log(getTextFromMenu(specialMenuList));

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

const replaceHyphen: (date: string | Date) => string | Date = (date) => {
  if (typeof date === 'string') {
    return date.replace(/-/g, '/');
  }

  return date;
};

const replaceHyphen2 = (date: string | Date): string | Date => {
  if (typeof date === 'string') {
    return date.replace(/-/g, '/');
  }

  return date;
};

interface Range {
  start: Date;
  end: Date;
}

interface DatePickerProps {
  selectedDates?: Date | Range;
}

// const DatePicker = ({ selectedDates }: DatePickerProps) => {
//   const [selected, setSelected] = useState(convertToRange(selectedDates));
// };

// export function convertToRange(selected?: Date | Range): Range | undefined {
//   return selected instanceof Date
//     ? { start: selected, end: selected }
//     : selected;
// }

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

// const NoticeDialog: React.FC<NoticeDialogProps> = (props) => {
//   if ('cookieKey' in props) return <NoticeDialogWithCookie {...props} />;
//   return <NoticeDialogProps {...props} />;
// };

// const isDestinationCode = (x: string): x is DestinationCode =>
//   destinationCodeList.includes(x);

// const getAvailableDestinationNameList = async (): Promise<
//   DestinationName[]
// > => {
//   const data = await AxiosRequest<string[]>('get', '.../destinations');
//   const destinationNames: DestinationName[] = [];
//   data?.forEach((str) => {
//     if (isDestinationCode(str)) {
//       destinationNames.push(DestinationNameSet[str]);
//       /* isDestinationCode의 반환 값에 is를 사용하지 않고 boolean이라고 한다면 다음 에러가 발생한다
// - Element implicitly has an ‘any’ type because expression of type ‘string’ can’t be used to index type ‘Record<"MESSAGE_PLATFORM" | "COUPON_PLATFORM" | "BRAZE", "통합메시지플랫폼" | "쿠폰대장간" | "braze">’ */
//     }
//   });
//   return destinationNames;
// };

// type TextError = {
//   errorCode: string;
//   errorMessage: string;
// };

// type ToastError = {
//   errorCode: string;
//   errorMessage: string;
//   toastShowDuration: number;
// };

// type AlertError = {
//   errorCode: string;
//   errorMessage: string;
//   onConfirm: () => void;
// };

// type ErrorFeedbackType = TextError | ToastError | AlertError;
// const errorArr: ErrorFeedbackType[] = [
//   { errorCode: '100', errorMessage: '텍스트 에러' },
//   { errorCode: '200', errorMessage: '토스트 에러', toastShowDuration: 3000 },
//   { errorCode: '300', errorMessage: '얼럿 에러', onConfirm: () => {} },
// ];

// // 아래의 요소는 타입에 어긋나지만 JS 는 덕타이핑 언어이므로 별도의 타입 에러가 발생하지 않는 문제 발생
// const errArr: ErrorFeedbackType[] = [
//   {
//     errorCode: '999',
//     errorMessage: '잘못된에러',
//     toastShowDuration: 3000,
//     onConfirm: () => {},
//   },
// ];

type TextError = {
  errorType: 'TEXT';
  errorCode: string;
  errorMessage: string;
};

type ToastError = {
  errorType: 'Toast';
  errorCode: string;
  errorMessage: string;
  toastShowDuration: number;
};

type AlertError = {
  errorType: 'Alert';
  errorCode: string;
  errorMessage: string;
  onConfirm: () => void;
};

type ErrorFeedbackType = TextError | ToastError | AlertError;

const errArr: ErrorFeedbackType[] = [
  {
    errorType: 'TEXT',
    errorCode: '999',
    errorMessage: '잘못된에러',
    // toastShowDuration: 3000, // errorType: 'TEXT' 로 인하여 ERR 발생
    // onConfirm: () => {}, // errorType: 'TEXT' 로 인하여 ERR 발생
  },
];

// type ProductPrice = '10000' | '20000' | '5000';

// // type 의 값이 추가 될때 마다 함수의 조건도 추가되어야 하는 구조 -> 어느 한쪽이 잘못되면 예상치 못한 버그 발생 가능
// const getProductName = (productPrice: ProductPrice): string => {
//   if (productPrice === '10000') return '배민상품권 1만원';
//   if (productPrice === '20000') return '배민상품권 2만 원';
//   if (productPrice === '5000') return '배민상품권 5천 원'; // 조건 추가 필요
//   else {
//     return '배민상품권';
//   }
// };

type ProductPrice = '10000' | '20000' | '5000';
const getProductName = (productPrice: ProductPrice): string => {
  if (productPrice === '10000') return '배민상품권 1만 원';
  if (productPrice === '20000') return '배민상품권 2만 원';
  if (productPrice === '5000') return '배민상품권 5천 원';
  else {
    exhaustiveCheck(productPrice); // Error: Argument of type ‘string’ is not assign able to parameter of type ‘never’
    return '배민상품권';
  }
};

// 매개변수를 never 로 처리하여, getProductName 에서 early return 으로 처리되지 않아 exhaustiveCheck 가 실행이 되면 Type 에러
const exhaustiveCheck = (param: never) => {
  throw new Error('type error!');
};
