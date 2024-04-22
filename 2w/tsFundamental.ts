interface Mobile<T> {
  name: string;
  price: number;
  option: T;
}

const m1: Mobile<object> = {
  name: 's21',
  price: 1000,
  option: {
    color: 'red',
    coupon: false,
  },
};

const m2: Mobile<{ color: string; coupon: boolean }> = {
  name: 's21',
  price: 1000,
  option: {
    color: 'red',
    coupon: false,
  },
};

const m3: Mobile<string> = {
  name: 's21',
  price: 1000,
  option: 'good',
};

interface Users {
  name: string;
  age: number;
}

interface Car {
  name: string;
  color: string;
}

interface Book {
  price: number;
}

const user: Users = { name: 'a', age: 10 };
const car: Car = { name: 'bmw', color: 'red' };
const book: Book = { price: 3000 };

function showName<T extends { name: string }>(data: T): string {
  return data.name;
}

showName(user);
showName(car);
// showName(book); // ERR

interface User {
  id: number;
  name: string;
  age: number;
  gender: 'm' | 'f';
}

type UserKey = keyof User; // 'id' | 'name' | 'age' | 'gender'

const uk: UserKey = 'id';
// const uk2: UserKey = 'coupon'; // ERR

// ERR
// let admin: User = {
//   id: 1,
//   name: 'boob',
// };

// OK
let admin2: Partial<User> = {
  id: 1,
  name: 'boob',
};

interface UserOptional {
  id: number;
  name: string;
  age?: number;
}

// // ERR
// let admin3: Required<UserOptional> = {
//   id: 1,
//   name: 'Bob',
// };

// OK
let admin4: Required<UserOptional> = {
  id: 1,
  name: 'Bob',
  age: 12,
};

interface UserReadonly {
  id: number;
  name: string;
  age?: number;
}

let admin5: Readonly<UserReadonly> = {
  id: 1,
  name: 'Bob',
  age: 12,
};

// admin5.id = 5; // ERR

interface Score {
  '1': 'A' | 'B' | 'C' | 'D';
  '2': 'A' | 'B' | 'C' | 'D';
  '3': 'A' | 'B' | 'C' | 'D';
  '4': 'A' | 'B' | 'C' | 'D';
}

const score = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
};

const scoreRecord: Record<'1' | '2' | '3' | '4', 'A' | 'B' | 'C' | 'D'> = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
};

type Class = '1' | '2' | '3' | '4';
type Grade = 'A' | 'B' | 'C' | 'D';

const scoreRecord2: Record<Class, Grade> = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
};

interface UserRecord {
  id: number;
  name: string;
  age: number;
}

function isValid(user: UserRecord) {
  const result: Record<keyof UserRecord, boolean> = {
    id: user.id > 0,
    name: user.name !== '',
    age: user.age > 19,
  };
  return result;
}

interface UserPick {
  id: number;
  name: string;
  age: number;
}

const admin6: Pick<UserPick, 'id' | 'name'> = {
  id: 1,
  name: 'tetz',
};

interface UserOmit {
  id: number;
  name: string;
  age: number;
}

const admin7: Omit<UserOmit, 'id' | 'age'> = {
  name: 'tetz',
};

type T1 = number | string | boolean;
type T2 = boolean;
type T3 = Exclude<T1, T2>; // number | string

type UserT1 = {
  id: number;
  name: string;
  age: number;
  gender: 'm' | 'f';
};

type UserT2 = {
  age: number;
  gender: 'm' | 'f';
};

type UserT3 = {
  [K in Exclude<keyof UserT1, keyof UserT2>]: UserT1[K];
};
const admin8: UserT3 = {
  id: 1,
  name: 'tetz',
};

type T4 = number | string | null | undefined;
type T5 = NonNullable<T4>; // string | number
