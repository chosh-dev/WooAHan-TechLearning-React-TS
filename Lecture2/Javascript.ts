//! 자바스크립트의 함수
//* 자바스크립트의 거의 모든 것들이 값이다.

//* 함수는 반드시 값을 반환한다. (return이 없다면 undefined 반환)

//* 익명함수
// 함수를 값으로 취급할 땐 이름을 생략할 수 있다.
// 단독으로 익명함수를 사용하면 에러.
const foo = function () { };

//* 즉시 실행함수
// 익명함수를 값으로 하기 위해서는 괄호를 사용한다.
(function () { })();

//* 함수는 일급객체로 값이 될 수 있다. (콜백함수)
function foo(x) {
    x();
    return function () { };
}
const y = foo(function () { })

// 이름을 생략하지 않으면 재귀호출이 가능
function foo(num = 0) {
    if (num === 100) return;
    console.log(num);
    foo(num + 1);
}

//* 화살표 함수
// 자신의 this가 없다. prototype 속성도 없다.
// arguments 객체를 bind하지 않는다.
// new와 함께 사용하면 오류
// 이름이 없기 때문에 재귀호출 불가능
const foo = () => {

}

//! 자바스크립트의 식, 문
//* 식
// 코드의 결과가 값으로 나옴
// 세미클론으로 마무리
0;
1 + 10;
foo();

//* 문
// 코드의 결과값이 안나옴
// 조건문, 반복문, 함수를 정의하는 문
function foo(x) {
    return y;
}

//! new 연산자
//* this
// new 연산자를 호출하면 this를 생성하며 인스턴스 객체는 this를 반환
function foo() {
    this.age = 10;
}
const y = new foo();
console.log(y) // { age: 10, constructor: object }


//* this는 선언시점이 아닌 호출 시에 결정
const person = {
    name: "tongky",
    getName() {
        return this.name;
    },
};

console.log(person.getName()); // tongky
const man = person.getName; // error
console.log(man()); // window 객체에서 name을 찾을 수 없기 때문에 error

//* this를 고정하기 위해서는 bind, call, apply와 같은 함수들을 사용
const man = person.getName.bind(person); // bind
console.log(man()); // tongky
person.getName.call(person); // tongky
person.getName.apply(person); // tongky
// call과 apply 차이는 함수에 배열을 넘기고, 문자열 나열을 넘긴다.

//* 인스턴스 객체
// new연산자를 사용하면 프로토타입이라는 방식을 사용해서 새로운 객체 생성
// instanceof 로 생성된 객체의 타입을 확인할 수 있다. 
(y instanceof foo)

//! class
// 좀더 명시적인 방법
// new로 호출하지 않으면 불가능 (함수는 가능하기 명서직이 못함)
class foo {
    constructor() {
        this.age = 10;
    }
}

console.log(new bar()); // { age: 10, constructor: object }

//! closure
// 함수가 호출되면 함수안에 스코프가 생성됨.
// 변수의 스코프에 따라 변수는 사라지지만 실행 컨텍스트에 저장된다.
// 함수 실행결과로 반환된 함수가 외부의 스코프를 기억하고 있는 상태 => 클로저
// 값을 보호할때씀
const person = {
    age: 10
}
person.age = 500; // age 가 바뀜

function makePerson() {  // setAge로만 바꿀 수 있다.
    let age = 10;
    return {
        getAge() {
            return age;
        },
        setAge(x) {
            age = x;
        }
    }
}
let p = makePerson();

//! 비동기
// 자바스크립트는 싱글 스레드 -> 비동기 처리
// setTimeout을 사용한 비동기 -> 콜백지옥

//* promise
// new Promise는 인스턴스 객체 반환. then 이라는 메소드 추가됨.
// 동기작업이 성공하면 then은 resolve 호출
// 실패시 reject함수를 호출 -> catch 안에 함수 호출
const p1 = new Promise(resolve, reject) => {
    setTimeout(() => {
        resolve("응답1");
    }, 1000);
    reject();
})

p1.then(console.log("next")).catch(function () { })

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

//* async / await 
// 비동기 함수를 동기화처럼 처리
// async를 붙이면 내부에 await를 쓸 수 있다.
async function main() {
    console.log("1")
    try {
        const result = await delay(2000);
    } catch {
        console.error("e");
    }
    console.log("2")
}

//! 커링
// 여러 개 인자 하나하나가 함수 하나씩 배분해 나누는 것
// 클로저는 커링을 위한 기술 중 하나
const foo = a => b => c => a + b + c;

function foo(a) {
    return function (b) {
        return function (c) {
            return a + b + c;
        }
    }
}