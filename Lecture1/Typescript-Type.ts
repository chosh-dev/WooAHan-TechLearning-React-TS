//! Type
let foo1 = 10; // 타입을 명시하지 않아도 알아서 추론해준다.
let foo2: number = 10; // 직접 명시하면 직관적이다.

//! Type Alias
// 타입에 의미를 부여하고 싶을 때 사용
type Age = number;
let age: Age = 10;

type Person1 = {  //
    age: Age;
    name: string;
}
const person1: Person1 = {
    age: 10,
    name: "Tongky"
}

//! Interface
// 타입에 의미를 부여하고 싶을 때 사용
interface Person2 {
    age: Age;
    name: string;
}
const person2: Person2 ={
    age: 10,
    name:"Tongky"
}

//! Type Alias vs Interface
//* 1. interface는 여러번 선언해도 컴파일 시 합쳐진다. 
//* -> 일반적으로는 interface 사용, union,tuple 등이 필요할 때 type alias 사용
//* -> public api는 interface 사용, private api는 type alias 사용

//* 2. interface는 extend/implement 될 수 없다.
//* -> extend/implement 시에는 type alias 사용

