//! Redux

//! ./index.ts
// https://codesandbox.io/s/ordermonitor04-n51jrkq2wl?file=/src/index.tsx

import * as React from "react"
import { render } from "react-dom"

//* 특정 프레임에 종속되어 있는 라이브러리가 아니다.
// react, Angular, Vue, VanillaJS 에서도 사용가능
// react에서 직접 사용하려면 react redux 사용
// 리액트의 context api를 이용해 구현된 Provider를 사용해 App을 감싸준다.
import { Provider } from "react-redux";

import { createStore, applyMiddleware } from "redux";
import { StoreState } from "./types"
import reducer from "./reducers"
import createSagaMiddlerware from "redux-saga";
import rootSaga from "./sagas";
import App from "./App"

const sagaMiddleware = createSagaMiddlerware(); // sagaMiidlleware
const store: StoreState = createStore(reducer, applyMiddleware(sagaMiddleware))
const rootElement: HTMLElement = document.getElementById("root")

sagaMiddleware(rootSaga); // rootSaga 미들웨어 전달

// store를 넣어주면 하위 App 어디에서든 사용가능
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);

//! /types
export interface StoreState {
  monitoring: boolean;
  success: number;
  failure: number;
}

//! /reducers
import { ActionType, getType } from "typesafe-actions"
import { StoreState } from "../types"
import * as Actions from "../actions"

const initializeState: StoreState = {
  monitoring: false,
  success: 0,
  failure: 0
}

export default (
  state: StoreState = initializeState,
  action: ActionType<typeof Actions>
) => {
  switch (action.type) {
    case getType(Actions.fetchSuccess):
      return {
        ...state,
        success: state.success + Math.floor(Math.random() * (100 - 1) + 1)
      };
    case getType(Actions.fetchFailure):
      return {
        ...state,
        failure: state.failure + Math.floor(Math.random() * (2 - 0))
      };
    default:
      console.log(action.type);
      return Object.assign({}, state);
  }
}

//! /actions
//* reducer에 dispatch하기위해 action을 만든다.
//* 타입 문자열, 타입속성을 가진 액션 객체, 액션객체를 redux에 넘기는 dispatch함수 3개가 필요, 규격이 다양하다.
//* typesafe-actions 라이브러리의 createAction을 사용해서 간편하게 actions를 생성할 수 있다.
// 비슷한 redux toolkit도 있음
import { createAction } from "typesafe-actions";
import { fork } from "cluster";

export const startMonitoring = createAction( // createAction을 통해 상수선언 생략
  "@command/monitoring/start", // 액션 문자열, 타입속성
  resolve => () => resolve() // 함수, 페이로드에 넣어준다.
)

export const stopMonitoring = createAction(
  "@command/monitoring/stop",
  resolve => () => resolve()
)

export const fetchSuccess = createAction(
  "@fetch/success",
  resolve => () => resolve()
);

export const fetchFailure = createAction(
  "@fetch/failure",
  resolve => () => resolve()
);

//! ./sagas
// 위에 index.ts에 보면 redux-saga를 미들웨어로 쓰고 있다.
//* redux-saga는 비동기처리를 위해 제너레이터를 사용한다.
import { fork, all, take, race, delay, put } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import * as Actions from "../actions"

function* monitoringWorkflow() {
  while (true) {
    // 문자열의 액션이 오면 던져지고. 이 문자열이 오기전까지는 멈춰있다.
    // take는 redux의 액션(문자열)을 주고, 이 액션이 들어오면 알려달라고 next를 던져준다.
    yield take(getType(Actions.startMonitoring));

    let isLoop = true;
    while (isLoop) {
      // all : 동시에 여러개를 디스패치하는 용도
      yield all([
        // put: 액션을 dispatch하는 것을 redux-saga에게 시킴
        put({ type: getType(Actions.fetchSuccess) }),
        put({ type: getType(Actions.fetchFailure) })
      ])

      // race: 여러 개의 객체 중 가장 먼저 도착하는 것의 상태값 반환
      const { isStop } = yield race({
        // delay : 일종의 프라미스 객체, 딜레이 해준다.
        waitting: delay(200),

        // take: 액션을 기다린다.
        isStop: take(getType(Actions.stopMonitoring))
      })

      if (isStop) {
        isLoop = false
      }
    }
  }
}

// 이것이 App.tsx에 있는 rootSaga
export default function* () {
  // fork: 제너레이터를 받으면 함수를 호출해서 쓴다.
  yield fork(monitoringWorkflow);
}