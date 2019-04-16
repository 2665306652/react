import React, { Component } from "react";
import ReactDOM from "react-dom";
import Blank from "../blank/blank.js";

const Url = require("../../app/url");
const Api = require("../../app/api.js");

class Compontcase extends Component {
  constructor(props) {
    super(props);
    this.state = {
        title:'抱歉、暂时没有案例',
      titleState:1,//空页面状态

    };
  }

  componentDidMount(){
    
  }
  render() {
    const listTitle = this.state.titleState
    return (
      <div>
       {this.state.list="" ?(<Blank listTitle={this.state.title}/>):(<Blank listTitle={this.state.title}/>)}
      </div>
    );
  }
}
export default Compontcase;
