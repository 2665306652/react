import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './bottom.less';
class Bottom extends Component{
	render(){
		return (
			<div className="bottom">
		        <p className='bottom-help'><span>帮助</span><span>隐私</span><span>条款</span></p>
				<p className='bottom-introduce'>Copyright <i>&#xe654;</i> 2018 支付宝UED品牌营销组出品</p>
		    </div>
			)
	}
}
export default Bottom;