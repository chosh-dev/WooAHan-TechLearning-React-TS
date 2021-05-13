//! application 만들기
// import React from "react";
// const App = () => {
//   return (
//     <div>
//       <header>
//         <h1>React and TypeScript</h1>
//       </header>
//       <ul>
//         <li>1회차: Overview</li>
//         <li>2회차: Redux 만들기</li>
//         <li>3회차: React 만들기</li>
//         <li>4회차: 컴포넌트 디자인 및 비동기</li>
//       </ul>
//     </div>
//   );
// };
// export default App;

//! list를 객체로 만들어 넘기기
// import React from "react";
// const App = (props) => {
//   const { sessionList } = props.store;
//   return (
//     <div>
//       <header>
//         <h1>React and TypeScript</h1>
//       </header>
//       <ul>
//         {sessionList.map((session) => (
//           <li>{session.title}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };
// export default App;

//! JSX 안에 또 코드로 렌더링되면 가독성이 떨어진다.
//! 컴포넌트로 한번 더 감싸주자.
// import React from "react";
// // li 태그 분리
// const SessionItem = ({ title }) => <li>{title}</li>;
// // app component
// const App = (props) => {
//   const { sessionList } = props.store;
//   return (
//     <div>
//       <header>
//         <h1>React and TypeScript</h1>
//       </header>
//       <ul>
//         {sessionList.map((session) => (
//           <SessionItem title={session.title} />
//         ))}
//       </ul>
//     </div>
//   );
// };
// export default App;

//! 상태를 가지게 해보자
// import React from "react";

// const SessionItem = ({ title }) => <li>{title}</li>;
// const App = (props) => {
//   const { sessionList } = props.store;
//   // order로 인덱스도 넣어준다.
//   const orderedSessionList = sessionList.map((session, i) => ({
//     ...session,
//     order: i
//   }));
//   // 정렬
//   let displayOrder = "ASC";
//   const toggleDisplayOrder = () => {
//     displayOrder = displayOrder === "ASC" ? "DESC" : "ASC";
//   };

//   return (
//     <div>
//       <header>
//         <h1>React and TypeScript</h1>
//       </header>
//       <button onClick={toggleDisplayOrder}>재정렬</button>
//       <ul>
//         {sessionList.map((session) => (
//           <SessionItem title={session.title} key={session.id} />
//         ))}
//       </ul>
//     </div>
//   );
// };
// export default App;

//! 하지만 버튼을 눌러 상태가 바뀌어도 랜더링이 일어나지는 않는다.
//! 리액트 입장에서는 app이 호출되야되는데 함수는 이미 끝나있기 때문이다.
//! 그래서 초반에는 class를 쓸 수 밖에 없었던 것이다.

//! 만들어진 인스턴스 객체를 가지고 리액트를 핸들링하기 때문에 상태가 없어지지 않음
//! 객체가 업데이트 되면 다시 render 시키는 개념
// import React from "react";
// class App extends React.Component {
//   constructor(props) {
//     super(props); // convention
//     // super는 extend 뒤에 있는 것,
//     // prototype의 상위 부모이기 때문에 suped한테 넘겨주면 react가 props에 넣는다.
//     this.state = {
//       displayOrder: "ASC"
//     };
//   }

//   toggleDisplayOrder = () => {
//     this.setState({
//       displayOrder: this.displayOrder === "ASC" ? "DESC" : "ASC"
//     });
//   };

//   render() {
//     return (
//       <div>
//         여기여기
//         <button onClick={this.onToggleDisplayOrder}>정렬</button>
//       </div>
//     );
//   }
// }

// export default App;

//! 함수형 컴포넌트
//! 함수형 컴포넌트가 상태를 갖는것은 불가능
//! 다만 react 함수의 호출과정, 순서를 제어하고 있기 때문에
//! react hooks로 각자 함수의 상태를 저장할 수 있는 것 (클라스 컴포넌트의 render가 다시 불러오는 것과 같은 맥락)

//! 클래스는 상태,상태변경, 컴포넌트 코드 들이 전부 메소드,생성자에 흩어짐
//! 함수형은 함수안에 다 들어잇어서 가독성,응집성이 좋다.

import React from "react";
const SessionItem = ({ title }) => <li>{title}</li>;

const App = (props) => {
  const [displayOrder, setDisplayOrder] = React.useState("ASC");
  const { sessionList } = props.store;
  const orderedSessionList = sessionList.map((session, i) => ({
    ...session,
    order: i
  }));

  const toggleDisplayOrder = () => {
    setDisplayOrder(displayOrder === "ASC" ? "DESC" : "ASC");
  };

  console.log(displayOrder);

  return (
    <div>
      <header>
        <h1>React and TypeScript</h1>
      </header>
      <button onClick={toggleDisplayOrder}>재정렬</button>
      <ul>
        {orderedSessionList.map((session) => (
          <SessionItem key={session.order} title={session.title} />
        ))}
      </ul>
    </div>
  );
};

export default App;

//! hook 자체는 클로저는 아니다.
//* hook 이 실행되려면 값을 변경하는 함수가 실행되고, 이때 콜백함수로 들어가면서 클로저가 잡히는 것.