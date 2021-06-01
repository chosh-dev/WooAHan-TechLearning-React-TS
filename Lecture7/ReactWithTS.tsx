//! React and TypeScript Boilerplate
// https://codesandbox.io/s/ordermonitor08-1ttxf?file=/src/index.tsx

//! App.tsx
import * as React from "react";

import {
    NotificationContainer,
    OrderStatusContainer,
    MonitorControllerContainer
} from "./containers"

export default class App extends React.PureComponent {
    render() {
        return (
            <div>
                <NotificationContainer />
                <header>
                    React & TS Boilerplate
                </header>
                <main>
                    <OrderStatusContainer />
                    <MonitorControllerContainer />
                </main>
            </div>
        )
    }
}

//! containers/index.ts
//* 이렇게하면 한번에 컴포넌트들을 다 사용할 수 있고, 내부정보를 감출수도 있다.(캡슐화)
//* components도 마찬가지
export * from "./OrderStatus";
export * from "./MonitorController";
export * from "./Notification";

//! containers/OrderStatus.tsx
//! inerface vs Type Alias
//* 이 둘은 컴파일 타임에 적용된다. -> 컴파일 타임에 타입에러를 잡는다.
//* 기능적으로는 유사하나, 현재 대세적으로는 type이 많이 쓰임
//* interface - 상속 지원, 유니온 타입x
//* type - 유니온 타입 O
// 유니온 타입 = type box number | string (여러 경우 중 하나)
export interface OrderStatusProps {
    showTimeLine: boolean;
    success: number;
    failure: number;
    successTimeline: TimelineItem[];
    failureTimeline: TimelineItem[];
}

//! React component의 oop
//* react component는 oop적이지 않다.
//* 1. class는 lifecycle을 위한 도구일뿐, new를 통해 인스턴스를 만들지 않는다.
//* 2. 안에 있는 것들이 public이다. react가 알아서 하기 때문에
//* 3. 요즘엔 함수형 컴포넌트를 지원, 그런 측면에서 typescript 기능이 많이 필요한 것도 아님.

//! Typescript의 제너릭
//* any로 모든 타입을 지정하는 것 좋지않다.
function identity1(arg: any): any {
    return arg
}
//* 제너릭은 동적타입이다.
//* T를 규정하고, 컴파일 타임에 동작해 T가 규정되면 이어서 적용됨.
function identity2<T>(arg: T): T {
    return arg;
}
let output = identity2<string>("myString");  // = let ouput:string


//* react에서는 다음처럼 사용
//* P = props, S = 내부 state, ss= snapshot(잘안씀)
class React.component < P= { }, S = {}, SS = any >

    class OrderStatus extends React.component<OrderStatusProps> {
        // ...
        render() {
            // ...
        }
    }


//! React-redux롤 React component 연결하기
//* 예전의 react-redux
//* connect 헬퍼 함수 이용, HOC형태로 mapStateToProps를 클로저로 가지고 있다가, OrderStatus 함수에 property로 주입
//* OrderSatus는 store에 구독받는 형태
export const OrderStatusContainer = connect(mapStateToProps)(OrderStatus)

//* 현재의 react-redux
//* hooks 지원으로 쉬워짐.
//* useSelector로 store에 데이터를 가져옴
import React from 'react'
import { useSelector } from 'react-redux'

export const CounterComponent = () => {
    const counter = useSelector(state => state.counter)
    return <div>{counter}</div>
}
//* useDispatch로 디스패치를 사용할 수 있다.
import React from 'react'
import { useDispatch } from 'react-redux'

export const CounterComponent = ({ value } => {
    const dispatch = useDispath()

    return (
        <div>
            <span>{value}</span>
            <button onClick={() => dispatch({ type: 'increment-counter' })}>
                increment counter
            </button>
        </div>
    )
})

//! axios