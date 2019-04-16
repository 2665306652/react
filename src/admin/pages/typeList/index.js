import React, { Component } from "react";

import { Tree, Button, Icon, Modal, Input, notification } from "antd";

import "antd/dist/antd.css";
import "./typelist.less";

import BreadcrumbOption from "../../commpant/breadcrumb";
import PhotoUpload from "../../commpant/photoUpload";

import Api from "../../app/api";
import Url from "../../app/url";

class TypeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delVisible: false,
      visible: false,
      editTitle: "",
      editDesc: "",
      editPhoto: "",
      editId: "",
      id:"",
      title: "",
      img: "",
      content: "",
      introduction:'',
      list: []
    };
  }

  if(editTitle ='') {
    console.log(123131)
    return {status:false,msg:'标题不能为空！'}
  }

  handleCancel = e => {
    this.setState({
      visible: false,
      delVisible: false
    });
  };
  delSure = e => {};
  //上传
  handleSure = e => {
    let _self = this;
    Api._ajax({
      url: Url.json,
      //   dataType: "json",
      success: function(res) {
        console.log(res);
        _self.setState({
        });
      }
    });


  };
  // 文档标题
  itemTitleChange = e => {
    this.setState({
      editTitle: e.target.value
    });
  };
  //文档说明
  itemExplainChange = e => {
    this.setState({
      editExplain: e.target.value
    });
  };
  //文档类型
  itemTypeChange = e => {
    this.setState({
      editType: e.target.value
    });
  };
  //图片
  photoUpload = imgUrl => {
    this.setState({
      editPhoto: imgUrl
    });
  };
  //点击添加
  addType = e => {
    this.setState({
      visible: true
    });
  };

  componentDidMount() {
    let _self = this;
    Api._ajax({
      url: Url.json,
      //   dataType: "json",
      success: function(res) {
        console.log(res);
        _self.setState({
          list: res
        });
      }
    });
  }
  //删除
  delete =() =>{
    let _self = this;
    Api._ajax({
      url: Url.json,
      data: {
        id: this.state.id
      },
      success: function(res) {
      }

  })
}
//编辑
edit =()=>{
  let _self = this;
    Api._ajax({
      url: Url.json,
      data: {
        id: this.state.id,
        title:this.state.title,
        content:this.state.content,
        img:this.state.img,
        introduction:this.state.introduction
      },
      success: function(res) {
      }

  })
}
  render() {
    const listLoop = data =>
      data.map((item, i) => {
        return (
          <li className="list-item" key={i}>
            <div className="list-box">
              <div className="list-img">
                <img src={item.img} alt="" className="list-photo" />
              </div>
              <div className='list-center'>
              <span className="list-title">{item.title}</span>
              <p className="list-content">{item.content}</p>
              </div>
            </div>
            <div className="list-bottom">
            <i onClick={this.edit} className='iconfont'>&#xe8cc;</i>
            <i onClick={this.delete} className='iconfont'>&#xe608;</i>
            </div>
          </li>
        );
      });

    return (
      <div className="content typelist-main">
        <BreadcrumbOption />
        <ul className="main-list">
          <li className="list-item list-add-item" onClick={this.addType}>
            <img
              className="item-add"
              src={require("../../public/images/typeList-add.png")}
              alt=""
            />
          </li>
          {listLoop(this.state.list)}
        </ul>

        <Modal
        //   title={this.state.editId ? "编辑类目" : "新增类目"}
          visible={this.state.visible}
         
          onCancel={this.handleCancel}
          onOk={this.handleSure}
          okText="确定上传"
          cancelText="取消"
          
         >
          <div className="typelist-edit-main">
            <div className="main-title main-item">
              <span className="select-title">文档名称<i>*</i></span>
              <Input
              className='item-input'
                maxLength={20}
                value={this.state.editTitle}
                placeholder="请作品名称"
                onChange={this.itemTitleChange}
              />
              {this.state.msg}
            </div>
            <div className="main-title main-item">
              <span className="select-title">文档说明<i>*</i></span>
              <Input
               className='item-input'
              style={{marginBottom:"28px"}}
                maxLength={20}
                value={this.state.editExplain}
                placeholder="这是一段说明"
                onChange={this.itemExplainChange}
              />
            </div>
            <div className="main-title main-item">
              <span  className="select-title">文档类型<i>*</i></span>
              <Input
               className='item-input'
               style={{width:'380px', marginBottom:"30px"}}
                maxLength={20}
                value={this.state.editType}
                placeholder="品牌规范"
                onChange={this.itemTypeChange}
              />
            </div>
            <div className="main-title main-item">
              <span className="select-title">图片上传<i>*</i></span>
              <PhotoUpload photoUpload={this.photoUpload} />
            </div>

            <div className="edit-msg">{this.state.msg}</div>
          </div>
        </Modal>
      
      </div>
    );
  }
}

export default TypeList;
