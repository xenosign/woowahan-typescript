// interface Person {
//   first: string;
//   last: string;
// }

// const person: Person = { first: 'tetz', last: 'lee' };

// const optionsObj = {
//   person,
//   subject: 'subject str',
//   body: 'body str',
// };

// function email(options: { person: Person; subject: string; body: string }) {
//   console.log('------ email out ------');
//   console.log(options.person);
//   console.log(options.subject);
//   console.log(options.body);
// }

// email(optionsObj);

// const v1 = typeof person;
// const v2 = typeof email;

// console.log('typeof value', v1, v2);

// type t1 = typeof person;
// type t2 = typeof email;

// const test: t1 = { first: 'test', last: 'last' };

// enum ProgrammingLang {
//   Typescript,
//   Javascript,
//   Java,
//   Cplusplus = 12,
// }

// console.log(ProgrammingLang.Typescript);
// console.log(ProgrammingLang.Cplusplus);
// console.log(ProgrammingLang[200]); // undefined

// enum NUMBER {
//   ONE = 1,
//   TWO = 2,
// }

// const myNum: NUMBER = 1;

// const enum STRING_NUMBER {
//   ONE = 'ONE',
//   TWO = 'TWO',
// }

// const myStringNum: STRING_NUMBER = 'THREE';

// let value: unknown;
// let anyVal: any;
// value = anyVal;

// console.log(anyVal);

// type jsonObj = {
//   name: string;
// };

// const jsonParserUnknown = (jsonString: string): jsonObj =>
//   JSON.parse(jsonString);

// const myOtherAccount = jsonParserUnknown(`{ "name": "Samuel" }`);

// console.log(myOtherAccount.name);

// type jsonObj = {
//   name: string;
// };

// const obj = {} as any as jsonObj;

// obj.name = 'str';

// console.log(obj);

// let obj1: unknown;
// let obj2: any;

// obj1 = obj2;
// const obj3 = obj1 as any as jsonObj;

interface objType {
  name: string;
}

interface extendedObjType extends objType {
  age: number;
}

let obj1: objType = { name: 'tetz' };
let obj2: extendedObjType = { name: 'kim', age: 10 };

console.log(obj1 instanceof Object);
