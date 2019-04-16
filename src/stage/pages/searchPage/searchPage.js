import "babel-polyfill";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import Head from "../head/head.js";
import Bottom from "../bottom/bottom.js";
import "./searchPage.less";
import { Input, Pagination ,message} from "antd";

import Compontcollect from "../compontcollect/compontcollect.js"; //品牌规范详情
import Compontmater from "../compontmater/compontmater.js"; // 素材中心详情
import Compontcase from "../compontcase/compontcase.js"; // 案列
import Blank from "../blank/blank.js"; //空数据页面
const Search = Input.Search;
const Url = require("../../app/url");
const Api = require("../../app/api.js");
message.config({
  top: 45,
  duration: 2,
});
class SearchPage extends Component {
  constructor() {
    super();
    this.state = {
      menuNum: 1,
      searchname: "",
      inpValue: "规范",
      inputValue: "",
      title: "抱歉，暂时没有数据",
      data: {},
      list: {},
      current: 2,
      brandRes: [],
      materialRes : []
    };
  }

  // tab切换   2:素材  3：案例
  setMenuNum = num => {
    this.setState({
      menuNum: num,
      current: num + 1
    });
  };

  /**
   *
   * 默认生命周期方法
   */
  componentDidMount() {
    this.getList();
  }
  /**
   *
   * 获取搜索全部的接口数据
   */
  getList() {
    var _self = this;
    Api._ajax({
      url: Url.typesearch,
      success: function(res) {
        if (res.success == true && res.errorCode == 0) {
          _self.setState(
            {
              list: res.data
            },
            () => {
              _self.GetRequest();
            }
          );
        }
      }
    });
  }
  /**
   * 获取url的value值
   *
   */
  GetRequest() {
    let url = location.search; //获取url中"?"符后的字串
    let _self = this;
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      str = str.split("=");
      //分割拿到value值
      str = decodeURI(str[1]);
      this.setState({
        inpValue: str,
        inputValue: str
      },()=>{
        _self.listSearch();

      });
    }
  }

  /**
   * 输入框change事件
   */
  inpChange = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  //搜索
  onSearch(value) {
    var _self = this;
    //获取输入框的输入值
    if (value == null || value == "") {
      return  message.error('搜索框不能为空');;
    } else {
      _self.setState({
        inputValue: value
      },()=>{
        _self.listSearch();
      });
    }

  }
  /**
   * 品牌、素材的搜索方法
   */
  listSearch() {
    var _self = this;
    var brandRes = [];
    var materialRes = []
    _self.state.list.brand.forEach((item, i) => {
      if (
        item.name.indexOf(_self.state.inputValue) > -1 ||
        item.description.indexOf(_self.state.inputValue) > -1
      ) {
        brandRes.push(item);
        // continue;
      }
    });

    _self.state.list.material.forEach((item, i) => {
      if (
        item.title.indexOf(_self.state.inputValue) > -1 ||
        item.desc.indexOf(_self.state.inputValue) > -1
      ) {
        materialRes.push(item);
        // continue;
      }
    });

    _self.setState({
      searchValue : this.state.inputValue,
      brandRes: brandRes,
      materialRes : materialRes
    });
  }

  render() {

    return (
      <div className="search-box clearfix">
        <Head className="search-head" listContent={this.state.current} />
        <div className="search-nav">
          <div className="nav-center">
            <Search

              placeholder="搜索"
              enterButton="搜索"
              size="large"
              value={this.state.inputValue}
              onChange={e => this.inpChange(e)}
              onSearch={value => this.onSearch(value)}
             
            />
          </div>

          <div className="nav-list">
            <ul>
              <li
                className={this.state.menuNum === 1 ? " li-choose " : "li-open"}
                onClick={() => this.setMenuNum(1)}
              >
                品牌
              </li>
              <li
                className={this.state.menuNum === 2 ? " li-choose " : "li-open"}
                onClick={() => this.setMenuNum(2)}
              >
                素材
              </li>
              <li
                className={this.state.menuNum === 3 ? " li-choose " : "li-open"}
                onClick={() => this.setMenuNum(3)}
              >
                案例
              </li>
            </ul>
          </div>
        </div>
        {this.state.menuNum == 1 ? (
          <Compontcollect value={this.state.searchValue} list={this.state.brandRes} />
        ) : (
          ""
        )}
        {this.state.menuNum == 2 ? (
          <Compontmater value={this.state.searchValue} list={this.state.materialRes} />
        ) : (
          ""
        )}
        {this.state.menuNum == 3 ? (
          <Compontcase arr1={this.state.inputValue} />
        ) : (
          ""
        )}

        <Bottom />
      </div>
    );
  }
}

ReactDOM.render(<SearchPage />, document.getElementById("test1"));
