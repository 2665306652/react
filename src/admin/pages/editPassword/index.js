import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Input, Button, Checkbox, Row, Col, Radio, notification } from "antd";
import BreadcrumbOption from "../../commpant/breadcrumb/index.js";
import $ from "jquery";
import "./index.less";
import { Link } from "react-router-dom";

const Url = require("../../app/url");
const Api = require("../../app/api.js");

class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      pwd: "",
      new_pwd: "",
      re_pwd: "",
      buttonStatus: false,
      checked: false,
      index: null
    };
  }

   //验证输入信息是否合法
   checkInfo(callback) {
    let _self = this;

    if (!_self.state.pwd) {
      return {
        status: false,
        msg: "请输入原始密码！",
        index: 0
      };
    }

    if (!_self.state.new_pwd) {
      return {
        status: false,
        msg: "请输入新密码！",
        index: 1
      };
    }
    if (_self.state.new_pwd.length<6){
      return {
        status: false,
        msg: "密码不能少于6位！",
        index: 1
      }
    }
    if (!_self.state.re_pwd) {
      return {
        status: false,
        msg: "请再次输入密码!",
        index: 2
      };
    }
    if(_self.state.new_pwd==_self.state.pwd){
      return {
        status:false,
        msg:"新修改密码与原始密码不能一致！",
        index:1
      }
    }
    if (_self.state.new_pwd != _self.state.re_pwd) {
      return {
        status: false,
        msg: "两次密码不一样!",
        index: 2
      };
    }

    return {
      status: true,
      msg: ""
    };
  }
// 原始密码
  oldPwd = e => {
    let _self = this,
      value = e.target.value;
    this.setState(
      {
        pwd: value
      },
      () => {
        var res = _self.checkInfo();
        _self.setState({
          buttonStatus: res.status,
          index: res.index
        });
      }
    );
  };

  //新密码密码
  onChangerepwd = e => {
    // console.log(e, 11111);
    let _self = this,
      inputValuenewPwd = e.target.value,
      inputName = e.target.name;
    this.setState(
      {
        new_pwd: inputValuenewPwd
      },
      () => {
        var res = _self.checkInfo();
        _self.setState({
          buttonStatus: res.status,
          msg: res.msg,
          index: res.index
        });
      }
    );
  };
  //确认密码
  onCheckedPwd = e => {
    let _self = this,
      inputValuerePwd = e.target.value,
      inputName = e.target.name;
    this.setState(
      {
        re_pwd: inputValuerePwd
      },
      () => {
        var res = _self.checkInfo();
        _self.setState({
          buttonStatus: res.status,
          msg: res.msg,
          index: res.index
        });
      }
    );
  };
// 修改密码接口
  Eidt() {
    let _self = this;
    Api._ajax({
      url: Url.bupdatepwd,
      data: {
        pwd: this.state.pwd,
        new_pwd: this.state.new_pwd,
        re_pwd: this.state.re_pwd
      },
      success: function(res) {
        if (res.code == 200) {
          notification["success"]({
            message: "修改成功！",
            duration: 2
          });
          _self.setState({
            index: 3,
          });
        }
        // location.href = "../admin/login.html";
      }
    });
  }
 
  render() {
    return (
      <div className="editpassword-content content ">
        <BreadcrumbOption />
        <div className=" detailsList">
          <div className="detailsListDiv">
            <span className="detailsList-span">原始密码</span>

            <Input
              type="password"
              maxLength="6"
              style={{ width: "400px" }}
              className="list-input"
              onChange={this.oldPwd}
            />
            <div className="hidefontsize">
              {this.state.index == 0 ? this.state.msg : ""}
            </div>
          </div>
          <div className="detailsListDiv">
            <span className="detailsList-span">修改密码</span>

            <Input
              type="password"
              maxLength="6"
              value={this.state.new_pwd}
              style={{ width: "400px" }}
              className="list-input"
              onChange={this.onChangerepwd}
            />
            <div className="hidefontsize">
              {this.state.index == 1 ? this.state.msg : ""}
            </div>
          </div>
          <div className="detailsListDiv">
            <span className="detailsList-span">确认密码</span>

            <Input
              type="password"
              maxLength="6"
              value={this.state.re_pwd}
              style={{ width: "400px" }}
              className="list-input"
              onChange={this.onCheckedPwd}
            />
            <div className="hidefontsize">
              {this.state.index == 2 ? this.state.msg : ""}
            </div>
          </div>
          <div className="Buttonstyle">
            <div className="hidefontsize">
              {this.state.index == 3 ? this.state.msg : ""}
            </div>
            <Button
              disabled={!this.state.buttonStatus}
              className="base-submit-button"
              type="primary"
              onClick={e => {
                this.Eidt(e);
              }}
            >
              确定
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default EditPassword;
