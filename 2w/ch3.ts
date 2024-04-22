type ProductItem = {
  id: number;
  name: string;
  type: string;
  price: number;
  imgUrl: string;
  quantity: number;
};

type ProductItemWithDiscount = ProductItem & { discountAmount: number };

type CardItem = {
  id: number;
  name: string;
  type: string;
  imgUrl: string;
};

type PromotionEventItem = ProductItem | CardItem;

const item: PromotionEventItem = {
  id: 1,
  name: '2',
  type: '3',
  imgUrl: '3',
  price: 1,
  quantity: 2,
};

const prontPromotionItem = (item: PromotionEventItem) => {
  console.log(item.name);
  //   console.log(item.quantity);
};

interface IndexSignatureEx {
  [key: string]: number | boolean;
  length: number;
  isValid: boolean;
  // name: string; // ERR, number 혹은 boolean 만 가능
}

type Example = {
  a: number;
  b: string;
  c: boolean;
};

type indexedAccess = Example['a'];
type indexedAccess2 = Example['a' | 'b'];
type indexedAccess3 = Example[keyof Example];

const indexedAccessVar: indexedAccess = 1;
const indexedAccessVar2: indexedAccess2 = 's';
const indexedAccessVar3: indexedAccess3 = false;

// type Generic<T> = T extends string[] ? string[] : never;

// const test: Generic<string[]> = ['str'];

const promotionList = [
  { type: 'product', name: 'chicken' },
  { type: 'product', name: 'pizza' },
  { type: 'card', name: 'cheer-up' },
];

// type ElementOf<T> = (typeof T)[number];
type ElementOf<T> = T extends any[] ? T[number] : never;

// ElementOf 타입 테스트
type PromotionElementType = ElementOf<typeof promotionList>; // { type: string; name: string; } | { type: string; name: string; }

const PromotionElementTypeObj: PromotionElementType = {
  type: 'type',
  name: 'name',
};

const promotionObj = {
  promotionListType: {
    type: 'type',
    name: 'name',
  },
};

// type ElementOf<T> = typeof T[number];
type PropertyOf<T> = T extends object ? T : never;

// ElementOf 타입 테스트
type PromotionProertyType = PropertyOf<typeof promotionObj>; // { type: string; name: string; } | { type: string; name: string; }

const PromotionPropertyTypeObj: PromotionProertyType = {
  promotionListType: {
    type: 'type',
    name: 'name',
  },
};
