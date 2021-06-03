//! 예제 보기
// 아이거 우테켐 2차 문제였다... 조금 일찍 봤다면 결과가 달라졌을 수도...
// https://codesandbox.io/s/navigation08live-8op00?file=/src/reducers/index.ts

//! react-router
//* url의 변경사항과 내부 location의 path를 감지해서 맵핑되는 페이지 컴포넌트를 연결해준다.
//* 서버사이드의 router와는 다름. uri의 end point에 따라 비지니스 로직을 실행하는 컴포넌트와 연결시키는 것
//! ./routers/index.tsx
import * as React from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import {
    DefaultLayout,
    FullSizeLayout,
    NotificationContainer
}.from "../containers"
import * as Pages from "../pages"
import PrivateRoute from "./PrivateRoute"

interface IProps {
    children?: React.ReactNode
}

const Router: React.FC<IProps> = () => {
    return (
        <BrowserRouter>
            <NotificationContainer />
            <Switch>
                // react-router-dom이 제공하는 컴포넌트
            <Route exact path="/login">
                    <FullSizeLayout>
                        <Pages.Login />
                    </FullSizeLayout>
                </Route>
            </Switch>
            <DefaultLayout>
                <Switch>
                    // 인증정보들을 체크해서 안되어있을 때 다른 동작을 취하게 만드는 PrivateRoute
                    // 로그인안하면 못들어가는 url
                <PrivateRoute exact path="/" page={Pages.Dashboard} />
                    <PrivateRoute exact path="/orders" page={Pages.Order} />
                    <PrivateRoute exact path="/shops" page={Pages.Shops} />
                    <Route component={Pages.PageNotFound} />
                </Switch>
            </DefaultLayout>
        </BrowserRouter>
    )
}

export default Router

//! ./routers/PrivateRoute.tsx
//* 로그인되지 않았을때 redirect해주는 컴포넌트. 이런식으로도 할 수 있구나.
//* render 패턴을 사용함
//* render라고 하는 props를 제공해주고, rendering 관련한 기본 동작을 변경하려면 얘를 변경시킴
//* 로그인 되있다면 받은 page를 연결해주고, 아니라면 redirect 시킨다.
const PrivateRouter: React.FC<IProps & IStateToProps & RouteProps> = props => {
    const Page: RouterPageComponent = props.page;
    const { authentication } = props;

    return (
        <Route
            {...props}
            render={props => {
                if (authentication) {
                    return <Page {...props} />
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: props.loaction }
                            }} />
                    )
                }
            }}
        >
            {props.children}
        </Route>
    )
}

//! 컴포넌트 아키텍쳐
//* 컴포넌트별 파일이름을 명확하게 지을 것
//* container를 통해 props를 전달해주는 것을 대신하는 컴포넌트를 사용
//* 장점-코드 절약, 단점-props가 명시적이지 않음
// label만 props로 넣어준다.
export default class Order extends React.PureComponent<IProps> {
    render() {
        return (
            <React.Fragment>
                <AuthContainer>
                    <PageHeader label="주문" />
                </AuthContainer>
            </React.Fragment>
        )
    }
}
// 하지만 PageHeader는 label 외에도 props로 받고 있음
export const PageHeader: React.FC<IProps> = ({
    label,
    authencation,
    requestLogout,
    openNotificationCenter
}) => {
    // ...
    return (
        //...
    )
}

// AuthContainer에서 map하며 받은 props를 cloneElement를 이용해 주입시킨다
const AuthWrapper: React.FC = props => {
    const childern = React.childern.map(
        props.children,
        (child: React.ReactElement, index: number) => {
            return React.cloneElement(child, { ...props });
        }
    )
    return <React.Fragment>{childern}</React.Fragment>
}

export const AuthContainer = connect(
    //..생략
)(AuthWrapper)

//* store의 depth를 유지하는게 편리
export const initializeState: IStoreState = {
    authentication: null,
    monitoring: false,
    shopList: [],
    openNotificationCenter: false,
    showTimeline: false,
    duration: 200,
    asyncTasks: [],
    notifications: [],
    success: 0,
    failure: 0,
    successTimeline: [],
    failureTimeline: []
};