
//多文件上传

import React from 'react';
import ReactDOM from 'react-dom';
import $ from "jquery";
import './index.less';

import { Button, notification } from 'antd';
import Api from '../../app/api';
import Url from '../../app/url';

class UpdataAccessory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isone: '',
            files: this.props.files,
            opennotification: false,
            fileValue: ''
        }
    }

    OpenNotiFication = () => {
        const args = {
            message: '您选择的文件不符合规范',
            description: '请上传psd或ai或pdf格式的文件',
            duration: 0,
        };
        notification.open(args);
    };

    FileDatachild = (item) => {
        this.setState({
            filevalue: ''
        })
        this.props.onDel(item)
        // console.log("事件执行222222222")
    }
    /**
     * file上传
     */
    onChange = () => {
        var self = this;
        var $this = this.refs.uploadFiles;
        var fileSize = $this.files[0].size / 1024 / 1024;
        this.setState({
            filevalue: $this.value
        })
        var match = $this.value.match(/\.psd$|\.ai$|\.pdf$/i);
        if (!match || match.length == 0) {
            this.setState({ opennotification: true }, function () {
                this.OpenNotiFication()
            })

        } else if (fileSize > 5) {
            alert("文件过大，不可上传")
        } else {
            var newData = new FormData();
            newData.append('submit_name', $this.files[0])
            newData.append('old_name', null)
            newData.append('file_type', 'annex')
            $.ajax({
                url: Url.uploadTemp,
                cache: false,
                type: 'POST',
                data: newData,
                processData: false,
                contentType: false,
                success: function (data) {
                    data = JSON.parse(data);
                    let tempname = data.data;
                    let code = data.code;
                    let msg = data.msg;
                    if (code == 200) {
                        self.props.onChange && self.props.onChange(tempname)
                    } else {
                        // Api.tost(msg)
                    }
                }
            })
        }
    }

    render() {
        // console.log(this.props, this.state.files)
        return (
            <div className="UpdataAccessory" >
                <p className="file">点击上传
                        <input type="file" ref="uploadFiles" value={this.state.fileValue} onChange={this.onChange} name="banner" className={`input-but input${this.txtName}`} accept=".pdf,.psd,.ai" />
                </p>


                <span className="UpAnnotation">支持AI/psd//def/格式</span>
                <div className="renderEle_content">
                    {this.props.files && this.props.files.length ? this.props.files.map((item, i) => {
                        var type = item.split('.');
                        var itemNew = '...' + item.substr(item.length - 7)
                        type = type[type.length - 1]
                        return <div key={i} className="renderEle">
                            <span className={"file-type type-" + type}></span>
                            <span className="file-name">{itemNew}</span>
                            <span className="fileDel" onClick={this.FileDatachild.bind(this, item)}>X</span>
                        </div>
                    }) : ''}

                </div>
            </div>
        )
    }

}

export default UpdataAccessory