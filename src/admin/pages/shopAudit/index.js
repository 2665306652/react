import React, { Component } from 'react';

import "./index.less";
import Api from '../../app/api';
import Url from '../../app/url';
import BreadcrumbOption from "../../commpant/breadcrumb";

// 引入antd
import { Table, Divider, Tag, Modal, Button, message } from 'antd';
// 商品审核管理
class ShopAudit extends Component {

    constructor(props) {
        super(props)
        this.state = {
            auditState: '',
            page: 1,
            visible: false,//弹窗
            recordData: {},
            columns: [
                {
                    title: '纪录Id',
                    dataIndex: 'id',
                    key: 'id',
                    // render: text => <a href="javascript:;">{text}</a>,
                }, {
                    title: '上传该商品的用户id',
                    dataIndex: 'userId',
                    key: 'userId',
                }, {
                    title: '商品大图',
                    width: 150,
                    dataIndex: 'productmap',
                    key: 'productmap',
                    render: (record) => {
                        return (<div style={{ width: '50px', height: '50px', borderRadius: "50%" }}>
                            <img src={record} alt="" style={{ width: '50px', height: '50px' }} />
                        </div>)
                    }
                },
                {
                    title: '商品名称',
                    dataIndex: 'productname',
                    key: 'productname',
                },
                {
                    title: '商品数量',
                    dataIndex: 'number',
                    key: 'number',
                },
                {
                    title: '商品单价',
                    dataIndex: 'unitprice',
                    key: 'unitprice',
                },
                {
                    title: '商品单位',
                    dataIndex: 'unit',
                    key: 'unit',
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
        let _this = this
        Api._ajax({
            url: Url.shopSellerAudit,
            type: "post",
            data: { page: 1 },
            success: function (res) {
                _this.setState({
                    data: res.data
                })
            }
        })
    }


    DetailsWay = (record) => {
        let _this = this
        this.showModal()
        Api._ajax({
            url: Url.shopExamineDetail,
            type: "post",
            data: { id: record },
            success: function (res) {
                _this.setState({
                    recordData: res.data
                })
            }
        })
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }


    handleOk = (e) => {
        this.setState({
            visible: false,
            recordData: '',
        });
    }


    handleCancel = (e) => {
        this.setState({
            visible: false,
            recordData: '',
        });
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
                    url: Url.shopAudit,
                    type: "post",
                    data: { id: _this.state.recordData.id, type: _this.state.auditState },
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
        return (<div className="content shopAudit">
            <BreadcrumbOption />

            <Table  {...tableOption} dataSource={this.state.data} rowKey={record => record.id}
                pagination={{
                    pageSize: 7,
                    defaultPageSize: 7
                }} />

            <Modal
                title="商品详情信息"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="确认"
                cancelText="取消"
                width="716px"

            >
                <p>记录id：<span>{record.id}</span></p>
                <p>上传该商品的用户id：<span>{record.userId}</span></p>
                <p>商品大图： <img src={record.productmap} style={{ width: "100px" }} /></p>
                <p>商品名称：<span>{record.productname}</span></p>
                <p>商品数量：<span>{record.number}</span></p>
                <p>商品单价：<span>{record.unitprice}</span></p>
                <p>商品单位：<span>{record.unit}</span></p>
                <p>商品属性：{record.type == 1 ? <span>全新</span> : <span>二手</span>}</p>
                <p>商品说明：<span>{record.description}</span></p>
                <p>商品详情图数组：
                    {
                        record.imgs ?
                            record.imgs.map((item, i) => {
                                return (
                                    <img key={i} src={item} style={{ width: "100px", marginLeft: '50px', display: 'inline-block' }} />
                                )
                            })
                            : <span>nullData</span>
                    }
                </p>
                <p>审核：
                    <Button type="primary" onClick={this.confirm.bind(this, 'pass')} style={{ marginLeft: 30 }}>通过</Button>
                    <Button type="primary" onClick={this.confirm.bind(this, 'noPass')} style={{ marginLeft: 30 }}>不通过</Button>
                </p>

            </Modal>
        </div>)
    }
}
export default ShopAudit;