import { createStore, makeFreezeObj, Action } from "./redux.js";

//! Reducer
//* 상태를 바꾸는 코드
// 리덕스한테 상태를 바꾸는 함수로 전달
// 무엇을 바꾸는지 모르기 때문에 두번째 인자에는 객체를 하나 푼다.
// 요구사항으로 인한 변경이 index.js에만 일어난다.
const reducer = (state = makeFreezeObj(), action) => {
  switch (action.type) {
    case "increment":
      return makeFreezeObj(state, { count: (state.count ?? 1) + 1 });
    case "reset":
      return makeFreezeObj(state, { count: action.resetValue ?? 1 });
    default:
      throw new Error("등록되어 있지 않는 action입니다.");
  }
};

//! 전역으로 활용하는 저장소
const store = createStore(reducer);

//구독
store.subscribe(() => console.log(store.getState().count));

// 객체방식으로 property 전달
store.dispatch(new Action("increment"));
store.dispatch(new Action("reset", { resetValue: 0 }));
