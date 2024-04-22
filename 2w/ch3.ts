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

type ExampleMapped = {
  a: number;
  b: string;
  c: boolean;
};

type Subset<T> = {
  [K in keyof T]?: T[K];
};

const aExampleMapped: Subset<ExampleMapped> = { a: 3 };
const bExampleMapped: Subset<ExampleMapped> = { b: 'hello' };
const cExampleMapped: Subset<ExampleMapped> = { c: true };

type ReadOnlyEx = {
  readonly a: number;
  readonly b: string;
};

let objByReadOnlyEx: ReadOnlyEx = {
  a: 1,
  b: '2',
};

// objByReadOnlyEx.a = 3; // ERR
console.log(objByReadOnlyEx);

type CreateMutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type ChangedMutableTypeFromReadOnlyEx = CreateMutable<ReadOnlyEx>;

let objByChangedMutableTypeFromReadOnlyEx = {
  a: 1,
  b: '2',
};

objByChangedMutableTypeFromReadOnlyEx.a = 3;
objByChangedMutableTypeFromReadOnlyEx.b = '2';

console.log(objByChangedMutableTypeFromReadOnlyEx);

type OptionalEx = {
  a?: number;
  b?: string;
  c: boolean;
};

type Concrete<T> = {
  [P in keyof T]-?: T[P];
};

type ChandedConcreteTypeFromOptionalEx = Concrete<OptionalEx>;

let objByChandedConcreteTypeFromOptionalEx: ChandedConcreteTypeFromOptionalEx =
  {
    a: 1,
    b: '2',
    c: true,
  };

console.log(objByChandedConcreteTypeFromOptionalEx);

const BottomSheetMap = {
  RECENT_CONTACTS: 'RecentContactsBottomSheet',
  CARD_SELECT: 'CardSelectBottomSheet',
  SORT_FILTER: 'SortFilterBottomSheet',
  PRODUCT_SELECT: 'ProductSelectBottomSheet',
  REPLY_CARD_SELECT: 'ReplyCardSelectBottomSheet',
  RESEND: 'ResendBottomSheet',
  STICKER: 'StickerBottomSheet',
  BASE: null,
};

export type BOTTOM_SHEET_ID = keyof typeof BottomSheetMap;

// 불필요한 반복이 발생한다
type BottomSheetStore = {
  RECENT_CONTACTS: {
    resolver?: (payload: any) => void;
    args?: any;
    isOpened: boolean;
  };
  CARD_SELECT: {
    resolver?: (payload: any) => void;
    args?: any;
    isOpened: boolean;
  };
  SORT_FILTER: {
    resolver?: (payload: any) => void;
    args?: any;
    isOpened: boolean;
  };
  // ...
};
// Mapped Types를 통해 효율적으로 타입을 선언할 수 있다
type BottomSheetStoreByMapped = {
  [index in BOTTOM_SHEET_ID]: {
    resolver?: (payload: any) => void;
    args?: any;
    isOpened: boolean;
  };
};

type Stage =
  | 'init'
  | 'select-image'
  | 'edit-image'
  | 'decorate-card'
  | 'capture-image';

type StageName = `${Stage}-stage`;

function exampleFunc<T>(arg: T): T[] {
  return new Array(3).fill(arg);
}

console.log(exampleFunc('hello'));
console.log(exampleFunc(3));

function exampleFunc2<T>(arg: T): number {
  // return arg.length; // ERR
  return 0;
}

interface TypeWithLength {
  length: number;
}

function exampleFunc3<T extends TypeWithLength>(arg: T): number {
  return arg.length;
}

const arrowExampleFunc = <T>(arg: T) => {
  return new Array(3).fill(arg);
};

const arrowExampleFunc2 = <T extends {}>(arg: T) => {
  return new Array(3).fill(arg);
};

function normalExampleFunc<T>(arg: T) {
  return new Array(3).fill(arg);
}

import { ObjectType, EntitySchema, Repository, getConnection } from 'typeorm';

function ReadOnlyRepository<T>(
  target: ObjectType<T> | EntitySchema<T> | string
): Repository<T> {
  return getConnection('ro').getRepository(target);
}
