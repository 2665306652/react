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
    duration: 2,
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
      username: "",
      role: "",
      id: "",
      bol: "",
      code: "",
      data: "",
      msg: "",
      buttonStatus: false,
      defaultName: ""
    };
  }

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
 //生命周期方法
  componentDidMount() {
    this.getUserInfo();
  }
  // 获取用户登录信息接口
  getUserInfo() {
    let _self = this;
    Api._ajax({
      url: Url.bgetaccountinfo,
      success: function(res) {
        if (res.code == 200) {
          _self.setState({
            id: res.data.id,
            username: res.data.username,
            defaultName: res.data.username,
            avatar: res.data.avatar,
            phone: res.data.phone
          });
        }
      }
    });
  }

  //保存我的信息接口
  Ensure() {
    let _self = this;
    Api._ajax({
      url: Url.basicinfo,
      data: {
        id: this.state.id,
        username: this.state.username,
        avatar: this.state.avatar
      },
      success: function(res) {
        if (res.code == 200) {
          notification["success"]({
            message: "修改成功！",
            duration: 1,
           
          });
          location.href = "../admin/#/";
        }
      }
    });
  }
  //上传图片的验证
  photoChange = e => {
    var _self = this;
    var inputRefs = this.refs.photoInput;
    var formData = new FormData();
    var fileSize = e.target.files[0].size / 1024 / 1024;
    var formats = e.target.value.match(/\.jpg$|\.jpeg$|\.gif$|\.png$/i);
    formData.append("submit_name", inputRefs.files[0]);
    formData.append("old_name", this.state.id ? this.state.avatar : "");
    formData.append("file_type", "avatar");
    // 上传头像
    if (!formats || formats.length == 0) {
      // Api.tost('格式错误')
      fileObj.outerHTML ? fileObj.outerHTML = fileObj.outerHTML : fileObj.value = "";
      return false;
  }else if (fileSize > 2) {
      notification.error({message: '提示', description: '头像上传失败，请上传小于2M的图片！'})
      return false;
  }
  // 上传头像接口
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
          notification["success"]({
            message: "头像上传成功！",
            duration: 1,
           
          });
          _self.setState({
            avatar: data.data,
            avatarStatus: true,
            buttonStatus: true
          });
        } 
        else {
          _self.setState(
            {
              msg: res.data.msg
            },
            () => {}
          );
        }
      }
    });
  };
  render() {
    return (
      <div className=" content user-content">
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
              onChange={e => this.onChangeUser(e)}
            />
          </div>
          <div className="detailsListDiv">
            <span className="detailsList-span">手机号码</span>
            <Input
              disabled
              maxLength="11"
              value={this.state.phone}
              style={{ width: "350px" }}
              name="phone"
              onChange={e => this.onChangephone(e)}
            />
          </div>
          <div className="Button">
              {this.state.msg}
              {this.state.buttonStatus}
            <Button
              disabled={!this.state.buttonStatus}
              className="base-submit-button compile"
              type="primary"
              onClick={e => {
                this.Ensure(e);
              }}
            >
              {"确定"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Details;
