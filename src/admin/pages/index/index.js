import React, { Component } from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import "./index.less";

import {
  HashRouter,
  Route,
  Link,
  Switch,
  BrowserRouter
} from "react-router-dom";

import { Layout, Menu, Breadcrumb, Icon, Dropdown, message } from "antd";
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

import "antd/dist/antd.css";

//账号管理
import Account from "../accountList/index.js";
// 详情页
import Details from "../details/index.js";
//新建文档
import NewDocument from "../newDocument/index.js";
//新建文档
import AddDocument from "../addDocument/index.js";

//文档类型
import TypeList from "../typeList";
// 文档列表
import FileList from "../fileList";
//用户中心
import Users from "../users";
// 修改密码
import EditPassword from "../editPassword";

//左侧导航
import NavMenu from "../../commpant/navMenu";
// 底部bar
import FooterModule from "../../commpant/Footer/index.js";



//权限管理
import Jurisdiction from "../jurisdiction/Jurisdiction.js";
//用户管理
import UserAdmin from "../userAdmin/userAdmin.js";
// 订单管理
import Indent from "../indent";
// 商品审核管理
import ShopAudit from "../ShopAudit";
// 卖家审批管理
import SellerAudit from "../SellerAudit";

const Url = require("../../app/url");
const Api = require("../../app/api.js");

class SiderDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      msg: "",
      id: "",
      username: "",
      role: "",
      avatar: ""
    };
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  // 退出登录接口
  exit() {
    let _self = this;
    Api._ajax({
      url: Url.bsignout,
      success: function(res) {
        // console.log(res);
        // if (res.code == 200) {
        //   location.href = "../admin/login.html";
        // }
      }
    });
  }
  //生命周期第默认调用方法
  componentDidMount() {
    // let _self = this;
    // _self.getList();
  }
  // 获取用户登录接口
  getList() {
    let _self = this;
    Api._ajax({
      url: Url.bgetaccountinfo,
      success: function(res) {
        if (res.code == 200) {
          _self.setState(
            {
              userInfo: res.data,
              username: res.data.username
            },
            () => {
              if (res.data.role != 2 && location.hash.split("#")[1] == "/") {
                // location.replace("#/filelist");
              }
            }
          );
        } else {
          // location.href = "../admin/login.html";
        }
      }
    });
  }
  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <Link replace to={{ pathname: "/users" }}>
            用户中心
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link replace to={{ pathname: "/editPassword" }}>
            修改密码
          </Link>
        </Menu.Item>
        <Menu.Item>
          <a
            onClick={() => {
              this.exit();
            }}
            rel="noopener noreferrer"
            href="javascript:void(0);"
          >
            退出登录
          </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <HashRouter
        style={{
          width: "80%",
          margin: "0 auto"
        }}
      >
        {/* 侧边栏 */}
        <Layout style={{ Height: "100%", overflow: "hidden" }}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            // onCollapse={this.onCollapse}
          >
            <div className="logo">
              <img src={require("../../public/images/GroupLogo.png")} />
            </div>

            <NavMenu userInfo={this.state.userInfo} />
          </Sider>
          <Layout>
            {/* 头部 */}
            <Header
              style={{
                background: "#fff"
              }}
              className="Header_class"
            >
              <div>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                  onClick={this.toggle}
                  style={{
                    margin: "auto 0"
                  }}
                />
              </div>

              <div style={{ marginRight: "10px" }}>
                <Dropdown overlay={menu}>
                  <span
                    className="ant-dropdown-link"
                    style={{
                      color: "#ccc",
                      cursor: "pointer"
                    }}
                  >
                    <Icon
                      size={64}
                      type="user"
                      style={{
                        verticalAlign: "middle"
                      }}
                    />
                    <span
                      style={{
                        fontSize: "20px",
                        verticalAlign: "middle",
                        width: "70px",
                        display: "inline-block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {/* 张三 */}
                      {this.state.username}
                    </span>
                  </span>
                </Dropdown>
              </div>
            </Header>

            {/* 中间内容部分 */}
            <Content
              style={{
                margin: "0 16px"
              }}
            >
              {/* 内容组件 */}
              <div
                style={{
                  // padding: 24,
                  // background: "#fff",
                  minHeight: 360,
                  overflow: "auto"
                }}
              >
                <Switch>
                  <Route exact path="/" component={Account} />
                  <Route path="/details" component={Details} />
                  <Route path="/newDocument" component={NewDocument} />
                  <Route path="/addDocument" component={AddDocument} />
                  <Route path="/typeList" component={TypeList} />
                  <Route path="/fileList" component={FileList} />
                  <Route path="/users" component={Users} />
                  <Route path="/editPassword" component={EditPassword} />


                  <Route path="/jurisdiction" component={Jurisdiction} />
                  {/* 用户管理 */}
                  <Route path="/userAdmin" component={UserAdmin} />
                  {/* 订单管理 */}
                  <Route path="/Indent" component={Indent} />
                  {/* 商品审核管理 */}
                  <Route path="/ShopAudit" component={ShopAudit} />
                  {/* 卖家审批管理 */}
                  <Route path="/SellerAudit" component={SellerAudit} />
                </Switch>
              </div>
            </Content>

            <Footer style={{ textAlign: 'center' }}>
                <FooterModule />
            </Footer>
          </Layout>
        </Layout>
      </HashRouter>
    );
  }
}

ReactDOM.render(<SiderDemo />, document.getElementById("app"));
