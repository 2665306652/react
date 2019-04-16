import "babel-polyfill";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './foddercentre.less';
import Head from '../head/head.js';
import Bottom from '../bottom/bottom.js';

import Blank from "../blank/blank.js";
const Url = require("../../app/url");
const Api = require("../../app/api.js");
import { Menu, Dropdown, message, Icon, Pagination, Spin, Modal, Button } from 'antd';
class FodderCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleList: [],
            titleListValue: 0,
            visible: false,
            current: 3,//头部公共组件的参数
            query: '',//获取到了url参数
            routerParameter: '',//点击后获取到点击的参数，重新请求接口
            modalData: [],//弹层的数据
            star: '',//收藏返回的参数
            title: "抱歉，品牌暂时还未上传哦",
            collectStar: true,

            parameterNext: false,
            parameterLast: false
        }
    };


    componentDidMount() {
        const _this = this
        let query = _this.getQueryString('id');
        let lisId = _this.getQueryString('lisId');
        if (query) {
            Api._ajax({
                url: Url.particularsMold,
                success: function (res) {
                    _this.setState({
                        titleList: res.data,
                    }, () => {
                        if (lisId) {
                            _this.state.titleList.forEach((item, i) => {
                                if (query == item.id) {
                                    _this.showModal(query)
                                } else {
                                }
                            })
                        }
                    })
                }, error: function () {
                    _this.setState({
                        titleList: [],
                    })
                }

            });
        }
    }


    /**
     * url获取参数
     * @param {*} name 当前路径
     */

    getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    /**
     * 请求数据方法
     */
    DataUpdata() {
        const _this = this
        const routerID = this.state.routerParameter
        Api._ajax({
            // url: Url.detailBody + routerID, 跨域无法获取数据
            type: 'GET',
            success: function (res) {
                _this.setState({
                    modalData: res.data,
                })
            }
        });
    }
    /**
     * 弹层
     */
    showModal = (id, i) => {
        let _self = this;
        let list = this.state.titleList;
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                _self.setState({
                    visible: true,
                    modalData: list[i],
                    spinning: false,
                    titleListValue: i
                })
            }
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            titleListValue: 0
        });

    }

    /**
     * 收藏方法
     */
    Collect = () => {
        var _this = this
        var collectStarBoolean = this.state.collectStar ? false : true
        Api._ajax({
            url: Url.collect,
            type: 'POST',
            data: {
                mid: this.state.modalData.id//素材的ID
            },
            success: function (res) {
                _this.setState({
                    star: res[0].data.star,
                    collectStar: collectStarBoolean
                })
                // alert(res[0].data.star + '这是返回成功拿到的值')
            }, error: function () {
                _this.Error()
            }
        });
        if (this.state.collectStar) {
            _this.Success()
        } else {
            _this.Warning()
        }
    }

    /**
     * 下载方法
     * @param {*} type 参数判断下载类型  图片/文本
     */
    DownloadWay = (type) => {
        // 图片接口
        if (type == "thumb") {
            const _this = this
            Api._ajax({
                url: Url.downloadimg,
                type: 'POST',
                data: {
                    mid: this.state.modalData.id//素材的ID
                },
                success: function (res) {
                    _this.setState({
                    })
                    // alert(res[0].data.download + '这是下载返回成功拿到的值')
                    // _this.Success()

                }, error: function () {
                    // _this.Error()
                }
            });
            // 文件接口
        } if (type == "source") {
            const _this = this
            Api._ajax({
                url: Url.downloadsource,
                type: 'POST',
                data: {
                    mid: this.state.modalData.id//素材的ID
                },
                success: function (res) {
                    _this.setState({
                    })
                    // alert(res[0].data.download + '这是下载返回成功拿到的值')
                    _this.Success()
                }, error: function () {
                    _this.Error()
                }
            });
        }
    }

    /**
     * 页面展示时间转化
     */
    updatetime = (dataTime) => {
        let date2 = new Date(dataTime * 1000);
        let year2 = date2.getFullYear();
        let month2 = date2.getMonth() + 1;
        let day2 = date2.getDate();
        if (month2 < 10) {
            month2 = "0" + month2;
        }
        if (day2 < 10) {
            day2 = "0" + day2;
        }
        let nowDate2 = year2 + '.' + month2 + '.' + day2;
        return nowDate2;
    }

    /**
     * 切换数据
     * @param {*} type 判断需要获取 上一个/下一个数据
     */

    Renewal = (type) => {
        // 获取数组的长度
        const listLength = this.state.titleList.length - 1;
        if (type == "previous") {
            // 上一个
            const _this = this
            let listValuePrevious = (this.state.titleListValue) - 1
            if (this.state.titleListValue <= 0) {
                _this.ClickWarning()
                _this.setState({
                    titleListValue: 0,
                    modalData: this.state.titleList[0]
                })
            } else {
                _this.setState({
                    titleListValue: listValuePrevious,
                    modalData: this.state.titleList[listValuePrevious]
                })
            }
        } else if (type == "next") {
            // 下一个
            const _this = this
            let listValueNext = (this.state.titleListValue) + 1
            if (this.state.titleListValue >= listLength) {
                _this.ClickWarning()
                _this.setState({
                    titleListValue: listLength,
                    modalData: this.state.titleList[listLength]
                })
            } else {
                _this.setState({
                    titleListValue: listValueNext,
                    modalData: this.state.titleList[listValueNext]
                })
            }
        }
    }


    UrlUpdata() {
        const _this = this
        Api._ajax({
            url: Url.particularsMoldDamp,
            success: function (res) {
                _this.setState({
                    titleList: res.data,
                })
            }
        });
    }
    /**
     * 排序获取数据
     * @param {*} type 获取当前点击参数
     */
    Rank(type) {
        const _this = this
        if (type == "two") {
            Api._ajax({
                url: Url.particularsMoldNew,
                success: function (res) {
                    _this.setState({
                        titleList: res.data,
                    })
                }
            });
        } else if (type == "three") {
            _this.UrlUpdata()
        } else {
            Api._ajax({
                url: Url.particularsMold,
                success: function (res) {
                    _this.setState({
                        titleList: res.data,
                    })
                }
            });
        }
    }

    Success = () => {
        message.success('操作成功');
    };

    Error = () => {
        message.error('请求失败');
    };

    Warning = () => {
        message.warning('取消收藏');
    };
    ClickWarning = () => {
        message.warning('没有更多的数据了');
    };

    gettime(str) {
        var reg = /-/g;
        var reg2 = /00:00/g;
        let str0 = str.replace(reg, '.')
        let str01 = str0.replace(reg2, '')
        let str1 = str01.split(' ');
        let str2 = str1[1].split('.');
        return str1[0] + '  ' + str2[0].slice(0, str2[0].length - 3);
    }
    render() {
        // 点击下载的提示信息
        const onClick = function ({ key }) {
            // message.info(`Click on item ${key}`);
        };
        const menu = (
            <Menu onClick={onClick}>
                <Menu.Item key="1" onClick={this.Rank.bind(this, "one")}>最热</Menu.Item>
                <Menu.Item key="2" onClick={this.Rank.bind(this, "two")}>最新</Menu.Item>
                <Menu.Item key="3" onClick={this.Rank.bind(this, "three")}>最潮</Menu.Item>
            </Menu>
        );
        const modalMenu = (
            <Menu>
                <Menu.Item key="1"><a className='modal-a-hover' href={this.state.modalData.thumb} download="" onClick={this.DownloadWay.bind(this, 'thumb')}>下载图片</a></Menu.Item>
                <Menu.Item key="2"><a className='modal-a-hover' href={this.state.modalData.source} download="" onClick={this.DownloadWay.bind(this, 'source')}>下载源文件</a></Menu.Item>
            </Menu>
        )
        const { visible } = this.state;

        return (

            <div className="fodderCentre">

                <Head listContent={this.state.current} />

                {/* 面包屑 */}
                <div className="fodderCentre-navMenu">
                    <div>
                        <a href="./materialPage.html"><span>素材中心 / </span></a>
                        <span className="navMenu-current">插画素材库</span>
                    </div>

                    <Dropdown overlay={menu} >
                        <a className="ant-dropdown-link" href="#">
                            排序<Icon type="down" style={{ marginLeft: '10px' }} />
                        </a>
                    </Dropdown >

                </div>




                {this.state.titleList != "" ?
                    <div>
                        < div className="fodderCentre-content" >
                            <ul>
                                {this.state.titleList && this.state.titleList.length ? this.state.titleList.map((item, i) => {
                                    let upData = this.gettime(item.modified_at);
                                    return <li key={i} onClick={() => this.showModal(item.id, i)} id={item.id}><a className='upload-greet'>
                                        <img src={item.thumb} alt="" />
                                        <div className='upload-bottom'>
                                            <span>{item.title}</span>
                                            <p>{item.desc}</p>
                                            <div >
                                                <span className='home-upload-name'>{item.designer}{upData}上传</span>
                                                <span className='home-upload-collect'><i className='iconfont'>&#xe65d;</i>{item.star}</span>
                                                <span className="upload-download"><i className='iconfont'>&#xe64a;</i>{item.download}</span>
                                            </div>
                                        </div>
                                    </a></li>
                                }) : ''}
                            </ul>
                            <Pagination defaultCurrent={1} total={8} />
                        </div>

                        < div className='modal'>
                            <Modal
                                title="Basic Modal"
                                visible={this.state.visible}
                                onCancel={this.handleCancel}
                            >
                                {/* 顶部 */}
                                <div className='Modal-top'>
                                    {/* 下拉 */}
                                    <Dropdown overlay={modalMenu}>
                                        <a className="ant-dropdown-link" href="#">
                                            <span>下载源文件</span>
                                        </a>
                                    </Dropdown>
                                    {/* <span className='Modal-top-collect' onClick={this.Collect}>收藏</span> */}
                                    <div className='Modal-top-collect' onClick={this.Collect}>
                                        {
                                            this.state.collectStar
                                                ? <span>收藏</span>
                                                : <span style={{ backgroundColor: "#1890FF", color: "#fff", display: 'block', width: '100%' }}>已收藏</span>
                                        }
                                    </div>
                                    {/* 收藏 */}
                                </div>



                                {/* 中间 */}
                                <div className='Modal-middle'>
                                    {/* 图片数据过多,可以通过map进行渲染 */}
                                    <img src={this.state.modalData.thumb} />

                                </div>


                                {/* 底部 */}
                                <div className='Modal-bottom'>
                                    {/* 底部样式内容 */}
                                    <p className='Modal-bottom-title'>{this.state.modalData.title}</p>
                                    <p className='Modal-bottom-describe'>{this.state.modalData.desc}</p>
                                    <div className='Modal-bottom-data'>
                                        <span>{this.state.modalData.designer}</span>
                                        <span>{this.state.modalData.modified_at}</span>
                                    </div>
                                </div>

                                {/* 数据更新 */}
                                <i className='renewal-left' onClick={this.Renewal.bind(this, "previous")} >&#xe65a;</i>
                                <i className='renewal-right' onClick={this.Renewal.bind(this, "next")} >&#xe659;</i>
                            </Modal>
                        </div>
                    </div>
                    :
                    <Blank listTitle={this.state.title} />

                }
                <Bottom />
            </div >
        )

    }
}

ReactDOM.render(<FodderCenter />, document.getElementById("fodderCenter"));