//! 컴포넌트 분할
//* React의 원칙: 비즈니스 로직을 가진 독립적인 컴포넌트 (container) + 외부상태에 의존적인 컴포넌트 (component)
//* 비즈니스 로직 = 어디서 어떤 것을 가져와서 상태를 변경하는 코드
//* conatainer - 개별 컴포넌트들에 데이터를 전달
//* components - props만 받아와 사용, 비즈니스 로직x
