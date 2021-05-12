//! Class형 컴포넌트
//* 라이프사이크 api 존재
//* 상태 변경을 위해선 setState 사용
//* 상태는 객체의 생성자에 의해 초기화 ->React가 지우지 않는한 지워지지 않는다.
//* 상태가 바뀌면 리랜더링

class Hello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
    };
  }
  componentDidMount() {
    this.setState({ count: this.state.count + 1 });
  }
  render() {
    return <p>hi!</p>;
  }
}

//! 함수형 컴포넌트
//* 상태가 함수가 호출될 때마다 생성되기 때문에 유지될 수 없었다.
//* Hooks가 나온 뒤 가능해졌다.
// 훅은 전역 배열로 관리되며 생성되는 순서에 따라 컴포넌트를 키로하여 index로 관리한다.
// 처음 실행되 컴포넌트의 정보가 없을 경우 초기값이 저장된다.
// 훅은 최상위에서만 호출하는 것을 권장, 전역배열에 문제가 생길 수 있다.

function App() {
  const [counter, setCounter] = useState(1);

  return (
    <div>
      <h1 onClick={() => setCounter(counter + 1)}>상탱 {counter}</h1>
      <Hello />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
