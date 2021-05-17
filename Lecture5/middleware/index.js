//! 순수함수
import { createStore } from "./redux";

function reducer(state = { counter: 0 }, action) {
  switch (action.type) {
    case "inc":
      return {
        ...state,
        counter: state.counter + 1,
      };
    default:
      return { ...state };
  }
}

const store = createStore(reducer);

store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch({
  type: "inc",
});

//* 위에 index.js 에서 일어나는 일은 모두 동기적이다.
//* 그래서 reducer는 순수함수여야한다. (멱등성)

//! 순수하지 않은 작업
//* 실행할때마다 결과가 일정하지 않은 작업. 비동기작업(api호출)
//* 예를 어떻게 redux로 처리할 수 있을까?

function api(url, cb) {
  setTimeout(() => {
    cb({ type: "응답", data: [] });
  }, 2000);
}

function reducer(state = { counter: 0 }, action) {
  switch (action.type) {
    case "fetch-user":
      api("/api.v1.users.1", (users) => {
        // 비동기로 되어 있다. 하지만 reducer는 값을 기다리지는 않는다.
        // 클로져로 잡혀 있기는 하지만 이전의 타이밍을 놓친 상황이다.
        return { ...state, ...users };
      });
      break;
  }
}

state.dispatch({
  type: "fetch-user",
});

//! 미들웨어
//* 비동기 호출을 처리하기위해 reducer 바깥의 미들웨어를 사용한다.
//* 아래 3 함수는 실행하는 코드는 같다.
//* 하지만, 중첩되어 있는 지점이 다른다.
//* 이렇게 n개의 인자를 1개씩 받는 함수로 분리하는 것을 커링이라 하고, 이는 클로저 덕분에 가능한 일이다.
const myMiddleWare = (store) => (dispatch) => (action) => {
  dispatch(action);
};

function yourMiddleWare(store) {
  return function (dispatch) {
    return function (action) {
      dispatch(action);
    };
  };
}

function ourMiddleWare(store, dispatch, action) {
  dispatch(action);
}

middlewareOne(store)(store.dispatch)({ type: "INCREASE" }); // { counter: 1 }
middlewareTwo(store)(store.dispatch)({ type: "INCREASE" }); // { counter: 2 }
middlewareThree(store, store.dispatch, { type: "INCREASE" }); // { counter: 3 }

//* 커링을 사용하면 로깅 등의 작업을 처리할 때 일일히 안해줘도된다.
function dispatchAndLog(store, action) {
  console.log("dispatching", action);
  store.dispatch(action);
  console.log("next state", store.getState());
}

dispatchAndLog(store, { type: "inc" });

//* 하지만 위의 dispatchAndLog 함수도 하드코딩

//! 몽키패치
//* 그러나 필요한 코드를 일일히 작성한다면 필요없을때는 지우게 되고, 코드가 변경되고, 다시 QA하고 -> 비싼 비용이 발생한다.
//* 그래서 가능한 코드를 수정하지않고 코드 행위를 변경할 수 있는 테크닉이 필요 -> 몽키패치
//* 실행중인 코드를 런타임중에 수정하는 것

let next = store.dispatch; // 원본을 넣는다.
store.dispatch = function dispatchAndLog(action) {
  // store.dispatch에 새 함수릃 넣는다.
  console.log("dispatching", action);
  let result = next(actioin);
  console.log("next state", store.getState());
  return result;
};

//* 새 함수를 만들지 않고 해결했다.!! 이렇게 쓰다가 원래대로 돌아갈 수 있다.

//! 두 개 이상의 몽키패치
//* 안에 있는 코드는 중요하지 않다.
//* 함수가 함수를 리턴하고 있고, 바깥 함수와 안쪽 함수가 분리되어있다는 점이 중요하다. (클로저)

function logger(store) {
  let next = store.dispatch;
  store.dispatch = function dispatchAndLog(action) {
    console.log("dispatching", action);
    let result = next(actioin);
    console.log("next state", store.getState());
    return result;
  };
}

function crashReporter(store) {
  let next = store.dispatch;
  store.dispatch = function dispatchAndReportErrors(action) {
    try {
      return next(action);
    } catch (err) {
      console.error("Caught an exception!", err);
      Raven.captureExeption(err, {
        extra: { action, state: store.getState() },
      });
      throw err;
    }
  };
}

//! 몽키패치 숨기기
//* 각각의 미들웨어 적용
function applyMiddleWareByMongkyPatching(store, middlewares) {
  middlewares = middlewares.slice();
  middlewares = reverese();
  // 각각의 미들웨어로 디스패치 함수를 변환
  middlewares.forEach((middleware) => (store.dispatch = middleware(store)));
}

applyMiddlewareByMonkeypatching(store, [logger, crashReporter]);

//* 커링을 사용
function logger(store) {
  return function wrapDispatchToAddLogging(next) {
    return function dispatchAndLog(action) {
      console.log("dispatching", action);
      let result = next(action);
      console.log("next state", store.getState());
      return result;
    };
  };
}

const logger = (store) => (next) => (action) => {
  //최종적인 로직은 안쪽에
  console.log("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  return result;
};

//! createStore에 미들웨어 적용
//* 미들웨어를 넣어주면 디스패치를 할때마다 같이 동작한다.
//* UI 쪽에서 디스패칭을 했는데 미들웨어가 가로채서 다른 디스패치를 날리게 할 수도 있음
//* redux saga는 액션을 보고 api호출이라면 ajax를 보내고 답변을 받은 다음에 next를 실행하는 것
function createStore(reducer, middlewares = []) {
  // ...
  middlewares = Array.from(middlewares).reverse();

  let lastDispatch = store.dispatch; // 원래 디스패치를 변수에 넣는다.

  middlewares.forEach((middleware) => {
    lastDispatch = middleware(store)(lastDispatch); // m1(m2(m3(m4(store.dispatch))))
  });

  return { ...store, dispatch: lastDispatch };
  // ...
}
