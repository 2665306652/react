import React, { Component } from 'react';

import "./index.less";
import Api from '../../app/api';
import Url from '../../app/url';
import BreadcrumbOption from "../../commpant/breadcrumb";

// 引入antd
import { Table, Divider, Tag, Modal, Button,message} from 'antd';
// 卖家审批管理
class SellerAudit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            auditState: '',
            visible: false,//弹窗
            recordData: {},
            page: 1,
            columns: [
                {
                    title: '姓名',
                    dataIndex: 'names',
                    key: 'names',
                },
                {
                    title: '性别',
                    dataIndex: 'sex',
                    key: 'sex',
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
                    title: '身份证号',
                    dataIndex: 'cardid',
                    key: 'cardid',
                },
                {
                    title: '注册时间',
                    dataIndex: 'time',
                    key: 'time',
                },
                {
                    title: '状态',
                    key: 'action',
                    render: (text, record) => (
                        <div>
                            <Button type="primary" onClick={this.DetailsWay.bind(this, record.id)} style={{
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
        let _this = this;
        Api._ajax({
            url: Url.sellerAudit,
            type: "post",
            data: { page: 1 },
            success: function (res) {
                _this.setState({
                    data: res.data,
                })
            }
        });
    }

    DetailsWay(record) {
        this.showModal()
        let _this = this
        Api._ajax({
            url: Url.examineDetail,
            data: { id: record },
            success: function (res) {
                _this.setState({
                    recordData: res.data
                })
            }
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
            recordData: ''
        });
    }

    handleOk = (e) => {
        let _this = this
        this.setState({
            visible: false,
            recordData: ''
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
            recordData: '',
        });
    }

    audit = (id) => {
        var _that = this
        _that.setState({
            auditState: true,
        })
    }

    successShow = () => {
        message.success('申请成功');
     };
     errorShow = () => {
        message.error('操作失败');
    };
    confirm = (type) => {
        let _this = this
        if (type == "pass") {
            _this.setState({
                auditState: 1
            })
        } else {
            _this.setState({
                auditState: 2
            })
        }
        Modal.confirm({
            title: '审核',
            content: '确认提交审核',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                Api._ajax({
                    url: Url.audit,
                    type: "post",
                    data: { id: _this.state.recordData.id,type:_this.state.auditState},
                    success: function (res) {
                        _this.setState({
                            auditState: '',
                        })
                        _this.handleOk()
                       _this.successShow()
                    },
                    error: function () {
                       _this.errorShow()
                    }
                });
                _this.requestList()
            },
            onCancel() {
                _this.setState({
                    auditState: '',
                })
            }
        });
    }
      
    render() {
        const tableOption = { columns: this.state.columns }
        const record = this.state.recordData
        return (<div className="content sellerAudit" >
            <BreadcrumbOption />

            <Table {...tableOption} dataSource={this.state.data} rowKey={record => record.key}
                pagination={{
                    pageSize: 8,
                    defaultPageSize: 8
                }} />
            <Modal
                title="卖家详情信息"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="确认"
                cancelText="取消"
                bodyStyle={{ maxHeight: "650px", overflow: "auto" }}
                width='716px'
            >
                <p>姓名：<span>{record.names}</span></p>
                <p>性别：<span>{record.sex}</span></p>
                <p>微信昵称：<span>{record.nickname}</span></p>
                <p>手机号码：<span>{record.phone}</span></p>
                <p>身份证号：<span>{record.cardid}</span></p>
                <p>头像：<img src={record.avatar} style={{ height: "100px" }} /></p>
                <p>身份证正面：<img src={record.idcarda} style={{ height: "100px" }} /></p>
                <p>身份证反面：<img src={record.idcardb} style={{ height: "100px" }} /></p>
                <p>手持身份证照：<img src={record.namepic} style={{ height: "100px" }} /></p>
                <p>地址：<span>{record.province}{record.city}{record.area}{record.communityname}</span></p>
                <p>详细地址：<span>{record.addressinfo}</span></p>

                <p>审核：
                    <Button type="primary" onClick={this.confirm.bind(this, 'pass')} style={{ marginLeft: 30 }}>通过</Button>
                    <Button type="primary" onClick={this.confirm.bind(this, 'noPass')} style={{ marginLeft: 30 }}>不通过</Button>
                </p>
            </Modal>
        </div>)
    }
}
export default SellerAudit;