import "babel-polyfill";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import Head from '../head/head.js';
import Bottom from '../bottom/bottom.js';
import { Carousel } from 'antd';
import LazyLoad from 'react-lazy-load';
const Url = require("../../app/url");
const Api = require("../../app/api.js");
class Wrap extends Component{
	constructor(props) {
		super(props);
		this.state = {
			titleList : [],
			greetList : [],
			current : 1 , //记录首页状态
			banner : [],
		}
	}
	componentDidMount() {
		// this.getList();
		this.gettitle();//get首页数据入口
	}
	//上一张
	handlePrev = ()=>{
	    this.refs.img.prev(); //ref = img
	}
	//下一张
 	handleNext = ()=>{
	    this.refs.img.next();
	}
	//获取list数据
	gettitle = () => {
		let _self = this;
		//获取首页四个固定标题入口数据
		Api._ajax({
			url: Url.homePage,
			success: function(res) {
				_self.setState({
					titleList : res.jxzj,
					banner : res.banner
				})
			}
		});
		//获取首页最受欢迎的数据
		Api._ajax({
			url: Url.getgreet,
			success: function(res) {
				_self.setState({
					greetList : res
				})
			}
		});
	}
    //点击跳转链接
    linkClick = (id,lisId) => {
    	// location.href = 'foddercentre.html?id=' + id;
    	window.open("foddercentre.html?id=" + id + '&&lisId=' + lisId);   
    }
    //四个固定入口跳转链接
    linksClick = (link) => {
    	location.href = link;
    }
	render(){
		const titleList = data => data.map((item, i) => {
                return 		<li className='clearfix page-bestAlbum' key={i} onClick={() => this.linksClick(item.url)}>
								<LazyLoad height={345}><img src={item.background} alt=""/></LazyLoad>
								<div className='matte'>
									<img src={item.icon} alt=""/>
									<span>{item.title}</span>
								</div>
								<div className='matte-introduce'>
									<span>{item.title}</span>
									<p>{item.content}.</p>
									<a href={item.url}>详ddddd情></a>
								</div>
							</li>
        })
        const greetList = data => data.map((item,i) => {
        	let time = item.modified_at.split(' ')[0];
        		return 	<li className='upload-greet' key={i} onClick={() => this.linkClick(item.id,item.id)}>
							<LazyLoad height = { 211 }><img src={item.thumb} alt="" /></LazyLoad>
							<div className ='upload-bottom'>
								<span>{item.title}</span>
								<p>{item.desc}</p>
								<div >
									<span className='home-upload-name'>{item.designer}{time}上传</span>
									<span className='home-upload-collect'><i className='iconfont'>&#xe65d;</i>{item.star}</span>
									<span className="upload-download"><i className='iconfont'>&#xe64a;</i>{item.download}</span>
								</div>
							</div>
						</li>
        })
        const Banner = data => data.map((item,i) => {
        	return <div key={i}><a href={item.link}><img src={item.img} height="390" alt="" /></a></div>
        })
		return (
			<div className='head-page'>	
				<Head  listContent={this.state.current}></Head>
					<div className='head-lb'>
						<i className='head-prev iconfont' type='left' theme='outlined' onClick={this.handlePrev}>&#xe65a;</i>
						<Carousel 
							autoplay
							ref='img'
						>
						    {Banner(this.state.banner)}
						</Carousel>
						<i className='head-next iconfont' type='right' theme='outlined' onClick={e => this.handleNext()}>&#xe659;</i>
					</div>
				<p className='best-album'>精选专辑</p>
				<ul className='clearfix'>
					{titleList(this.state.titleList)}
				</ul>
				<p className='best-album'>最受欢迎</p>
				<ul className='clearfix'>
					{greetList(this.state.greetList)}
				</ul>
				<Bottom></Bottom>
			</div>
		)
	}
}
ReactDOM.render(<Wrap/>,document.getElementById("test1"));