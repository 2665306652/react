import "babel-polyfill";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./compontcollect.less";
import { Input, Pagination } from "antd";

import Blank from "../blank/blank.js";
const Url = require("../../app/url");
const Api = require("../../app/api.js");

class Compontcollect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      searchname: "",
      inpValue: "规范",
      inputValue: "",
      title: "抱歉，该品牌暂时还未上传",
      data: {},
      titleState: 1 //空页面状态
    };
  }

  /**
   *
   * 默认生命周期方法
   */
  componentDidMount() {}
  /**
   * 点击带参跳转
   */
  linkClick = slug => {
    location.href = "brandplanning.html?slug=" + slug;
  };
  /**
   * 时间分割处理
   */
  gettime(str) {
    let str1 = str.split("T");
    let str2 = str1[1].split(".");
    return str1[0] + "  " + str2[0].slice(0, str2[0].length - 3);
  }
  render() {
    const listLoop = data =>
      data.map((item, i) => {
        let time = this.gettime(item.created_at);
        /**
         * 正则匹配字体高亮
         */
        item.nameReplace = item.name.replace(
          this.props.value,
          '<i class="highlight" >' + this.props.value + "</i>"
        );
        item.descriptionReplace = item.description.replace(
          this.props.value,
          '<i class="highlights">' + this.props.value + "</i>"
        );
        return (
          <li key={i} onClick={() => this.linkClick(item.slug)}>
            <div className="list-title">
              <p dangerouslySetInnerHTML={{ __html: item.nameReplace }} />
            </div>
            <div className="list-content">
              <p
                dangerouslySetInnerHTML={{ __html: item.descriptionReplace }}
              />
            </div>
            <div className="list-time">
              <p> {time}</p>
            </div>
            {/* <div className="icon">
              <i className="iconfont">&#xe65d;</i>
              <span className="icon-span">{item.id}</span>
            </div>
            <div className="icon">
              <i className="iconfont">&#xe61b;</i>
              <span>{item.id}</span>
            </div> */}
          </li>
        );
      });

    return (
      <div className="Compontcollect">
        {this.props.list.length ? (
          <div className="content-bg">
            <div
              style={{
                height: "63px",
                position: "relative",
                width: "1320px",
                margin: "auto"
              }}
            >
              <p className="content-title">
                全站共找到<span style={{ color: "red" }}>{this.props.list.length}</span>条关于
                <span style={{ color: "red" }}>{this.props.value}</span>
                的结果
              </p>
            </div>
            <div className="content">
              <ul>{listLoop(this.props.list)}</ul>
            </div>
            {/* <Pagination defaultCurrent={1} total={8} />; */}
          </div>
        ) : (
          <Blank listTitle={this.state.title} />
        )}
      </div>
    );
  }
}
export default Compontcollect;
