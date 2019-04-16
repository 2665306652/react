import React, {Component} from 'react';
import {
    Layout,
    Menu,
    Breadcrumb,
    Icon,
    Dropdown,
    message
} from "antd";
import "antd/dist/antd.css";

class BreadcrumbOption extends Component {

    
    render() {
        const hashValue = location
            .hash
            .split('#')[1];
        const BreadcrumbOption = {
            '/': '账号管理',
            '/users':'用户中心',
            '/editPassword':'修改密码',
            '/details':'用户信息',
            '/typelist': '文档类型',
            '/fileList': '文档列表',
            '/addDocument': '修改文档',
            '/newDocument': '新建文档',
            '/jurisdiction':'权限管理',
            '/userAdmin':'用户管理',
            '/indent':'订单管理',
            '/shopAudit':'商品审核管理',
            '/sellerAudit':'卖家审批管理',
        }
        return (
            <Breadcrumb style={{
                height: '70px',
                lineHeight: '70px',
                backgroundColor : '#F0F2F5',
                fontWeight : 'bold'
            }}>
                <Breadcrumb.Item>{BreadcrumbOption[hashValue]}</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
}

export default BreadcrumbOption;