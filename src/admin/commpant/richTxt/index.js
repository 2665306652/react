
import React from 'react'
import $ from "jquery";
import { Link } from "react-router-dom";
// 引入antd
import { Input, Modal, notification } from 'antd';
// 引入样式
import "./index.less";
import '../../public/app.less';
import '../../pages/typeList/index.less';
// 引入编辑器样式
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
// 接口文件
import Api from '../../app/api';
import Url from '../../app/url';
// 引入组件
import UpdataAccessory from './UpdataAccessory.js';
import PhotoUpload from '../photoUpload';
import SelectController from '../select/';
import BreadcrumbOption from '../breadcrumb/index.js';


// const resetData = [];
export default class RichText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      editorState: BraftEditor.createEditorState(null),
      category_id: '',
      //类型
      treeData: [],
      MOdalContent: '',
      imgUrl: '',//封面图
      title: '',//标题
      RtextContent: '',//富文本内容
      targerId: '',//类型id
      files: [],//附件
      desc: '',//文本介绍
      status: '',//保存、提交状态 10 20
      id: '',
      // 路由判断
      // hashValue:''
    }
  }


  /**钩子函数
   * 数据初次渲染
   */
  componentDidMount() {
    let _self = this;
    // this.setState({
    //   hashValue:hashValue
    // })
    _self.refs.selectController && _self.refs.selectController.onClear();
    Api._ajax({
      url: Url.bgetcategorylist,
      success: function (res) {
        _self.setState({
          treeData: res.data,
          // resetData: _self.dataReset(res.data)
        }, () => {
          // _self.getParent(3)
        })
      }
    })
  }


  /**钩子函数
   * 数据发生改变，接收数据
   */
  componentWillReceiveProps() {
    if (this.props && this.props.receiveData) {
      this.setState({
        title: this.props.receiveData.title,
        imgUrl: this.props.receiveData.imgUrl,
        RtextContent: this.props.receiveData.RtextContent,
        targerId: this.props.receiveData.targerId,
        files: this.props.receiveData.files,
        desc: this.props.receiveData.desc,
        status: this.props.receiveData.status,
        id: this.props.receiveData.id,
      })
    }

  }


  /** 弹窗
   * 三种状态方法
   */
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  /**提交/报存
   * verifyData()方法
   * save（）数据处理
   * @param {*提交/保存} type 
   * @param {*数据} data 
   */
  verifyData(type, data) {
    let that = this;
    if (this.refs.conTitle.value == "") {
      this.setState({
        MOdalContent: "标题不能为空"
      })
      this.showModal()
    } else if (this.state.editorState.toHTML() == "") {
      this.setState({
        MOdalContent: "富文本不能为空"
      })
      this.showModal()
    } else if (this.state.desc == "") {
      this.setState({
        MOdalContent: "请完善描述文案"
      })
      this.showModal()
    } else if (this.state.desc.length < 10) {
      this.setState({
        MOdalContent: "描述文案不能少于10个字"
      })
      this.showModal()
    } else if (data.category_id == "") {
      this.setState({
        MOdalContent: "请选择类型"
      })
      this.showModal()
    } else {
      if (type == "save") {
        Api._ajax({
          url: Url.rtxtPresent,
          data: data,
          success: function (res) {
            if (res.code == 200) {
              that.setState({
                category_id: '',
                MOdalContent: '',
                title: '',//标题
                imgUrl: '',//封面图
                annex: '',//附件接收
                desc: '',//文本介绍
                targerId: '',//类型id
                id: '',
                files: [],
              })
              that.refs.braftEditor && that.refs.braftEditor.clearEditorContent();
              that.refs.selectController && that.refs.selectController.onClear();

              notification["success"]({
                message: "文本保存成功!",
                duration: 1
              });
              location.href = "../admin/#/fileList";
            } else {
              notification["error"]({
                message: "文本保存失败!",
                duration: 1
              });

            }

          }
        })

      } else {
        Api._ajax({
          url: Url.rtxtPresent,
          data: data,
          success: function (res) {
            if (res.code == 200) {

              that.setState({
                category_id: '',
                MOdalContent: '',
                title: '',//标题
                imgUrl: '',//封面图
                annex: '',//附件接收
                desc: '',//文本介绍
                targerId: '',//类型id
                id: '',
                files: [],
              })
              that.refs.braftEditor && that.refs.braftEditor.clearEditorContent();
              that.refs.selectController && that.refs.selectController.onClear();
              notification["success"]({
                message: "文本提交成功!",
                duration: 1
              });
              location.href = "../admin/#/fileList";
            } else {
              notification["error"]({
                message: "文本提交失败!",
                duration: 1
              });

            }

          }
        })
      }
    }
  }
  save(type) {
    const data_ = {
      title: this.state.title,
      content: this.state.editorState.toHTML(),
      category_id: this.state.targerId,
      coverimg: this.state.imgUrl,
      status: type == "save" ? 10 : 20,
      introduction: this.state.desc,
      annex: this.state.files,
      id: this.state.id,
    }
    this.verifyData(type, data_)
  }


  /**  预览
   * preview（）预览功能
   * buildPreviewHtml（）预览的初始内容的设置
   */
  preview = () => {
    if (window.previewWindow) {
      window.previewWindow.close()
    }
    window.previewWindow = window.open()
    window.previewWindow.document.write(this.buildPreviewHtml())
    window.previewWindow.document.close()
  }
  buildPreviewHtml() {

    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <link rel="stylesheet" href="../public/css/group.css">
          <link rel="stylesheet" href="../public/css/vendor.css">

          <style>
          html,body{
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: auto;
            background-color: #f1f2f3;
          }
          .container{
            box-sizing: border-box;
            width: 1000px;
            max-width: 100%;
            min-height: 100%;
            margin: 0 auto;
            padding: 30px 20px;
            overflow: hidden;
            background-color: #fff;
            border-right: solid 1px #eee;
            border-left: solid 1px #eee;
          }
          .container img,
          .container audio,
          .container video{
            max-width: 100%;
            height: auto;
          }
          .container p{
            white-space: pre-wrap;
            min-height: 1em;
          }
          .container pre{
            padding: 15px;
            background-color: #f1f1f1;
            border-radius: 5px;
          }
          .container blockquote{
            margin: 0;
            padding: 15px;
            background-color: #f1f1f1;
            border-left: 3px solid #d1d1d1;
          }
        

          .fileContent_title {
            font-size: 33px;
            color: #010000;
          }
          .file_linkman {
            font-size: 22px;
            color: #666666;
            line-height: 33px;
          }
          .file_content {
            border-bottom: 2px solid #ccc;
            min-width: 958px;
          }

          .Updata_txt {
            margin-top: 30px;
          }
          .Updata_txt h3{
            font-size: 24px;
            color: #333333;
            line-height: 33px;
          }
          .Updata_txt ul {
            list-style: none
          }
          .Updata_txt li {
            border: 1px solid #D1D1D1;
            margin: 20px 0;
            display: flex;
            justify-content: space-between;
            padding: 10px 10px;
          }
          .Updata_txt li .iconfont{
            font-size: 26px;
            padding: 0 20px;
          }
          .Txtcontent {
            width:958px;
            height:100%;
            word-wrap:break-word;
            word-break:break-all;
          }
          </style>
        </head>
        <body>
          <div class="container">
                <div class="authorityFile">
                  <div class='fileContent'>
                     
                      <div class='file-content file_content'>
                         
                          <h1 class="fileContent_title">支付宝线下支付产品视觉设计语言 [重要]<h1>
                          <p class='file_linkman'>本文档所描述的内容，是我们对支付宝线下实体产品（包括但不限于贴纸、立牌、IOT设备、周边的一个通用品牌设计指南，更多的是进行设计风格和方向的参考和指导。</p>
                          <p class='file_linkman'>如有任何问题请联系：<span>可峰/江寻</span></p>
                          <p class='file-time'><i className='iconfont'>&#xe6c6;</i><span>2018.09.20</span></p>
                      </div>


                      <div class="Updata_txt">
                              <h3>下载完整版规范文档案：<h3>
                            <ul>
                              <li>
                                  <span><i class='iconfont'>&#xe64a;</i>支付宝线下支付产品设计语言系统01 .pdf (72.13MB)</span>
                                  <span><i class='iconfont'>&#xe64a;</i>下载</span>
                              </li>
                              <li>
                                  <span><i class='iconfont'>&#xe64a;</i>支付宝线下支付产品设计语言系统01 .pdf (72.13MB)</span>
                                  <span><i class='iconfont'>&#xe64a;</i>下载</span>
                              </li>
                            </ul>
                      </div>
                      <div class="Txtcontent">
                        ${this.state.editorState.toHTML()}
                      </div>    
                  </div>      
            </div>
          </div>
        </body>
      </html>
    `


  }


  // 上传图片组件，设置参数
  photoChange = (img) => {
    this.setState({
      imgUrl: img
    })
  }
  // 描述文案，获取value值
  descChange = (e) => {
    this.setState({
      desc: e.target.value
    })
  }
  // 标题，获取value值
  TitleChange = (e) => {
    this.setState({
      title: e.target.value
    })
  }

  /**数据渲染
   * 
   */
  render() {
    const editorProps = {
      value: this.state.editorStste,
    }
    const media = {
      allowPasteImage: true,
      image: true,
      video: false,
      audio: false,
      validateFn: null,
      uploadFn: this.OuruploadFn,
      removeConfirmFn: null,
      onRemove: null,
      onChange: null,
      onInsert: null,
    }

    const hashValue = location
            .hash
            .split('#')[1];
            console.log(hashValue)
    return (
      <div className="rich">
        
        {hashValue=="/newDocument"
        ?<div className="rich-text" >
            <BreadcrumbOption />
            <div className='mcdclick'>
              <a  onClick={this.save.bind(this, 'save')} >保存</a>
              <a  onClick={this.preview.bind(this)}>预览</a>
              <a  onClick={this.save.bind(this, 'issue')} type="primary" >发布</a>
            </div>
        </div>
        :<BreadcrumbOption />
        }

        <div className="rich-content">

          <div className="con_main">

            <BraftEditor ref='braftEditor' {...editorProps} onChange={this.handleChange = (editorState) => {
              this.setState({ editorState, RtextContent: editorState });

            }} media={media}
              value={this.state.RtextContent}
            />

          </div>

          <div className="contact_describe">
            <span className="contact_title">标题</span>
            <Input placeholder="给项目加一个标题吧"
              ref="conTitle"
              style={{ outline: "none" }}
              value={this.state.title}
              onChange={this.TitleChange} />
          </div>


          <div className="contact_describe">
            <span className="contact_title">描述文案</span>
            <Input placeholder="给项目加一个说明吧" value={this.state.desc} ref="Introduce" onChange={this.descChange} />
          </div>


          <div className="especially_bar">
            <span className="especially_title">上传封面</span>

            <PhotoUpload
              className={"details-photo " + (this.state.avatarStatus
                ? ''
                : 'msg-error')}
              old_name={this.state.imgUrl}
              type="doc"
              photo={this.state.imgUrl}
              photoUpload={this.photoChange} />
          </div>

          <Modal
            title="提示"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            cancelText='取消'
            okText='确定'
          >
            <p>{this.state.MOdalContent}</p>
          </Modal>
        </div>

      </div>
    )
  }

}