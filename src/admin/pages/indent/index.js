import React, { Component } from 'react';

import "./index.less";
import Api from '../../app/api';
import Url from '../../app/url';
import BreadcrumbOption from "../../commpant/breadcrumb";


// 引入antd
import moment from 'moment';
import { Table, Divider, Tag, Input, Icon, Modal, Button, DatePicker } from 'antd';
const { RangePicker } = DatePicker;
// 订单管理
class Indent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page:1,
            searchValue: '',
            data: [],
            visible: false,
            deleteId: '',
            bol: false,
            columns: [
                {
                    title: '记录id',
                    dataIndex: 'id',
                    key: 'id',
                }, {
                    title: '订单号',
                    dataIndex: 'orderid',
                    key: 'orderid',
                }, {
                    title: '微信支付返回码',
                    dataIndex: 'wsuccess',
                    key: 'wsuccess',
                },
                {
                    title: '商品名称',
                    dataIndex: 'productname',
                    key: 'productname',
                },
                {
                    title: '数量',
                    dataIndex: 'quantity',
                    key: 'quantity',
                },
                {
                    title: '单价',
                    dataIndex: 'unitprice',
                    key: 'unitprice',
                },
                {
                    title: '总价',
                    key: 'totalprice',
                    dataIndex: 'totalprice',
                }, 
                {
                    title: '订单配送地址',
                    key: 'addressinfo',
                    dataIndex: 'addressinfo',
                    render:(addressinfo,record)=>{
                        return(
                            <div>
                               
                               {addressinfo?
                               <span>{JSON.parse(addressinfo)[0].userAddress}</span>
                               :<span>小嘻嘻嘻</span>
                               }
                                {/* {addressinfo[0].userAddress} */}
                            </div>
                        )
                    }

                }, 
                {
                    title: '订单状态',
                    key: 'orderstatus',
                    dataIndex: 'orderstatus',
                    render:(orderstatus,record)=>{
                        switch(orderstatus){
                            case 1:
                            return(
                                <span>买家以下单</span>
                            )
                            break;
                            case 2:
                            return(
                                <span>取消订单</span>
                            )
                            break;
                            case 3:
                            return(
                                <span>配送中</span>
                            )
                            break;

                            case 4:
                            return(
                                <span>确认收货</span>
                            )
                            break;
                            case 5:
                            return(
                                <span>已评价</span>
                            )
                            break;
                        }
                    }
                   
                }, 
                {
                    title: '卖家名称',
                    key: 'businessname',
                    dataIndex: 'businessname',
                }, 
                {
                    title: '下单时间',
                    key: 'time',
                    dataIndex: 'time',
                }, 
            ],
            // 搜索数组
            searchListData: [{ title: '省份', content: '请输入所在省份', name: 'province' }, { title: '城市', content: '请输入所在城市', name: 'city' }, { title: '街道', content: '请输入所在街道', name: 'street' }, { title: '小区', content: '请输入所在小区', name: 'community' }, { title: '卖家名称', content: '请输入卖家名称', name: 'sellerName' }],

            province: '',
            city: '',
            street: '',
            community: '',
            sellerName: '',
            startTime:'',
            endTime:'',
        }
    }


    componentWillMount() {
        this.receiveList()
    }

    /**
     * 模态框的确认点击事件中，将参数传递过去
     * @param {*} deleteId 删除功能传递给后台的id参数
     */
    showModal(deleteId) {
        this.setState({
            visible: true,
            Id: deleteId
        });

    }
    /**
     * 弹窗确认删除数据，请求接口
     */ 
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
        let data= {
            id: this.state.deleteId
        }
        // this.requestList( Url.indentDelete,data)
    }
    /**
     * 弹窗取消删除数据
     */ 
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    /**
     * 接收接口获取数据
     */ 
    receiveList() {
        let _this = this
        Api._ajax({
            url: Url.indent,
            type: "post",
            data:{page:this.state.page},
            success: function (res) {
                _this.setState({
                    data: res.data
                })
            }
        })
    }

    /**
     * 
     * @param {*} url  发送url路径
     * @param {*} data 发送请求数据
     * @param {*} request  请求的类型
     */
    requestList(url, data, request) {
        let _this = this
        Api._ajax({
            url: url,
            type: request || "get",
            data: data,
            success: function (res) {

            }
        })
    }

    /**
     * 清除功能，重新请求接口数据
     */ 
    clearData = () => {
        this.setState({
            province: '',
            city: '',
            street: '',
            community: '',
            sellerName: '',
            startTime:'',
            endTime:'',
        })
        this.receiveList()
    }

    /**
     * 搜索功能，发送请求
     */ 
    searchSubmit = () => {
        let submitData = {
            province: this.state.province,
            city: this.state.city,
            area: this.state.street,
            communityName: this.state.community,
            businessName: this.state.sellerName,
            startTime:this.state.startTime,
            endTime:this.state.endTime,
        }

        console.log(submitData)
        this.requestList(Url.indent,submitData,"post")
    }

    /**
     * 时间日期组件，获取value值
     */ 
    valueData = (value, dateString) => {
        this.setState({
            startTime:dateString[0],
            endTime:dateString[1],
        })
    }
    /**
     * input,onChange事件
     */ 
    onChangeList = (e) => {
        switch (e.target.name) {
            case "province":
                this.setState({
                    province: e.target.value,
                })
                break;
            case "city":
                this.setState({
                    city: e.target.value,
                })
                break;
            case "street":
                this.setState({
                    street: e.target.value,
                })
                break;
            case "community":
                this.setState({
                    community: e.target.value,
                })
                break;
            case "sellerName":
                this.setState({
                    sellerName: e.target.value,
                })
                break;
        }

    }
    render() {
        const tableOption = { columns: this.state.columns }
        return (<div className="content indent">
            <BreadcrumbOption />
            <div className="searchList">
                <div><span>省份</span> <Input placeholder="请输入所在省份" name="province" allowClear onChange={this.onChangeList} value={this.state.province} /></div>
                <div><span>城市</span> <Input placeholder="请输入所在城市" name="city" allowClear onChange={this.onChangeList} value={this.state.city} /></div>
                <div><span>街道</span> <Input placeholder="请输入所在街道" name="street" allowClear onChange={this.onChangeList} value={this.state.street} /></div>
                <div><span>小区</span> <Input placeholder="请输入所在小区" name="community" allowClear onChange={this.onChangeList} value={this.state.community} /></div>
                <div><span>卖家名称</span> <Input placeholder="请输入卖家名称" name="sellerName" allowClear onChange={this.onChangeList} value={this.state.sellerName} /></div>
                <div className="timeData"><span>时间段</span><RangePicker onChange={this.valueData}  value={this.state.startTime===undefined||this.state.endTime===undefined||this.state.startTime===""||this.state.endTime===""?null:[moment(this.state.startTime, 'YYYY/MM/DD'), moment(this.state.endTime, 'YYYY/MM/DD')]}
                placeholder={['开始时间','结束时间']}/></div>
               
            </div>

            <div className="indentOperation">
                <Button type="primary" onClick={this.clearData}>清除</Button>
                <Button type="primary" onClick={this.searchSubmit}>搜索</Button>
            </div>

            <Table {...tableOption} dataSource={this.state.data} rowKey={record => record.key}
                pagination={{
                    pageSize: 8,
                    defaultPageSize: 8
                }}
            />

            <Modal
                title="提示"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="确认"
                cancelText="取消"
            >
                <p>您确定要删除当前数据吗？</p>
            </Modal>
        </div>)
    }
}
export default Indent;