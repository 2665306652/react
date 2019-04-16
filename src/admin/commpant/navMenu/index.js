import React, { Component } from 'react';
import '../../pages/typeList/index.less';
import {
    Menu,
    Icon,
} from "antd";
import {
    hashHistory,
    HashRouter,
    Route,
    Link,
    Switch
} from "react-router-dom";
import "antd/dist/antd.css";

const SubMenu = Menu.SubMenu;
class NavMenu extends Component {

    // componentWillReceiveProps(nextProps){
    //     this.setState({
    //         bb: nextProps.ss > this.props.ss

    //     })

    //     console.log(nextProps,22222222222222222)
    // }
    // shouldComponentUpdate(nextProps){
    //     console.log(nextProps,2)

    //     return true;

    // }

    componentWillReceiveProps() {
        // this.setState({
        //     hashValue:location.hash.split('#')[1]
        // })
        // console.log('nav')
    }
    render() {

        const hashValue = location.hash.split('#')[1];
        const sliderOption = {
            '/': ['1'],
            '/typelist': ['2'],
            '/fileList': ['3'],
            '/newDocument': ['4'],
            '/jurisdiction':['5'],
            '/userAdmin':['6'],
            '/sellerAudit': ['7'],
            '/shopAudit': ['8'],
            '/indent': ['9']
        }
      
        return (
            <div>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={sliderOption[hashValue]}
                    defaultOpenKeys={['sub1']}
                    mode="inline">
                    
                         <Menu.Item key="1">
                                <Link to="/" replace>
                                    <span>
                                        <Icon type="file"/>
                                        <span className="nav-text">账号管理</span>
                                    </span>
                                </Link>
                            </Menu.Item>
                        
                    <SubMenu
                        key="sub1"
                        inlineCollapsed={false}
                        title={< span > <Icon type="copy" /> < span style={{ marginLeft: '-5px' }}> 文档管理 </span> </span >}>
                        <Menu.Item key="2">
                            <Link to="/typelist" replace>文档类型</Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            文档列表
                            <Link to="/fileList" replace>文档列表</Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to="/newDocument" replace>新建文档</Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="5">
                        <Link to="/jurisdiction" replace>
                            <span>
                                <Icon type="file" />
                                <span className="nav-text">权限管理</span>
                            </span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="6">
                        <Link to="/userAdmin" replace>
                            <span>
                                <Icon type="file" />
                                <span className="nav-text">用户管理</span>
                            </span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="7">
                        <Link to="/sellerAudit" replace>
                            <span>
                                <Icon type="file" />
                                <span className="nav-text">卖家审批管理</span>
                            </span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="8">
                        <Link to="/shopAudit" replace>
                            <span>
                                <Icon type="file" />
                                <span className="nav-text">商品审核管理</span>
                            </span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="9">
                        <Link to="/indent" replace>
                            <span>
                                <Icon type="file" />
                                <span className="nav-text">订单管理</span>
                            </span>
                        </Link>
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}

export default NavMenu;