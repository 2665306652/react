import "babel-polyfill";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Head from "../head/head.js";
import Bottom from "../bottom/bottom.js";
import Blank from "../blank/blank.js";
import LazyLoad from "react-lazy-load";
import "./collectPage.less";
const Url = require("../../app/url");
const Api = require("../../app/api.js");
class CollectPage extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      list: [],
      slug: "",
      body_html: "",
      current: 2, //记录导航状态
      title: "抱歉，品牌暂时还未上传哦",
      lis: ""
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
   * 默认调取品牌规范列表接口
   */
  getlist() {
    let _self = this;
    Api._ajax({
      url: Url.typejson,
      type: "GET",
      success: function(res) {
        res.forEach((item, i) => {
          _self.getChang(item.slug, function(res) {
            item.desc = res.desc;
            item.time = res.time
          })
        })
        _self.setState({
          list: res
        },()=>{
        });
        _self.setState(
          {
            list: res
          },
          () => {
           
          }
        );
      }
    });
  }
  // 二次获取接口
  getChang(slug, callback) {
    let _self = this;
    Api._ajax(
      {
        url: Url.typecollect,
        type: "GET",
        success: function(res) {
          callback &&
            callback({
              desc: _self.getSimpleText(res.data.body_html),
              time: _self.gettime(res.data.content_updated_at)
            });
        }
      },
      {
        async: false
      }
    );
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

  /**
   * 时间分割处理
   */
  gettime(str) {
    let str1 = str.split("T");
    let str2 = str1[1].split(".");
    return str1[0] + "  " + str2[0].slice(0, str2[0].length - 3);
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
  linkClick = slug => {
    location.href = "brandplanning.html?slug=" + slug;
  };
  render() {
    const listLoop = data =>
      data.map((item, i) => {
        let color = this.getRandomColor();
        return (
          <li
            key={i}
            className="list-item"
            onClick={() => this.linkClick(item.slug)}
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
                  {item.time}
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

ReactDOM.render(<CollectPage />, document.getElementById("test1"));
