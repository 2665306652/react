import "babel-polyfill";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "antd/dist/antd.css";
import Avatar from '../avatar/avatar.js';
import './head.less';
const Url = require("../../app/url");
const Api = require("../../app/api.js");
class Head extends Component{
	constructor(props) {
		super(props);
		this.state = {
			avatar: {
				avatar_url: "https://work.alibaba-inc.com/photo/122456.220x220.jpg",
			    cname: "往尘",
			    dep: "蚂蚁金服-支付宝事业群-支付宝技术部-支付与客户业务技术部-营销技术部-前端技术组-杭州",
			    email: "reacher.lq@alibaba.net",
			    lastName: "鲁强",
			    workid: "122456",
			    isAdmin: true
			}
		}
	}
	componentDidMount() {
		this.getList(); //获取个人信息 window.context.user
		this.getLogo();

	}
	//获取我的基本信息
	getList= () => {
		let _self =this;
		//挂载 context.user  在正常作用下 打开注释 
	      // let avatar =  window.context.user;
	      // console.log(avatar);
	   //    this.setState({
				// avatar: avatar
	   //    });
	}
	//获取左边图片 商标
	getLogo = () => {
		let _self =this;
		Api._ajax({
			url: Url.getlogo,
			success: function(res){
				_self.setState({
					logo : res.img,
					tit : res.text
				})
			}
		})
	}
	render(){ 
		return (
			<div className="mian-head clearfix">
		        
		        <ul className='header-list'>
		        	<li>
						<a href="./index.html">
							<div className='header-logo'>
								<img  src = {this.state.logo} alt=""/>
								{this.state.tit}
					        </div>
			        	</a>
		        	</li>
					<li className='center-list  clearfix'>
						<a href="./index.html"><div className={this.props.listContent == 1 ? 'header-current' : ''}>首页</div></a>
						<a href="./collectPage.html"><div  className={this.props.listContent == 2 ? 'header-current' : ''}>品牌规范</div></a>
						<a href="./materialPage.html"><div  className={this.props.listContent == 3 ? 'header-current' : ''}>素材中心</div></a>
						<a href="javaScript:(0);"><div  className={this.props.listContent == 4 ? 'header-current' : ''}>设计案例</div></a>
					</li>
					<li>
						<Avatar sendAvatar={this.state.avatar}></Avatar>
					</li>
		        </ul>
				
		    </div>
			)
	}
}
export default Head;