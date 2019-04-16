import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Input, Button, Modal } from "antd";
import { Table, Divider, Tag, Icon } from "antd";
import {
  BrowserRouter,
  HashRouter,
  Route,
  Link,
  Switch
} from "react-router-dom";
import BreadcrumbOption from "../../commpant/breadcrumb";
const { Column, ColumnGroup } = Table;
const Url = require("../../app/url");
const Api = require("../../app/api.js");

import $ from "jquery";
import "./index.less";
import "../../public/app.less";

const Search = Input.Search;

class FileList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      category_id: "",
      searchTitle: "",
      id: "",
      msg: "",
      keywords: "",
      searchname: "",
      keywords: "",
      total: "",
      ids: "",
      bol: false,
      sums: "",
      data: [],
      searchValue: "",
      columns: [
        {
          title: "封面",
          dataIndex: "coverimg",
          key: "coverimg",
          render: (coverimg, record) => {
            return <img width="50" height="50" src={coverimg} />;
          }
        },

        {
          title: "标题",
          dataIndex: "title",
          key: "title"
        },
        {
          title: "类目名称",
          dataIndex: "c_title",
          key: "c_title"
        },
        {
          title: "发布状态",
          dataIndex: "status",
          key: "status",
          render: text => {
            return text == 20 ? "已发布" : "已保存";
          }
        },
        {
          title: "更新时间",
          dataIndex: "updatetime",
          key: "updatetime",
          render: (timer, recond) => {
            const date = new Date(timer * 1000);
            const currentDate =
              date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            return (
              date.getFullYear() +
              "-" +
              (date.getMonth() + 1) +
              "-" +
              currentDate
            );
          }
        },

        {
          title: "上传用户",
          dataIndex: "username",
          key: "username"
        },

        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          render: (text, record) => (
            <span>
              <Link
                to={{
                  pathname: "/addDocument",
                  query: { id: record.id, item: record }
                }}
              >
                {record.key}
                详情
              </Link>
              <Divider type="vertical" />
              <a onClick={this.showModal.bind(this, record)}>删除</a>
            </span>
          )
        }
      ],
    };
  }

  //生命周期方法
  componentDidMount() {
    let _self = this;
    _self.getList();
  }
 // 删除文档接口
  handleOk = () => {
    let _self = this;
    Api._ajax({
      url: Url.bdeldoc,
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
  // 获取文档列表接口
  getList() {
    let _self = this;
    // console.log(Url.bgetdocmentlist)
    Api._ajax({
      url: Url.bgetdocmentlist,
      data: {
        page: this.state.page,
        keywords: this.state.keywords,
        category_id: this.state.category_id
      },
      success: function(res) {
        _self.setState({
          data: res.data.list,
          total: res.data.sums
        });
      }
    });
  }

  // 搜索框是否有值状态变化
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
  //  点击清除
  clear = () => {
    let _self = this;
    this.setState(
      {
        page: 1,
        keywords: "",
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
  onSearch = value => {
    //获取输入框的输入值
    var _self = this;
    if (value == null || value == "") {
      _self.state.keywords = value;
      _self.state.page = 1;
      _self.setState({
        page: 1
      });
      _self.getList();
      return false;
    } else {
      //  搜索昵称
      _self.state.keywords = value;
      _self.setState(
        {
          searchTitle: value,
          page: 1
        },
        () => {
          _self.getList();
        }
      );
    }
  };

  state = { visible: false };

  // 确认删除
  showModal = record => {
    let _self = this;
    this.setState({
      visible: true,
      ids: record.id
    });
  };
  // 取消
  handleCancel = () => {
    this.setState({
      visible: false
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
    const locale = {
      emptyText: "暂无数据显示！"
    };
    //jsx语法 写表达式
    const Search = Input.Search;
    const pagination = {
      total: this.state.total
    };
    const tableOption = {
      columns: this.state.columns,
      dataSource: this.state.data,
      onChange: this.handleTableChange,
      pagination: {
        total: this.state.total,
        current: this.state.page
      }
    };
    return (
      <div className=" content filelist-content">
        <BreadcrumbOption />

        {/* 搜索 */}
        <div className="Search">
          <Search
            id="name"
            value={this.state.searchValue}
            placeholder="搜索标题、上传用户"
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
          <Link to={{ pathname: "/newDocument" }}>
            <p className="base-submit-button">添加</p>
          </Link>
        </div>

        {/* 数据渲染 */}
        {this.state.data ? (
          <Table
            locale={locale}
            rowKey={record => record.id}
            {...tableOption}
          />
        ) : (
          "暂时没有数据显示！"
        )}

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

export default FileList;
