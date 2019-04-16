import "babel-polyfill";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './avatar.less';
import { Menu, Dropdown, Icon } from 'antd';
import "antd/dist/antd.css";
const Url = require("../../app/url");
const Api = require("../../app/api.js");
const openNotificationWithIcon = type => {
  notification[type]({
    message: "Notification Title",
    duration: 2,
    description: "添加成功"
  });
};
class Avatar extends Component{
	constructor(props) {
		super(props);
		this.state = {
			id: 0,
			avatar: null,
			username: null,
			role: null,
			msg:null,
			seekAnm: 'iconfont seek',
			huntAnm: 'hunt-input',
			inpValue: '',
		}

	}
	componentDidMount= () => {
	}
	//点击放大镜 动画（添加classname）
	clickSeek= () => {
		this.setState({
			seekAnm: 'iconfont seek seek-anm',
			huntAnm: 'hunt-input hunt-input-anm'
		});
	}
	//监听键盘按下enter 搜索页面
	enterdown = (e) => {
		let value = this.state.inpValue.replace(/\s/g, "");
		if(e.keyCode == 13 && this.state.inpValue.length != 0 && value.length !=0 ) {
			location.href = './searchPage.html?value=' + value;
		}
	}
	//输入框change事件
	inpChange= (e) => {
		this.setState({
			inpValue: e.target.value
		})
	}
	//退出账号
	// getAccountOut= () => {
	// 	let _self = this;
	// 	Api._ajax({
	// 		url: Url.bsignout,
	// 		success: function(res) {
	// 			if(res.code == 200) {
	// 				location.href = './login.html';
	// 			}else {
	// 				console.log('退出失败！');
	// 			}
	// 		}
	// 	})
	// }
	render(){
		const menu = (
			  <Menu>
			    <Menu.Item>
			      <a className='header-user-home'  href="./personalPage.html">个人中心</a>
			    </Menu.Item>
			  </Menu>
		);
		return (
		        <div className='head-seek'>
		        	<p className='avatar-hunt'>
						<i className={this.state.seekAnm} onClick={() => this.clickSeek()}>&#xe64d;</i>
		        		<input className={this.state.huntAnm} placeholder='站内搜索' value = {this.state.inpValue} onChange= {(e) =>this.inpChange(e)} onKeyDown = {e => this.enterdown(e)} type="text" />
		        	</p>
		        	<span className='upload'><i className='iconfont'>&#xe672;</i>上传</span>
					<Dropdown placement='bottomCenter' overlay={menu}>
						<div className="ant-dropdown-link" >
						    <img className='user-avatar' width='24' height='24' src={this.props.sendAvatar.avatar_url} alt="" />
						    <span className='head-user-name'>{this.props.sendAvatar.cname}</span>
						</div>
					</Dropdown>
				</div>
			)
	}
}
export default Avatar;