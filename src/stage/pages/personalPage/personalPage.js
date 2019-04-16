import "babel-polyfill";

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './PersonalPage.less';
import Head from '../head/head.js';
import Bottom from '../bottom/bottom.js';
import { Input, Pagination, message} from "antd";
import { Button } from 'antd';
const Url = require("../../app/url");
const Api = require("../../app/api.js");
message.config({
  top: 30,
  duration: 2,
});
class PersonalPage extends Component{
	constructor(props) {
		super(props);
		this.state = {
			current : 3,// 传值head
			uploadList : [], // 我的下载
			greetList : [], //我的收藏
			imgSrc: '',
			nameinput: '',
			title: '',
			imgFile: '',
			currentPage1: 1,//当前页
			currentPage2: 1,
			defaultCurrent: 1, //默认当前页
			defaultPageSize: 6,
			total: 12,
			avatar: {// *****************  获取当前个人信息  需要清除    *******************
				avatar_url: "https://work.alibaba-inc.com/photo/122456.220x220.jpg",
			    cname: "往尘",
			    dep: "蚂蚁金服-支付宝事业群-支付宝技术部-支付与客户业务技术部-营销技术部-前端技术组-杭州",
			    email: "reacher.lq@alibaba.net",
			    lastName: "鲁强",
			    workid: "122456",
			    isAdmin: true
			}// *****************  获取当前个人信息  需要清除    *******************
		}
	}
	componentDidMount() {
		// this.getList();  // 获取个人信息 挂载 context.user  在正常作用下 打开注释 
		this.getcollect();//获取个人收藏
		this.getupload();//获取个人下载
	}
	//获取我的基本信息 挂载 context.user  在正常作用下 打开注释 
	getList= () => {
		let _self =this;
	  	  let avatar =  window.context.user;
	  	  this.setState({
		    avatar: avatar,
		    nameinput: avatar.cname,
			title: avatar.dep
	 	  });
	}

	//个人信息提交
	userdetailsButton = () => {
		let _self =this;
		//检验
		if(this.state.nameinput == '' || this.state.title == '') {
			return message.error('提交失败，昵称/职业不能为空');
		}
		let user = {
			cname : this.state.nameinput,
			avatar : this.state.imgFile,
			title : this.state.title
		}
		Api._ajax({
			url : Url.personage,
			success: function(res) {
				if(res.success == true && res.errorCode == 0) {
					_self.setState({
						nameinput : '',
						imgFile : '',
						title : ''
					})
					message.success('提交成功');
					_self.getList();//再次拉取下信息。或者刷新页面

				} else{
					message.error('提交失败');
					_self.setState({
						nameinput : '',
						imgFile : '',
						title : '',
						imgSrc : ''
					})
				}
			}
		})
	}


	//点击收藏，下载，个人设置 改变状态 默认状态为3 （个人中心） 其它 1为（收藏）2（下载）
	stateChange = num => {
		this.setState({
			current : num
		});
	}
	//获取我的下载数据
	getupload = () => {
		let _self = this;
		//获取我的下载的数据
		Api._ajax({
			url: Url.getupload,
			type: 'get',
			success: function(res) {
				if(res.success == true && res.errorCode == 0) {
					_self.setState({
						uploadList : res.data
					})
				}else{
					_self.setState({
						uploadList : ''
					})
				}
			}
		});
	}
	//获取我的收藏
	getcollect = () => {
		let _self = this;
		//获取我的收藏入口数据
		Api._ajax({
			url: Url.getcollect,
			type: 'get',
			success: function(res) {
				if(res.success == true && res.errorCode == 0) {
					_self.setState({
						greetList : res.data
					})
				}else{
					_self.setState({
						greetList : ''
					})
				}

			}
		});
	}
	//页码改变 
	onChange1 = (page) => {
		this.setState({
			currentPage1: page
		},() => {
			//调接口
		})
	}
	//页码改变 
	onChange2 = (page) => {
		this.setState({
			currentPage2: page
		},() => {
			//调接口
		})
	}





	//图片验证。
	//上传图片
	 photoChange = e => {
	    var _self = this;
	    var inputRefs = this.refs.photoInput;
	    var formData = new FormData();
	    var fileSize = inputRefs.files[0].size / 1024 / 1024;
	    let url;
	    if(window.createObjectURL != undefined) { // basic
			url = window.createObjectURL(inputRefs.files[0]);
		} else if(window.URL != undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(inputRefs.files[0]);
		} else if(window.webkitURL != undefined) { // web_kit or chrome
			url = window.webkitURL.createObjectURL(inputRefs.files[0]);
		}
		var formats = e.target.value.match(/\.jpg$|\.jpeg$|\.gif$|\.png$/i);
		// 上传头像检验
		    if (!formats || formats.length == 0) {
		      // Api.tost('格式错误')
		      message.error('格式错误, 请上传jpg/png/gif/jpeg格式');
		      return false;
		  	}else if (fileSize > 50) {
		      message.error('头像上传失败，请上传小于50M的图片！');
		      return false;
		  	}
		this.setState({
			imgSrc: url,
			imgFile:  inputRefs.files[0]
		});
	}

	//信息上传
	userButton = () => {
		let userdetails = {
			cname: this.state.cname,
		}
	}
	//输入框change 变化
	//昵称
	nameChange = (e) => {
		this.setState({
			nameinput: e.target.value
		})
	}
	//职业
	titleChange = (e) => {
		this.setState({
			title: e.target.value
		})
	}
	render(){
        const greetList  = data => data.map((item,i) => {
        	let time = item.modified_at.split(' ');
        	let url = './foddercentre.html?id=' + item.id + '&&lisId=' + item.id;
        	return 	<a href={url} key={i}>
					<li className='upload-greet'>
						<img src={item.thumb} alt="" />
						<div className ='upload-bottom'>
							<span>{item.title}</span>
							<p>{item.desc}</p>
							<div>
								<span className='home-upload-name'>{item.designer}{time[0]}上传</span>
								<span className='home-upload-collect'><i className='iconfont'>&#xe65d;</i>{item.star}</span>
								<span className="upload-download"><i className='iconfont'>&#xe64a;</i>{item.download}</span>
							</div>
						</div>
					</li>
        		</a>
        })
        const uploadList  = data => data.map((item,i) => {
        	let time = item.modified_at.split(' ');
        	let url = './foddercentre.html?id=' + item.id + '&&lisId=' + item.id;
        	return 	<a href={url} key={i}>
					<li className='upload-greet'>
						<img src={item.thumb} alt="" />
						<div className ='upload-bottom'>
							<span>{item.title}</span>
							<p>{item.desc}</p>
							<div>
								<span className='home-upload-name'>{item.designer}{time[0]}上传</span>
								<span className='home-upload-collect'><i className='iconfont'>&#xe65d;</i>{item.star}</span>
								<span className="upload-download"><i className='iconfont'>&#xe64a;</i>{item.download}</span>
							</div>
						</div>
					</li>
        		</a>
        })
        let userMessage;
        if(this.state.current == 1 ) {
        	userMessage = this.state.greetList != '' ? (<div className='personal-upload'><ul className='clearfix'>
								{greetList(this.state.greetList)}
							</ul> <Pagination hideOnSinglePage={true} pageSize={6} current={this.state.currentPage2} defaultCurrent={1} total={100} onChange={this.onChange2}/></div>
							 ) : (<div className='personal-none'><img src="./public/images/no-material.png" /><p>抱歉,您暂未收藏</p><a href="./index.html">返回主页</a></div>);
        }else if(this.state.current == 2) {
        	userMessage = this.state.greetList != '' ? (<div className='personal-upload'><ul className='clearfix'>
								{greetList(this.state.uploadList)}
							</ul> <Pagination hideOnSinglePage={true} pageSize={6} current={this.state.currentPage1} defaultCurrent={1} total={100} onChange={this.onChange1}/></div>
							 ) : (<div className='personal-none'><img src="./public/images/no-material.png" /><p>抱歉,您暂未收藏</p><a href="./index.html">返回主页</a></div>);
		}else if(this.state.current) {
			userMessage = (<div className='personal-username'>
							<span>昵称</span>
							<Input placeholder="请输入昵称" maxLength="12" value={this.state.nameinput} onChange={(e) => this.nameChange(e)}/>
							<span>职业</span>
							<Input placeholder="请输入职业" maxLength="50" value={this.state.title} onChange={(e) => this.titleChange(e)}/>
							<span>更换头像</span>
							<div className='upload-img'>
								<i>&#xe74a;</i>
								<span>点击添加图片 </span>
								<p>（支持JPEG,PNG,最大50M）</p>
								<img src={this.state.imgSrc} width='237' height='237' alt=""/>
								<input
						            className="inputStyle"
						            type="file"
						            ref="photoInput"
						            onChange={this.photoChange}
						        />
							</div>
							<Button onClick={this.userdetailsButton}>确认修改</Button>
						</div>);
		}
		return (
				<div>
					<Head></Head>
					<div className='personal-center'>
						<div className='personal-user'>
							<img src={this.state.avatar.avatar_url} alt="" />
							<span>{this.state.avatar.cname}</span>
							<p>{this.state.avatar.dep}</p>
							<ul>
								<li className={this.state.current == 1 ? 'lis-current' : ''} onClick={() => this.stateChange(1)}><i>&#xe65d;</i>我的收藏</li>
								<li className={this.state.current == 2 ? 'lis-current' : ''} onClick={() => this.stateChange(2)}><i>&#xe668;</i>我的下载</li>
								<li className={this.state.current == 3 ? 'lis-current' : ''} onClick={() => this.stateChange(3)}><i className='icon'>&#xe72e;</i>个人设置</li>
							</ul>
						</div>
						{userMessage}
					</div>
					<Bottom></Bottom>
				</div>
		)
	}
}
ReactDOM.render(<PersonalPage/>,document.getElementById("test1"));