//! useEffect
//* 함수를 받는 훅, side effect를 일으킬 때 사용.
//* 이런 함수는 변수,scope 공간을 지우지 않는다. 
//* GC는 js 엔진이 알아서 해줌으로,  mark and sweep이라는 알고리즘 사용
//* 종료될때 정리 될 걸 해제하고 나갈것

useEffect(() => {
    effect
    return () => {
        cleanup
    }
}, [input])


