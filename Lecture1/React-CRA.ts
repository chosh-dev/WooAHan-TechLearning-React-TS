//! CRA는 react app을 가장 빠르게 만드는 방법
//* yarn 이용
//yarn create react-app my-app --template typescript

//* npm 이용
//npm install -g create-react-app
//craete-react-app my-app --template typescript

//* npx 이용
// npx create-react-app my-app --template typescript

//? 장점
// 초기 셋팅을 쉽게할 수 있다

//? 단점
// 다양한 환경에 대한 대응 X
// -> 프로덕션용으로는 CRA보다 웹팩으로 셋팅

//! React component
import React from "react";
import ReactDom from "react-dom"

interface AppProps {
    title: string;
    color: string;
}

function App(props: AppProps) {
    return (
        <h1>{props.title}</h1>
    );
}

ReactDom.render(
    <React.StricMode>
    <App title="Hello" color="blue"/>
    < /React.StricMode>,
    document.getElementById("root")
)

//* ReactDom render 함수
// virtual dom에 컴포넌트를 그리며, 두 개의 인자를 받는다. 
// 1. 렌더링된 컴포넌트, 2. 렌더링된 컴포넌트를 넣을 html 요소

//* Babel
// 작성된 App 컴포넌트는 babel 트랜스파일러를 통해 JSX에서 React.createElement로 변환된다.

//! 상태관리

//* Flux
// 상태(전역상태)를 관리하는 아키텍처

//* Redux
// Flux를 사용하기 쉽게하기 위한 라이브러리

//* Mobx
// 상태도 다르고 상태를 바라보는 관점이 다름
// 낮은 러닝커브와 높은 가독성


