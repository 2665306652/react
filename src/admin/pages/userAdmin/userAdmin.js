import React, { Component } from 'react';

import "./userAdmin.less";
import Api from '../../app/api';
import Url from '../../app/url';
import BreadcrumbOption from "../../commpant/breadcrumb";

// 引入antd
import { Table, Divider, Tag, Modal, Button, Input, Icon } from 'antd';
// 卖家审批管理
class UserAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,//弹窗
            recordData: {},
            columns: [
                {
                    title: '省市',
                    dataIndex: 'province',
                    key: 'province',
                    // render: text => <a href="javascript:;">{text}</a>,
                },
                {
                    title: '房间号',
                    dataIndex: 'residence',
                    key: 'residence',
                },
                {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '微信昵称',
                    dataIndex: 'nickname',
                    key: 'nickname',
                },
                {
                    title: '手机',
                    dataIndex: 'phone',
                    key: 'phone',
                },
                {
                    title: '注册时间',
                    dataIndex: 'registrationTime',
                    key: 'registrationTime',
                },
                {
                    title: '身份',
                    key: 'identity',
                    dataIndex: 'identity',
                },
                {
                    title: '状态',
                    key: 'action',
                    render: (text, record) => (
                        <div>
                            <Button type="primary" onClick={this.DetailsWay.bind(this, record)} style={{
                                width: "76px",
                                height: "38px", marginLeft: '0px'
                            }}>
                                详情
                        </Button>
                        </div>
                    ),
                }
            ],
            data: [],
        }
    }


    componentWillMount() {
        this.requestList()
    }

    requestList() {
        let _this = this
        Api._ajax({
            url: Url.sellerAudit,
            type: "get",
            success: function (res) {
                _this.setState({
                    data: res.data
                })
            }
        })
    }

    DetailsWay(record) {
        this.showModal()
        this.setState({
            recordData: record
        })
    }

    showModal = () => {
        this.setState({
            visible: true,
            recordData: ''
        });
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
            recordData: ''
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
            recordData: ''
        });
    }
    render() {


        const Search = Input.Search;
        const tableOption = { columns: this.state.columns }
        const record = this.state.recordData
        return (
        <div className="content UserAdmin" >
            <BreadcrumbOption />
            <div className="Search">
                <Search
                    value={this.state.searchValue}
                    placeholder="搜索用户名、手机号码"
                    onSearch={e => {
                        this.onSearch(e);
                    }}
                    onChange={e => {
                        this.onChange(e);
                    }}
                    enterButton
                    style={{ width: "300px", display: "block" }}
                />
                <Icon
                    onClick={() => {
                        this.clear();
                    }}
                    className="icon"
                    style={{ display: this.state.bol ? "block" : "none" }}
                    type="close-circle"
                    theme="filled"
                />

                <Button type="primary" className="base-submit-button" onClick={this.showModals}>
                    添加
        </Button>


            </div>

            <Table {...tableOption} dataSource={this.state.data} rowKey={record => record.key} />


            <Modal
                title="卖家详情信息"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="确认"
                cancelText="取消"
            >
                <p>姓名：<span>{record.name}</span></p>
                <p>微信昵称：<span>{record.nickname}</span></p>
                <p>手机号码：<span>{record.phone}</span></p>
                <p>省份：<span>{record.province}</span></p>
                <p>住址：<span>{record.residence}</span></p>
                <p>注册时间：<span>{record.registrationTime}</span></p>
                <p>卖家身份申请时间：<span>{record.sellerIDTime}</span></p>
                <p>身份证号：<span>{record.IDnumber}</span></p>
                <p>身份证图：
                                <img src={record.IDImg} style={{ width: "160px" }} />
                </p>
                <p>手持证件图：
                                <img src={record.handIDImg} style={{ width: "160px" }} />
                </p>
            </Modal>
        </div>)
    }
}
export default UserAdmin;