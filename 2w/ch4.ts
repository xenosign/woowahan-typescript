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
