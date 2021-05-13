//! application 만들기
// import React from "react";
// import App from "./App";
// import ReactDOM from "react-dom";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

//! list를 객체로 만들어 넘기기
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
const rootElement = document.getElementById("root");
const sessionList = [
  { title: "1회차: Overview" },
  { title: "2회차: Redux 만들기" },
  { title: "3회차: React 만들기" },
  { title: "4회차: 컴포넌트 디자인 및 비동기" }
];

ReactDOM.render(
  <React.StrictMode>
    <App store={{ sessionList }} />
  </React.StrictMode>,
  rootElement
);
