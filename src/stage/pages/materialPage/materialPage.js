import "babel-polyfill";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Head from "../head/head.js";
import Bottom from "../bottom/bottom.js";
import Blank from "../blank/blank.js";
import LazyLoad from "react-lazy-load"; // 懒加载
import "./materialPage.less";
const Url = require("../../app/url");
const Api = require("../../app/api.js");
class MaterialPage extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      list: [],
      current: 3, //记录导航状态
      title: "抱歉，该素材暂时还未上传哦"
    };
  }

  /**
   *
   * 默认生命周期方法
   */
  componentDidMount() {
    this.getlist();
  }
  /**
   *
   * 默认调取素材中心列表接口
   */

  getlist() {
    let _self = this;
    Api._ajax({
      url: Url.typematerial,
      type: "GET",
      success: function(res) {
        _self.setState({
          list:res.data

        })
      }
    });
  }
 
  /**
   * 获取随机颜色方法
   */
  getRandomColor() {
    let rgb =
      "rgb(" +
      Math.floor(Math.random() * 255) +
      "," +
      Math.floor(Math.random() * 255) +
      "," +
      Math.floor(Math.random() * 255) +
      ")";
    return rgb;
  }

  // 正则 获取文本
  getSimpleText(html) {
    var re1 = new RegExp("<.+?>", "g"); //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
    var msg = html.replace(re1, ""); //执行替换成空字符
    return msg;
  }
  /**
   * 点击带参跳转
   */
  linkClick = (id) => {
    location.href = "foddercentre.html?id=" + id;
  };
  /**
   * 时间分割处理
   */
  gettime(str) {
    // console.log(str)
    return str.slice(0, str.length - 3);
  }

  render() {
    const listLoop = data =>
      data.map((item, i) => {
        // let time = item.modified_at.split(' ');
        let time = this.gettime(item.modified_at);
        let color = this.getRandomColor();
        return (
          <li
            className="list-item"
            key={i}
            onClick={() => this.linkClick(item.id)}
          >
           
              <div className="list-box">
                <div className="list-img">
                  <span className="list-photo" style={{ background: color }} />
                </div>
                <div className="list-center">
                  <span className="list-title">{item.title}</span>
                  <p className="list-content">{item.desc}</p>
                </div>
              </div>
           
          
              <div className="list-bottom">
                <p className="list-time" style={{ margin: "0" }}>
                 {time}
                </p>
              </div>
            
          </li>
        );
      });
    return (
      <div className="type-bg clearfix">
        <Head listContent={this.state.current} />
        {this.state.list != "" ? (
          <div className="content typelist-main">
            <ul className="main-list">{listLoop(this.state.list)}</ul>
          </div>
        ) : (
          <Blank listTitle={this.state.title} />
        )}

        <Bottom />
      </div>
    );
  }
}

ReactDOM.render(<MaterialPage />, document.getElementById("test1"));
