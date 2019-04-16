import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./blank.less";

const Url = require("../../app/url");
const Api = require("../../app/api.js");

class Blank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleState:1,//空页面状态

    };
  }

  componentDidMount(){
    
  }
  render() {
    const listTitle = this.state.titleState
    return (
      <div>
        <div className="case-img">
          <img src={"./public/images/no-material.png"} />
        </div>
        <div className="case-title">
          <p>{this.props.listTitle}</p>
        </div>
        <div className="case-link">
          <a href="./index.html">返回首页</a>
        </div>
      </div>
    );
  }
}
export default Blank;
