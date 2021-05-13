//! 제너레이터
function* generator() {}

//* JS에 지연이라는 게 있다. 이걸 제너레이터가 응용한다.
const x = () => 10;
const y = x() * 10;
// x값이 확정되는 것을 지연, y 값이 실행될 때 x값이 확정됨
// 함수를 반환할 수 있다는 특징을 가지고 지연을 흉내낼 수 있

//* promise도 지연이랑 비슷하다.
const p = new Promise(function (resolve, reject) {
  //함수로 실행해서 지연을 일으킨다.
  setTimeout(() => {
    resolve("1"); // 호출되면 then에서 받음
  }, 100);
});

//지연호출
p.then(function (r) {
  console.log(r);
});

//* 제너레이터는 코루틴이라는 함구의 구현체를 반환한다.
// 코루틴은 리턴을 여러번 할 수 있는 함수
// 함수가 다시 호출할 때 함수가 리턴했던 지점에서 다시 시작하는 개념

//* yield를 사용하는데, 일반적인 함수의 return이라고 생각하면 됨.
// 객체의 value는 yield로 반환된 값. done이 true가 될 때 제너레이터는 종료

//* next라는 메소드가 있는데, next가 실행되야 다음 루프를 실행한다.
function* make() {
  let num = 1;
  while (1 < 100) {
    yield num++;
  }
}


//* 바깥쪽에서는 함수 안을 제어하고 안쪽에서는 비동기를 동기적으로 실행
// next안에 매개변수로 넘겨서 yield반환값으로도 사용가능
const delay = (ms) => new Promise((res) => setTimeout(res,ms));

function* main() {
    const result = yield delay(3000);
}

const it =main();
const {value} = it.next() // 이 때 promise 객체 반환

if (value instanceof Promise){
    value.then(()=> it.next());
}

//! async/await
// async로도 비슷하게 할 수 있다.
// promise 기반이다.
// generator는 promise 값이 없어도됨
async function main2() {
  console.log("시작");
  await delay(3000);
  console.log("3초뒤");
}
main2();
