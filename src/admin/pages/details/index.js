import React, {Component, Fragment} from "react";
import ReactDOM from "react-dom";
import {
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  Radio,
  notification
} from "antd";
import BreadcrumbOption from "../../commpant/breadcrumb/index.js";
const Url = require("../../app/url");
const Api = require("../../app/api.js");

import $ from "jquery";
import "./index.less";
import "../../public/app.less";

import PhotoUpload from '../../commpant/photoUpload';

const openNotificationWithIcon = type => {
  notification[type]({message: "Notification Title", description: "添加成功"});
};
const RadioGroup = Radio.Group;
class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      avatarStatus: true,
      value: 1,
      phone: "",
      phoneStatus: true,
      pwd: "",
      new_pwd: "",
      re_pwd: "",
      username: "",
      usernameStatus: true,
      role: 0,
      id: "",
      bol: "",
      code: "",
      data: "",
      msg: "",
      buttonDisabled: true,
    };
  }
  // 生命周期方法
  componentDidMount() {
    const userInfo = this.props.location.query;
    if (userInfo && userInfo.item) {
      this.setState({
        userInfo: userInfo.item,
        phone: userInfo.item.phone,
        phoneStatus: true,
        username: userInfo.item.username,
        userNameStatus: true,
        role: userInfo.item.role,
        id: userInfo.item.id,
        avatar: userInfo.item.avatar,
        avatarStatus: true
      });
    }
  }

  //头像变更
  photoChange = (img) => {
    this.setState({
      avatar: img
    }, () => {
      this.buttonStatusCheck();

    });
  }

  //用户名变更
  usernameChange = (e) => {

    if (!e.target.value) {
      this.setState({username: e.target.value, usernameStatus: false})
    } else {
      this.setState({
        username: e.target.value,
        usernameStatus: true
      }, () => {
        this.buttonStatusCheck();
      })
    }

  }
  //权限变更
  onChangeRole = (e) => {
    this.setState({
      role: e.target.value
    }, () => {
      this.buttonStatusCheck();

    })
  }
  //手机号验证
  onChangephone = (e) => {
    let _self = this;
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    this.setState({
      phone: e.target.value,
      phoneStatus: myreg.test(e.target.value)
    }, () => {
      this.buttonStatusCheck();
    })

  }
  //按钮点击
  //保存用户信息接口
  buttonClick = (e) => {
    let _self = this;
    let result = _self.infoCheck();
    _self.setState({
      buttonDisabled : true
    })
    if (result.status) {
      Api._ajax({
        url: Url.bsaveaccount,
        data: {
          phone: _self.state.phone,
          username: _self.state.username,
          role: _self.state.role,
          id: _self.state.id,
          avatar: _self.state.avatar
        },
        success: function (res) {
          if (res.code == 200) {
            notification.success({message: '保存成功',duration:1})
            location.href = "../admin/#/";
          } else {
            notification.error({message: '保存失败', description: res.msg})
          }
        }
      })
    } else {

      var type = result.type + 'Status';
      _self.state[type] = false;
      _self.setState({buttonStatus: result.status})

      notification.error({message: '保存失败', description: result.msg})
    }
  }
  // 验证输入信息是否合法
  infoCheck() {
    var _self = this;

    if (!_self.state.avatar) {
      return {status: false, msg: '请上传用户头像', type: 'avatar'}
    }
    if (!_self.state.username) {
      return {status: false, msg: '请输入用户名', type: 'username'}
    }

    if (!_self.state.id) {
      if (!_self.state.phone) {
        return {status: false, msg: '请输入手机号码', type: 'phone'}
      }
      if (!_self.state.phoneStatus) {
        return {status: false, msg: '请输入正确的手机号码', type: 'phone'}
      }

    }
    if (_self.state.role === '') {
      return {status: false, msg: '请选择用户权限', type: 'role'}
    }
    return {status: true, msg: ''}
  }
  //按钮状态变化
  buttonStatusCheck() {
    let _self = this;

    if (_self.state.userInfo) { //如果是编辑模式
      if ((!_self.state.username || _self.state.username == _self.state.userInfo.username) && _self.state.avatar == _self.state.userInfo.avatar && _self.state.role == _self.state.userInfo.role) {
        this.setState({buttonDisabled: true})
      } else {
        this.setState({buttonDisabled: false})
      }
    } else { //新增模式
      var res = _self.infoCheck();
      this.setState({
        buttonDisabled: !res.status
      })

    }
  }


  render() {
    //带参数跳转
    const userInfo = this.props.location.query;
    return (
      <div className=" content details-content">
        <BreadcrumbOption/>
        <div className="details-list">
          {/* <div className="photo-style">
            <span style={{
              marginLeft: 40
            }}>头像</span>

            <PhotoUpload
              className={"details-photo " + (this.state.avatarStatus
              ? ''
              : 'msg-error')}
              old_name={this.state.avatar}
              type="avatar"
              photo={this.state.avatar}
              photoUpload={this.photoChange}/> 
          </div> */}
          <div className="detailsList-div">
            <span className="detailsList-span">用户名</span>

            <Input
              className={this.state.usernameStatus
              ? ''
              : 'msg-error'}
              maxLength="20"
              value={this.state.username}
              style={{
              width: "350px"
            }}
              name="username"
              onChange={this.usernameChange}/>
          </div>
          <div className="detailsList-div">
            <span className="detailsList-span">手机号码</span>
            <Input
              className={this.state.phoneStatus
              ? ''
              : 'msg-error'}
              disabled={this.state.id
              ? true
              : false}
              maxLength="11"
              value={this.state.phone}
              style={{
              width: "350px"
            }}
              name="phone"
              onChange={e => this.onChangephone(e)}/>
          </div>

          {(this.state.role == 1 || this.state.role == 2) && this.state.id
            ? ('')
            : ("")}
          <div className="detailsList-div">
            <span
              className="detailsList-span"
              style={{
              width: 100
            }}>
              角色
            </span>
            <RadioGroup
              className="RadioGroup"
              name="role"
              onChange={e => this.onChangeRole(e)}
              value={this.state.role}>
              <Radio value={0}>普通用户</Radio>
              <Radio value={1}>管理员</Radio>
              {/* <Radio value={2}>超级管理员</Radio> */}
            </RadioGroup>
            ,
          </div>

          <div className="Button">
            <Button
              disabled={this.state.buttonDisabled}
              className="base-submit-button compile"
              type="primary"
              onClick={this.buttonClick}>
              {userInfo && userInfo.item.id
                ? "确定"
                : "添加"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Details;
