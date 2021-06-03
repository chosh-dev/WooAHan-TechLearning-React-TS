//! Mobx
//* setInterval를 써서 data가 바뀔 때마다 랜더링이 되는 함수가 있다.
//* 하지만 이는 우리가 직접 랜더링을 시키는 것이다.
// App.tsx
interface AppProps {
    data: number;
}

export default function App(props: AppProps) {
    return (
        <div className='App'>
            <h1>외부 데이터: {props.data}</h1>
        </div>
    )
}
// index.tsx
const store = {
    data: 1
}
const rootElement = document.getElementById("root")
setInterval(() => {
    store.data++;
    render(<App data={store.data} />, rootElement)
}, 1000)

//* Mobx는 observable이라는 타입 제공
//* 함수로 사용해 원하는 데이터를 감싸준다.
import { observable } from "mobx";

const cart = observable({
    data: 1
})

//* redux의 subscribe처럼 autorun을 사용한다.
//* autrorun는 observable를 추적해, 변경이 감지되면 등록된 함수를 실행한다.
autorun(() => {
    render(<App data={cart.data} />, rootElement);
});

setInterval(() => {
    cart.data++;
}, 1000)

//* 상태가 객체가 아니라 원시값일때는 observable.box를 사용한다.
//* set으로 값을 넣고 get으로 값을 가져온다.
const weight = observable.box(63);
setInterval(() => {
    weight.set(weight.get() - 1);
}, 1000);

//* 여러개 값들을 사용할때는 action으로 묶는다. (redux의 action,dispatch와 비슷)
import { observable, autorun, action } from "mobx";

const myAction = action(() => {
    cart.data++;
    cart.counter += 2;
    weight.set(weight.get() - 1);
});

setInterval(() => {
    myAction();
}, 1000)

//* action을 class에 묶어줄 수도 있다.
class Cart {
    data: number = 1;
    counter: number = 1;

    myAction = action(() => {
        this.data++;
        this.counter += 2;
    });
}

const cart = new Cart();

setInterval(() => {
    cart.myAction();
}, 1000);

//* 어노테이션도 쓸 수 있다. 
//* typescript에서도 실험적인 기능이기 때문에 tsconfig.json에 experimentalDecorators를 true로 추가
class Cart {
    @observable data: number = 1;
    @observable counter: number = 1;

    myAction = action(() => {
        this.data++;
        this.counter += 2;
    });
}

//* 조건에 따라 작동하게 하고 싶을때는 when 사용
class MyResource {
    constructor() {
        when(
            // once...
            () => !this.isVisible,
            // ... then
            () => this.dispose()
        )
    }

    @computed get isVisible() {
        // indicate whether this item is visible
    }

    dispose() {
        // dispose
    }
}

//* reaction도 있다. (useEffect 와 비슷)
//* 두 번째 함수는 앞에 함수의 return 값이 변경되었을때만 실행
const reaction2 = reaction(
    () => todos.map((todo) => todo.title),
    (titles) => console.log("reaction 2:", titles.join(", "))
)

//! Mobx-react
//* subscribe 기능도 있다. (일일히 autorun할 수는 없으니)
//* App의 store data props는 불필요해짐
// index.tsx
autorun(() => {
    render(<App />, rootElement);
});

//* observer는 원시값과 함수는 지원하지 않는다. ( class만 지원 )
//* inject 어노테이션을 사용해 this.props로 주입된다.
// App.tsx
import { inject, observer } from "mobx-react";

@inject("cart")
@observer
export default class App extends React.Component<AppProps> {
    render() {
        return (
            <div className="App">
                <h1>
                    외부 데이터: {this.props.data} vs. {this.props.counter}
                </h1>
            </div>
        );
    }
}

//* typescript에서는 interface를 optional 해줘야하는 단점이 있다.
interface AppProps {
    data?: number;
    counter?: number;
}
