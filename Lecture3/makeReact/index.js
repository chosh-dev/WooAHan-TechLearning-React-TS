/* @jsx createElement */
// babel로 트랜스파일링되는 가상 Dom의 역할

//! 직접 간단한 React 만들기

//* 사용자 component는 대문자로 시작한다.

import { createElement, render, Component } from "./react.js";

class Text extends Component {
  render() {
    return <span> L({this.props.v})</span>;
  }
}

function Hello(props) {
  return (
    <li className="item">
      <Text v={props.label} />
    </li>
  );
}

function App() {
  let x = 10;

  x = x ** x;

  return (
    <div>
      <h1>hello world</h1>
      <ul className="board" onClick={() => null}>
        <Hello label="Hello balbal" />
        <Hello label={`hello ${x}`} />
        <Hello label="World 3" />
        <Hello label="React 4" />
      </ul>
    </div>
  );
}

render(<App />, document.getElementById("root"));
