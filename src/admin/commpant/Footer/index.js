import React, {Component} from 'react';
import './index.less';
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

class FooterModule extends Component {
    render() {
        return (
            <div className="footer-content">
                  <ul>
                  <li>帮助</li>
                  <li>隐私</li>
                  <li>条款</li>
                </ul>
                <p> Copyright © 2018 支付宝UED品牌营销组出品</p>
            </div>
        );
    }
}

export default FooterModule;