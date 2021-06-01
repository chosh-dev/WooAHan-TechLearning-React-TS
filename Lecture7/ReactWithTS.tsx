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
    successTimeline: ITimelineItem[];
    failureTimeline: ITimelineItem[];
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

//! axios를 사용한 API 통신
//* API response에 대한 규격을 interface로 정의
import axios, { AxiosResponse, AxiosError } from "axios"
import endpoint from "./endpoint.config";

// 성공
interface IApiSuccessMessage {
    status: string;
}

// 에러
interface IApiError {
    status: string;
    statusCode: number;
    errorMessage: string;
}

export class ApiError implements IApiError {
    status: string = "";
    statusCode: number = 0;
    errorMessage: string = "";

    constructor(err: AxiosError) {
        this.status = err.response.data.status;
        this.statusCode = err.response.status;
        this.errorMessage = err.reponse.data.errorMessage;
    }
}

interface INumberOfSuccessfulOrderResponse extends IApiSuccessMessage {
    result: {
        success: number;
    };
}

interface IOrderTimelineResponse extends IApiSuccessMessage {
    results: {
        successTimeline: [];
        failureTimeline: [];
    };
}

//* 실제로 사용하기에는 불편함으로 promise 형태로 작성
export function fetchNumberOfSuccessfulOrder(): Promise<INumberOfSuccessfulOrderResponse> {
    return new Promise((resolve, reject) => {
        // axios 랩핑
        axios
            .get(endpoint.orders.request.success({ error: true }))
            .then((resp: AxiosResponse) => resolve(resp.data))
            .catch((err: AxiosError) => reject(new ApiError(err)))
    })
}

export function fetchOrderTimeline(
    date: string
): Promise<IOrderTimelineResponse> {
    return new Promise((resolve, reject) => {
        axios
            .get(endpoint.orders.request.timeline(date))
            .then((resp: AxiosResponse) => resolve(resp.data))
            .catch((err: AxiosError) => reject(new ApiError(err)));
    });
}

//* config 부분 (이해못하고 넘어감..)
//* api가 많아져, 실제로 axios get해서 endopoint 빌드
//* 반복적으로 처리하지 않기 위해서
interface Config {
    orders: {
        request: {
            success(options: { error?: boolean }): string
            failure(): string
            timeline(data: string): string
        }
    }
}

//process.env.production 분기
const config: Config = {
    orders: {
        request: ({ error = false }) =>
            `${SERVER}/${API_PREFIX}/orders/request/success${error ? "?error = random" : ""}`,
        failure: () => `${SERVER}/${API_PREFIX}/orders/request/failure`,
        timeline: date => `${SERVER}/${API_PREFIX}/orders/request/all/${date}`
    }
}

export default config;