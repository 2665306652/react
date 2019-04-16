import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { Input, Button, Checkbox, Row, Col, Radio, notification } from "antd";
import BreadcrumbOption from "../../commpant/breadcrumb/index.js";
const Url = require("../../app/url");
const Api = require("../../app/api.js");

import $ from "jquery";
import "./index.less";
import "../../public/app.less";
const openNotificationWithIcon = type => {
  notification[type]({
    message: "Notification Title",
    description: "添加成功"
  });
};
const RadioGroup = Radio.Group;
class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: require("../../public/images/photochang.png"),
      avatarStatus: false,
      value: 1,
      phone: "",
      pwd: "",
      new_pwd: "",
      re_pwd: "",
      username: "",
      role: "",
      id: "",
      bol: "",
      code: "",
      data: "",
      msg: "",
      buttonStatus: false,
      submitStatus:'',
      defaultName: "",
      defaultRole: '',
    };
  }
  // 单选框
  onChange = e => {
    this.setState({
      value: e.target.value,
     
    });
  };
  // 当用户名发生改变
  onChangeUser(e) {
    let inputValue = e.target.value,
      inputName = e.target.name,
      _self = this;
    if (inputValue == this.state.defaultName) {
      this.setState({
        username: inputValue,
        buttonStatus: false
      });
    } else {
      this.setState({
        username: inputValue,
        buttonStatus: true
      });
    }
  }
  // 当手机号发生改变
  onChangephone(e) {
    let inputValuecode = e.target.value,
      inputName = e.target.name;
    this.setState({
      phone: inputValuecode
    });
  }
  // 当密码发生改变
  onChangePwd(e) {
    let inputValuePwd = e.target.value,
      inputName = e.target.name;
    this.setState({
      pwd: inputValuePwd
    });
  }
  // 确认密码
  onChangePasswd(e) {
    let inputValuePwd = e.target.value,
      inputName = e.target.name;
    this.setState({
      passwd: inputValuePwd
    });
  }

  // 角色
  onChangeRole(e) {
    let role = e.target.value,
      inputName = e.target.name;
      
      if (role == this.state.defaultRole ) {
        this.setState({
          role: role,
          buttonStatus: false
        });
      } else {
        this.setState({
          role: role,
          buttonStatus: true
        });
      }
    // this.setState({
    //   role: e.target.value
    // });
  }
  onInputKeyUp(e) {
    if (e.keyCode === 13) {
      this.onAdd();
    }
  }

  // 检查接口的数据是不是合法
  checkLoginInfo(loginInfo) {
    let username = $.trim(this.state.username);
    let phone = $.trim(this.state.phone);
    let pwd = $.trim(this.state.pwd);
    let role = this.state.role;
    // 头像非空判断

    if (!this.state.avatarStatus) {
      return {
        status: false,
        msg: "请先上传头像！"
      };
    }

    // 判断用户名为空
    if (typeof username !== "string" || username.length === 0) {
      return {
        status: false,
        msg: "用户名不能为空！"
      };
    }
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(phone)) {
      return {
        status: false,
        msg: "手机号码格式不正确！"
      };
    }

    if (!this.state.id) {
      //判断密码为空
      if (pwd == "") {
        return {
          status: false,
          msg: "密码不能为空！"
        };
      }

      if (typeof pwd !== "string" || pwd.length < 6) {
        return {
          status: false,
          msg: "密码不能小于6位！"
        };
      }
      let _self = this;
      if (!_self.state.passwd) {
        return {
          status: false,
          msg: "请再次输入密码！"
        };
      }
      if (_self.state.passwd != _self.state.pwd) {
        return {
          status: false,
          msg: "两次密码输入不一致！"
        };
      } else {
        return {
          status: true,
          msg: "添加成功！"
        };
      }
    }
    // 判断角色
    if (role === "") {
      return {
        status: false,
        msg: "请选择角色！"
      };
    }

    return {
      status: true,
      msg: ""
    };
  }
  // 带参值和本页面值的判断
  componentDidMount() {
    const userInfo = this.props.location.query;
    if (userInfo && userInfo.item) {
      this.setState({
        phone: userInfo.item.phone,
        username: userInfo.item.username,
        role: userInfo.item.role,
        id: userInfo.item.id,
        photo: userInfo.item.photo || "",
        avatar: userInfo.item.avatar,
        avatarStatus: true,
        defaultRole : userInfo.item.role
      });
    }
  }
  //重置密码接口
  reset() {
    let _self = this;
    Api._ajax({
      url: Url.bresetpassword,
      data: {
        id: this.state.id
      },
      success: function(res) {
        if (res.code == 200) {
          notification["success"](
            {
              message: "重置成功！",
              duration: 1
            })
        }
      }
    });
  }
  onAdd() {
    let _self = this;
    //验证表单
    let checkResult = _self.checkLoginInfo({
      username: _self.state.username,
      phone: _self.state.phone,
      pwd: _self.state.pwd
    });
    this.state.msg = checkResult.msg;
    this.state.status = checkResult.status;
    if (this.state.status == true) {
      _self.setState(
        {
          msg: ""
        },
        () => {
          _self.add();
        }
      );
    } else {
      _self.setState({
        msg: checkResult.msg
      });
    }
  }
  // 保存用户信息接口
  add() {
    let _self = this;
    Api._ajax({
      url: Url.bsaveaccount,
      data: {
        phone: this.state.phone,
        pwd: this.state.pwd,
        id: this.state.id,
        role: this.state.role,
        username: this.state.username,
        avatar: this.state.avatar
      },
      success: function(res) {
        if (res.code == 200) {
          notification["success"](
            {
              message: _self.state.id ? "修改成功" : "添加成功",
              duration: 1
            },
            () => {
              !this.state.id &&
                _self.setState({
                  avatar: require("../../public/images/photochang.png"),
                  avatarStatus: false,
                  value: 1,
                  phone: "",
                  pwd: "",
                  username: "",
                  role: "",
                  id: "",
                  code: "",
                  data: "",
                  msg: ""
                });
            }
          );
          location.href = "../admin/#/";
        } else {
          _self.setState(
            {
              msg: res.msg
            },
            () => {}
          );
        }
      }
    });
  }
  photoChange = e => {
    var _self = this;
    var inputRefs = this.refs.photoInput;
    var fileSize = inputRefs.files[0].size / 1024 / 1024;    
    var formData = new FormData();
    formData.append("submit_name", inputRefs.files[0]);
    formData.append("old_name", this.state.id ? this.state.avatar : "");
    formData.append("file_type", "avatar");
    if (fileSize >2) {
      notification["success"](
        {
          message:  "图片过大",
          duration: 2
        })
      
    } else{
        // 上传图片
       $.ajax({
      url: Url.uploadTemp,
      data: formData,
      cache: false,
      type: "POST",
      processData: false,
      contentType: false,
      success: function(data) {
        data = JSON.parse(data);
        if (data.code == 200) {
          _self.setState({
            avatar: data.data,
            avatarStatus: true,
            buttonStatus: true
          });
        } else {
          _self.setState(
            {
              msg: res.data.msg
            },
            () => {}
          );
        }
      }
    });
    }
  
   
  };
  render() {
    //带参数跳转
    const userInfo = this.props.location.query;
    return (
      <div className="x-content">
        <BreadcrumbOption />
        <div className="detailsList">
          <div className="photoStyle">
            <span style={{ marginLeft: 40 }}>头像</span>
            <input
              className="inputStyle"
              type="file"
              ref="photoInput"
              onChange={this.photoChange}
            />
            <img
              className="imgStyle"
              src={this.state.avatar}
              width="100"
              height="100"
            />
          </div>
          <div className="detailsListDiv">
            <span className="detailsList-span">用户名</span>

            <Input
              maxLength="20"
              value={this.state.username}
              style={{ width: "350px" }}
              name="username"
              onKeyUp={e => this.onInputKeyUp(e)}
              onChange={e => this.onChangeUser(e)}
            />
          </div>
          <div className="detailsListDiv">
            <span className="detailsList-span">手机号码</span>
            <Input
              maxLength="11"
              value={this.state.phone}
              style={{ width: "350px" }}
              name="phone"
              onKeyUp={e => this.onInputKeyUp(e)}
              onChange={e => this.onChangephone(e)}
            />
          </div>

          {(this.state.role == 1 || this.state.role == 2) && this.state.id ? (
            <div>
              <div className="detailsListDiv">
                <span className="detailsList-span">重置密码</span>
                <div style={{ marginRight: "285px" }}>
                  <Button
                    onClick={e => {
                      this.reset(e);
                    }}
                    value={this.state.re_pwd}
                    className=""
                    type="primary"
                    onKeyUp={e => this.onInputKeyUp(e)}
                    onChange={e => this.onChangerepwd(e)}
                  >
                    重置
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {!this.state.id ? (
            <div>
              <div className="detailsListDiv">
                <span className="detailsList-span">登录密码</span>
                <Input
                  maxLength="6"
                  style={{ width: "350px" }}
                  name="pwd"
                  type="password"
                  onKeyUp={e => this.onInputKeyUp(e)}
                  onChange={e => this.onChangePwd(e)}
                />
              </div>
              <div className="detailsListDiv">
                <span className="detailsList-span">确认密码</span>
                <Input
                  maxLength="6"
                  style={{ width: "350px" }}
                  name="passwd"
                  type="password"
                  onKeyUp={e => this.onInputKeyUp(e)}
                  onChange={e => this.onChangePasswd(e)}
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="detailsListDiv">
            <span className="detailsList-span" style={{ width: 100 }}>
              角色
            </span>
            <RadioGroup
              className="RadioGroup"
              name="role"
              onChange={e => this.onChangeRole(e)}
              value={this.state.role}
            >
              <Radio value={0}>普通用户</Radio>
              <Radio value={1}>管理员</Radio>
              <Radio value={2}>超级管理员</Radio>
            </RadioGroup>
            ,
          </div>

          <div className="Button">
            <p className="hideFont">
              {this.state.msg} 
            </p>
            <Button
              disabled={
                this.state.id
                  ? !this.state.buttonStatus
                  : ''
              }
              className="base-submit-button compile"
              type="primary"
              onClick={e => {
                this.onAdd(e);
              }}
            >
              {userInfo && userInfo.item.id ? "确定" : "添加"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Details;
