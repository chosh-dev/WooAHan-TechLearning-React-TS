//! Redux의 스토어 생성

// immutable한 obj 생성하는 함수
const makeFreezeObj = (originObj = Object.create(null), newObj) => {
  return Object.freeze({ ...originObj, ...newObj });
};

//* 객체를 만드는 함수
export const createStore = (reducer) => {
  let state;

  // redux의 컨셉은 컴포넌트는 직접적으로 상태 변경이 불가
  // 클로저로 상태를 숨겨준다.
  // 바깥에서 알고싶으면 getState호출 객체를 복사해서 오염가능성을 줄임
  const getState = () => ({ ...state });

  // 상태가 변경되었을때 반응해야한다.
  // 중복을 피하기 위해 set 사용
  const listeners = new Set();
  const subscribe = (fn) => listeners.add(fn);
  const publish = () => listeners.forEach((listener) => listener());

  // 외부에서 호출하게 해야한다.
  // 외부에서 받은 reducer에 해당하는 명령어을 받음
  const dispatch = (action) => {
    if (!(action instanceof Action)) {
      throw Error("action은 Action 객체여야합니다.");
    }

    state = reducer(state, action);

    publish(); // 변경알림
  };

  return { getState, dispatch, subscribe };
};

//! Action을 추가
//* interface와 같은 개념으로 class를 사용해 실수를 줄임
export class Action {
  constructor(type, otherState) {
    if (type === undefined) throw Error("type은 반드시 있어야 합니다.");

    this.type = type;
    Object.assign(this, otherState);
  }
}
