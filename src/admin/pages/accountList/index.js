import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { Input, Button, Modal } from "antd";
import { Table, Divider, Tag, Icon, notification } from "antd";
import {
  BrowserRouter,
  HashRouter,
  Route,
  Link,
  Switch
} from "react-router-dom";

const { Column, ColumnGroup } = Table;
const Url = require("../../app/url");
const Api = require("../../app/api.js");
import BreadcrumbOption from "../../commpant/breadcrumb";
import $ from "jquery";
import "./index.less";
// import "../../public/app.less";

//  定义一个React组件
const confirm = Modal.confirm;
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      code: "",
      id: "",
      username: "",
      phone: "",
      searchname: "",
      role: "",
      total: "",
      ids: "",
      roles: "",
      sums: "",
      bol: "",
      searchValue: "",
      msg: "",
      data: [],
      pagination: {},
      columns: [
        {
          title: "头像",
          dataIndex: "avatar",
          key: "avatar",
          render: (avatr, record) => {
            return <img width="50" height="50" src={avatr} />;
          }
        },
        {
          title: "用户名",
          dataIndex: "username",
          key: "username",
          render: text => <a href="javascript:;">{text}</a>
        },
        {
          title: "手机号码",
          dataIndex: "phone",
          key: "phone"
        },
        {
          title: "角色",
          dataIndex: "role",
          key: "role",
          render: (role, record) => {
            switch (role) {
              case 1:
                return "管理员";
                break;
              case 2:
                return "超级管理员";
                break;
              default:
                return "普通用户";
                break;
            }
          }
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          render: (text, record) => {
            return (
              <span>
                <Link
                  to={{
                    pathname: "/details",
                    query: { id: record.id, item: record }
                  }}
                >
                  {record.key}
                  详情
                </Link>
                <Divider type="vertical" />
                <a onClick={this.showModal.bind(this, record)}>
                  删除{this.state.role}
                </a>
                <Divider type="vertical" />
              </span>
            );
          }
        }
      ]
      
    };
  }
  //生命周期方法
  componentDidMount() {
    let _self = this;
    _self.getList();
  }

  //重置密码接口
  
  reset = (id, e) => {
    Api._ajax({
      url: Url.bresetpassword,
      data: {
        id: id
      },
      success: function(res) {
        if (res.code == 200) {
          notification["success"]({
            message: "重置成功！",
            description: "重置密码为：123456",
            duration: 2
          });
        }
      }
    });
  };
/**
 * 删除列表接口
 */
  handleOk = () => {
    let _self = this;
    Api._ajax({
      url: Url.bdelaccount,
      data: {
        id: this.state.ids
      },
      success: function() {
        _self.setState({
          total:_self.state.total,
         
        },()=>{
          if( (_self.state.total % 10 - 1) === 0){
            _self.setState({
              page:--_self.state.page
          },()=>{
              //页数减1之后调用接口得到全部数据
              _self.getList();
          })
        }else{
          _self.getList();
        }
        })  
      }
      
    })
    this.setState({
      visible: false,
    });
  };

  // 获取用户信息列表接口
  getList() {
   
    let _self = this;
    Api._ajax({
      type:"get",
      url: Url.listjson,
      
      data: {
        username: this.state.username,
        phone: this.state.phone,
        role: this.state.role,
       
      },
      success: function(res) {
  
        _self.setState({
          data: res.data.list,
          total: res.data.sums,
          columns: [
            // {
            //   title: "头像",
            //   dataIndex: "avatar",
            //   key: "avatar",
            //   render: (avatr, record) => {
            //     return <img width="50" height="50" src={avatr} />;
            //   }
            // },
            {
              title: "用户名",
              dataIndex: "username",
              key: "username"
            },
            {
              title: "手机号码",
              dataIndex: "phone",
              key: "phone"
            },
            {
              title: "角色",
              dataIndex: "role",
              key: "role",
              render: (role, record) => {
                switch (role) {
                  case 1:
                    return "管理员";
                    break;
                  case 2:
                    return "超级管理员";
                    break;
                  default:
                    return "普通用户";
                    break;
                }
              }
            },
            {
              title: "操作",
              dataIndex: "action",
              key: "action",
              render: (text, record) => {
                return (
                  <span>
                    <Link
                      to={{
                        pathname: "/details",
                        query: { id: record.id, item: record }
                      }}
              
                    >
                      {record.key}
                      详情
                    </Link>
                    <Divider type="vertical" />
                    <a onClick={_self.showModal.bind(this, record)}>删除</a>

                    {res.data.role !== 2 && record.role != 0 ? (
                      <a onClick={e => _self.reset(record.id, e)}>
                        {" "}
                        <Divider type="vertical" />
                        重置密码
                      </a>
                    ) : (
                      ""
                    )}
                  </span>
                );
              }
            }
          ]
        });
      }
    });
  }


  
  // 判断搜索框是否有值
  onChange = value => {
    let _self = this;
    if (value != "") {
      this.setState({
        bol: true,
        searchValue: value.target.value
      });
    } else {
      this.setState({
        bol: false
      });
    }
    if (!value.target.value) {
      this.setState({
        bol: false
      });
    }
  };

  //搜索
  onSearch(value) {
    var _self = this;
    //获取输入框的输入值

    if (value == null || value == "") {
      _self.state.searchname = value;
      _self.state.page = 1;
      _self.setState({
        page: 1
      });
      _self.getList();
      return false;
    } else {
      //  搜索昵称
      _self.state.searchname = value;
      _self.state.page = 1;
      _self.setState(
        {
          page: 1
        },
        () => {
          _self.getList();
        }
      );
    }
  }
  state = { visible: false };
  state = { modal1Visible: false };
  // 取消
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  //确认删除
  showModal = record => {
    let _self = this;
    this.setState({
      visible: true,
      ids: record.id
    });
  };

  // 点击清空
  clear = () => {
    let _self = this;
    this.setState(
      {
        page: 1,
        searchname: "",
        searchValue: ""
      },
      () => {
        _self.getList();
      }
    );
    this.setState({
      bol: false
    });
  };

  // 执行换页回调函数
  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        page: pagination.current
      },
      () => {
        this.getList();
      }
    );
  };

  
  render() {
    //jsx语法 写表达式

   
    const locale = {
      emptyText: "暂无数据显示！"
    };
    const Search = Input.Search;
    const pagination = {
      total: this.state.total
    };
    const tableOption = {
      columns: this.state.columns,
      dataSource: this.state.data,
      onChange: this.handleTableChange,
      pagination: {
        current: this.state.page,
        total: this.state.total
      }
    };
    return (
      <div className="content accountlist-content" data-test={pagination}>
        <BreadcrumbOption />
        <div className="Search">
          <Search
            value={this.state.searchValue}
            placeholder="搜索用户名、手机号码"
            onSearch={e => {
              this.onSearch(e);
            }}
            onChange={e => {
              this.onChange(e);
            }}
            enterButton
            style={{ width: "300px", display: "block" }}
          />
          <Icon
            onClick={() => {
              this.clear();
            }}
            className="icon"
            style={{ display: this.state.bol ? "block" : "none" }}
            type="close-circle"
            theme="filled"
          />
         
         <Link className="base-submit-button" to={{ pathname: "/details" }}>
         添加
       </Link>
       
          
        </div>
        {this.state.data ? (
          <Table
            locale={locale}
            rowKey={record => record.id}
            {...tableOption}
          />
        ) : (
          "暂时没有数据"
        )}
        {/* 删除弹层 */}
        <Modal
          title="提示"
          cancelText="取消"
          okText="确定"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p className="delete">确定要删除吗？</p>
        </Modal>
      </div>
    );
  }
}

export default Account;
