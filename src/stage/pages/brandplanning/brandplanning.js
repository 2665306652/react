import "babel-polyfill";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './brandplanning.less';
import Head from '../head/head.js';
import Bottom from '../bottom/bottom.js';

import { Anchor, Spin,message, Button } from 'antd';
import classNames from 'classnames';
import Blank from "../blank/blank.js";
import LazyLoad from 'react-lazy-load';// 懒加载
const { Link } = Anchor;
const Url = require("../../app/url");
const Api = require("../../app/api.js");

class BrandPlanning extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contentLClass: "bpContent-leftBox",
			contentRClass: "bpContent-rightBox",
			ulClass: '',//控制样式

			collectStar: true,//显示的文本
			navIndex: 0,//导航栏当前索引
			isScrollTop: true,
			body_html: [],//中间部分内容
			bodyData:[],//中间部分标题
			navList: [],//导航栏
			sidebarRightList: [],
			routerParameter: '',//截取导航栏中的路径参数
			query: '',//截取跳转页面中的参数（获取参数，匹配导航栏高亮效果）
			anchor: '',//锚点跳转
			index: "",//导航栏的value值(参数)
			current: 2,//头部公共组件的参数
			spinning: true,//懒加载

			title: "抱歉，品牌暂时还未上传哦",//无数据显示文本
		};
	};
	componentDidMount() {
		let _this = this;
		window.onscroll = () => {
			//获取滚动条滚动的距离
			let componentDidMountHeight = window.pageYOffset;
			if (componentDidMountHeight > 138) {
				if (_this.state.isScrollTop) {
					_this.setState({
						contentLClass: "bpContent-leftBox conditionArea_Lfixed",
						contentRClass: "bpContent-rightBox conditionArea_Rfixed",
						isScrollTop: false,
						ulClass: 'ulClass',
					});
				}
			} else {
				if (!_this.state.isScrollTop) {
					_this.setState({
						contentLClass: "bpContent-leftBox",
						contentRClass: "bpContent-rightBox",
						ulClass: '',
						isScrollTop: true,
					});
				}

			}
		}
		let query = _this.getQueryString('slug');
		if (query) {
			console.log(query);
			// 内容请求
			Api._ajax({
				url: Url.detailBodyContent,
				type: 'GET',
				success: function (res) {
					_this.setState({
						query: query,
						body_html: res.data.body_html,
						spinning: false,
						bodyData:res.data,
					})
				}
			});
			// 锚点请求
			Api._ajax({
				url: Url.detailBodyAnchor,
				type: 'GET',
				success: function (res) {
					_this.setState({
						sidebarRightList: res.data,
					})
				}
			});
			// 导航栏请求
			Api._ajax({
				url: Url.detailBodyNav,
				type: 'GET',
				success: function (res) {
					_this.setState({
						navList: res.data,
					})
				},error:function(){
					_this.setState({
						navList: [],
					})
				}
			});
		} else {
			return '页面缺少参数'
		}
		// this.dataUpdata()

	};

	componentDidUpdate() {
		window.onscroll = () => {
			//获取滚动条滚动的距离
			let componentDidUpdateHeight = window.pageYOffset;
			if (componentDidUpdateHeight < 138) {
				this.setState({
					ulClass: '',
				})
			} else {
				this.setState({
					ulClass: 'ulClass',
				})
			}
		}
	}
	/**
	 * 截取路径参数
	 * @param {*} name 传入路径
	 */
	getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}

	// 数据更新
	dataUpdata() {
		const _this = this
		const routerID = this.state.routerParameter
		Api._ajax({
			url: Url.detailBody + routerID,
			type: 'GET',
			success: function (res) {
				_this.setState({
					body_html: res.data.body_html,
				})
			}
		});
	}


	// 侧边导航栏样式方法
	HandleClick = (navIndex, value) => {
		this.setState({
			query: value,
			routerParameter: value
		}, () => {
			window.history.replaceState('aa', '', './brandplanning.html?slug=' + value)
		});
	}

	/**
     * 收藏方法
     */
	CollectStar = () => {
		var collectStarBoolean = this.state.collectStar ? false : true
		this.setState({
			collectStar: collectStarBoolean
		})
		if(this.state.collectStar){
			this.success()
		}else {
			this.warning()
		}
		
	}

	success = () => {
		message.success('已收藏');
	  };
	warning = () => {
		message.warning('取消收藏');
	  };
	  error = () => {
		message.error('页面参数不正确');
	  };
	render() {

		return (
			<div className="brandplanning">
				{/* 头部 */}
				<Head listContent={this.state.current} />

				{/* 面包屑 */}
				<div className="brandplanning-navMenu">
					<a href="./collectPage.html"><span>品牌规范 / </span></a>
					<span className="navMenu-current">支付宝基础品牌系统</span>
				</div>


				{/* 内容 */}
				{
					this.state.navList != ''
						? <div className="brandplanning-content" >
							<div style={{ height: "100%", width: '100%' }}>
								{/* 内容左边导航栏 */}
								<div className="bpContent-left">
									<div className={this.state.contentLClass}>
										<ul className={this.state.ulClass}>
											{
												this.state.navList.map((item, i) => {

													return <a href='javacript:void(0);' key={i}
														onClick={this.HandleClick.bind(this, i, item.slug)}
														value={item.slug}
														id={item.id}
														className={this.state.query == item.slug ? 'nav-item active' : 'nav-item'}>
														{item.title}</a>
												})
											}
										</ul>

									</div>
								</div>

								{/* 中间部分 */}
								<LazyLoad>
								<div className="bpContent-middle" >
									<div className='bpCmiddle-content'>
										<h2 className="bpCmiddle-content-title">{this.state.bodyData.title}</h2>
										{/* <p className="bpCmiddle-content-description">{this.state.bodyData.book.description}</p> */}
										{/* <i className="bpCmiddle-content-segmentation"/> */}
										<Spin size="large" spinning={this.state.spinning}>
											<div dangerouslySetInnerHTML={{ __html: this.state.body_html }}></div>
										</Spin>

									</div>
									<div className='collect' onClick={this.CollectStar}>
										{
											this.state.collectStar
												? <div><i className='collect-star'>&#xe65d;</i><span>收藏</span></div>
												: <div style={{backgroundColor:'rgb(24, 144, 255)'}}><i className='Tcollect-star'>&#xe65d;</i><span style={{color:'#fff'}}>已收藏</span></div>
										}

									</div>
								</div>
								</LazyLoad>
								{/* 右边瞄点 */}
								<div className="bpContent-right">
									<div className={this.state.contentRClass}>
										<Anchor>
											{
												this.state.sidebarRightList.map((item, i) => {
													var LinkHref = '#' + item.id
													return <Link href={LinkHref} title={item.title} key={i} ></Link>
												})
											}
										</Anchor>
									</div>
								</div>
							</div>
						</div>
						:
						<Blank listTitle={this.state.title} />
				}


				{/* 底部 */}
				<Bottom />
			</div>
		)

	}
}
ReactDOM.render(<BrandPlanning />, document.getElementById("brandplanning"));