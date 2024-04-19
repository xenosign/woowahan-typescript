interface Person {
  first: string;
  last: string;
}

const person: Person = { first: 'tetz', last: 'lee' };

const optionsObj = {
  person,
  subject: 'subject str',
  body: 'body str',
};

function email(options: { person: Person; subject: string; body: string }) {
  console.log('------ email out ------');
  console.log(options.person);
  console.log(options.subject);
  console.log(options.body);
}

email(optionsObj);

const v1 = typeof person;
const v2 = typeof email;

console.log('typeof value', v1, v2);

type t1 = typeof person;
type t2 = typeof email;

const test: t1 = { first: 'test', last: 'last' };

enum ProgrammingLang {
  Typescript,
  Javascript,
  Java,
  Cplusplus = 12,
}

console.log(ProgrammingLang.Typescript);
console.log(ProgrammingLang.Cplusplus);
console.log(ProgrammingLang[200]); // undefined

enum NUMBER {
  ONE = 1,
  TWO = 2,
}

const myNum: NUMBER = 1;

const enum STRING_NUMBER {
  ONE = 'ONE',
  TWO = 'TWO',
}

// const myStringNum: STRING_NUMBER = 'THREE';
