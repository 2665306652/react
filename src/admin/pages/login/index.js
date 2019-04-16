import React, { Component } from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import "./index.less";
import { Link } from "react-router-dom";
import Account from "../accountList/index.js";

const Url = require("../../app/url");
const Api = require("../../app/api.js");
class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      phone: null,
      pwd: null,
      code: null,
      _sign: null,
      msg: null,
      status: false,
      imgUrl: "",
      codePush: ""
    };
  }
  // 默认第一次调用
  componentDidMount() {
    let _self = this;
    this.codeGet();
    document.onkeyup = function(e) {
      if (e.keyCode == 13) {
        _self.onSubmit();
      }
    };
  }
  // 验证码接口
  codeGet() {
    let _self = this;
    Api._ajax({
      url: Url.code,
      success: function(res) {
        _self.setState({ imgUrl: res.data.img, codePush: res.data._sign });
      }
    });
  }
  // 验证码获取
  codeClick() {
    this.codeGet();
  }

  // 登录接口
  submit() {
    let _self = this;
    Api._ajax({
      url: Url.blogin,
      data: {
        phone: this.state.phone,
        pwd: this.state.pwd,
        code: this.state.code,
        _sign: this.state.codePush
      },
      success: function(res) {
        if (res.code == 200) {
          location.href = "../admin/#/";
        } else {
          _self.setState(
            {
              msg: res.msg
            },
            () => {
              _self.codeGet();
            }
          );
        }
      }
    });
  }

  // 当用户名发生改变
  onChangeUser(e) {
    let inputValue = e.target.value,
      inputName = e.target.name,
      _self = this;
    this.setState({ phone: inputValue });
  }

  onChangePwd(e) {
    let inputValuePwd = e.target.value,
      inputName = e.target.name;
    this.setState({ pwd: inputValuePwd });
  }
  onInputCode(e) {
    let inputValuecode = e.target.value,
      inputName = e.target.name;
    this.setState({ code: inputValuecode });
  }

  // 检查登录接口的数据是不是合法
  checkLoginInfo(loginInfo) {
    let phone = $.trim(loginInfo.phone);
    let pwd = $.trim(loginInfo.pwd);
    let code = $.trim(loginInfo.code);
    // 判断手机号码为空
    if (typeof phone !== "string" || phone.length === 0) {
      return { status: false, msg: "手机号码不能为空！" };
    }
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(phone)) {
      return { status: false, msg: "手机号码格式不正确！" };
    }
    // 判断密码为空
    if (pwd == "") {
      return {
        status: false,
        msg: "密码不能为空！"
      };
    }
    if (typeof pwd !== "string" || pwd.length < 6) {
      return { status: false, msg: "密码不能小于6位！" };
    }
    // 判断验证码为空
    if (typeof code !== "string" || code.length === 0) {
      return { status: false, msg: "验证码不能为空！" };
    }
    // 判断验证码输入错误
    if (code.length != 4) {
      return { status: false, msg: "验证码输入错误！" };
    }
    return { status: true, msg: "" };
  }
  onSubmit() {
    let _self = this;
    //验证表单
    let checkResult = _self.checkLoginInfo({
      phone: this.state.phone,
      pwd: this.state.pwd,
      code: this.state.code
    });
    this.state.msg = checkResult.msg;
    this.state.status = checkResult.status;
    if (this.state.status == true) {
      _self.setState(
        {
          msg: ""
        },
        () => {
          _self.submit();
        }
      );
    } else {
      _self.setState({ msg: checkResult.msg });
    }
  }

  render() {
    return (
      <div className="background">
        <div className="content">
          <p className="content-title">后台登录管理中心</p>
          <span className="big-title">欢迎登录支付宝素材中心系统</span>

          <div className="section">
            <span className="section-title">账号登录111</span>
            <form>
              <input
                type="text"
                maxLength="11"
                className="form-input"
                name="phone"
                placeholder="请输入手机号码"
                onChange={e => this.onChangeUser(e)}
              />
              <input
                className="form-input"
                type="password"
                maxLength="6"
                name="pwd"
                placeholder="请输入密码"
                onChange={e => this.onChangePwd(e)}
              />
              <div className="flexStyle">
                <input
                  maxLength="4"
                  className="verify"
                  placeholder="请输入验证码"
                  name="code"
                  onChange={e => this.onInputCode(e)}
                />
                <img
                  src={"data:image/png;base64," + this.state.imgUrl}
                  style={{
                    width: "150px",
                    height: "33px"
                  }}
                  alt="图片加载失败111"
                />
              </div>
              <p
                className="fontstyle"
                onClick={() => {
                  this.codeClick();
                }}
              >
                看不清，换一张
              </p>
              <p className="hideFont">{this.state.msg}</p>
              <p
                className="btn"
                onClick={e => {
                  this.onSubmit(e);
                }}
              >
                登录
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Content />, document.getElementById("root"));
