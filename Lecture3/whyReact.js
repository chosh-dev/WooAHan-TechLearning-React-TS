//! React를 쓰는이유
const list = [
    { title: "React에 대해 알아봅시다." },
    { title: "Redux에 대해 알아봅시다." },
    { title: "TypeScript에 대해 알아봅시다." }
  ];
  const rootElement = document.getElementById("root");
  
  //! root의 innerHTML에서 직접 DOM을 조작한 코드
  function app1() {
    rootElement.innerHTML = `
        <ul>
              ${list.map((item) => `<li>${item.title}</li>`).join("")}
        </ul>
    `;
  }
  
  app1()
  
  //* 코드에서 같은 것끼리 묶고, 다른 것은 분히라자
  //* 이름을 잘 짓는 것이 아키텍처 측면에서도 중요하다.
  
  //! 같은 input이면 같은 output이 나오는 순수함수의 형태로 의존성을 줄인 코드
  function app2(items) {
    rootElement.innerHTML = `
    <ul>
      ${items.map((item) => `<li>${item.title}</li>`)}
    </ul>
    `;
  }
  
  app2()
  
  //* real dom을 직접건드리는 것은 안정성이 떨어진다.
  
  //* Dom tree를 쓰는 이유
  // 브라우저는 태그,문자열을 환면에 그려준다. 
  // 문자열은 특정한 구조가 없고 데이터 자체라서 다루기 어렵다.
  // 다르기 쉬운 구조인 Dom을 변환해 다룬다.
  // 직접 다루는 것은 힘드니까 VDOM을 쓰는 것
  
  //! React + JSX를 활용한 방식
  import React from "react";
  import ReactDOM from "react-dom";
  
  function List() {
    return (
      <ul>
        <li>React</li>
        <li>Redux</li>
        <li>TypeScript</li>
        <li>mobx</li>
      </ul>
    );
  }
  
  function App() {
    return (
      <div>
        <h1>1</h1>
        <List />
      </div>
    );
  }
  
  ReactDOM.render(<App />, document.querySelector("#root"));
  
  //* babel이 jsx문법을 자바스크립트로 변환한다.
  // 이때 React.createElement로 VDOM을 만들어주고
  // React는 VDOM을 realDOM으로 변환한다.
  // 여기서 편의를 위해서 JSX를 만들어 컴포넌트화 시킴
  
  //* 화면에 붙이는 시점은 render가 호출될 때
  // render는 vdom을 따라가면서 real dom으로 변환한다. 최종적으로는 realdom에 붙여줌
  
  //! JSX element를 babel로 변환시킨 결과
  function list() {
    return /*#__PURE__*/_react.default.createElement("ul", null, /*#__PURE__*/_react.default.createElement("li", {
      className: "item"
    }, "React"), /*#__PURE__*/_react.default.createElement("li", {
      className: "item"
    }, "Redux"), /*#__PURE__*/_react.default.createElement("li", {
      className: "item"
    }, "MobX"), /*#__PURE__*/_react.default.createElement("li", {
      className: "item"
    }, "Typescript"));
  }
  
  
  //! 변환된 상태를 참고한 객체
  const vdom = {
    type: "ul",
    props: {},
    children: [
        { type: "li", props: { className: "item" }, children: "React" },
        { type: "li", props: { className: "item" }, children: "Redux" },
        { type: "li", props: { className: "item" }, children: "Typescript" },
        { type: "li", props: { className: "item" }, children: "MobX" },
    ],
  };