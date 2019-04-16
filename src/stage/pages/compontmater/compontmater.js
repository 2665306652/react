import "babel-polyfill";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./compontmater.less";
const Url = require("../../app/url");
const Api = require("../../app/api.js");
import Blank from "../blank/blank.js";
import { Input, Pagination } from "antd";

class Compontmater extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      searchname: "",
      inpValue: "规范",
      inputValue: "",
      title: "抱歉，该素材暂时还未上传",
      data: {},
      titleState: 1 //空页面状态
    };
  }
  /**
   *
   * 默认生命周期方法
   */
  componentDidMount() {
  }
  
  /**
   * 点击带参跳转
   */
  linkClick = (id) => {
    location.href = "foddercentre.html?id=" + id;
  };
  render() {
    const listLoop = data =>
      data.map((item, i) => {
        let time = item.modified_at.split(' ')[0];
        /**
         * 正则匹配字体高亮
         */
       
        item.titleReplace = item.title.replace(
          this.props.value,
          '<i class="highlight" >' + this.props.value + "</i>"
        );
        item.descReplace= item.desc.replace(
          this.props.value,
          '<i class="highlights">' + this.props.value + "</i>"
        );
        return (
          <li
            className="upload-greet"
            key={i}
            onClick={() => this.linkClick(item.id)}
          >
            <img src={item.thumb} alt="" />
            <div className="upload-bottom">
              <span dangerouslySetInnerHTML={{ __html: item.titleReplace }} />
              <p dangerouslySetInnerHTML={{ __html: item.descReplace }} />
              <div>
                <span className="home-upload-name">
                  {item.designer}
                  {time}
                  {/* {item.creator} */}
                  上传
                </span>
                <span className="home-upload-collect">
                  <i className="iconfont">&#xe65d;</i>
                  {item.star}
                </span>
                <span className="upload-download">
                  <i className="iconfont">&#xe64a;</i>
                  {item.download}
                </span>
              </div>
            </div>
          </li>
        );
      });
    return (
      <div className="compontmater ">
        {this.props.list.length  ? (
          <div className="content-bg">
            <div style={{ height: "63px", position: "relative" ,width:"1320px",margin:"auto"}}>
              <p className="content-title">
                全站共找到<span style={{ color: "red" }}>{this.props.list.length}</span>条关于
                <span style={{ color: "red" }}>{this.props.value}</span>
                的结果
              </p>
            </div>
            <div className="content">
              <ul className="clearfix">{listLoop(this.props.list)}</ul>
            </div>
            
          </div>
        ) : (
          <Blank listTitle={this.state.title} />
        )}
      </div>
    );
  }
}
export default Compontmater;
