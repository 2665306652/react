import React, {Component} from 'react';
import {notification} from "antd";
import $ from "jquery";
import './index.less';

const Url = require("../../app/url");
const Api = require("../../app/api.js");

class PhotoUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submit_name: '',
            old_name: '',
            type: ''
        };
    }
    photoClick =(e)=>{
        let _self = this;
        _self.refs.photoInput.click();
    }
    photoChange = (e) => {
        let _self = this;
        var fileSize = e.target.files[0].size / 1024 / 1024;
        var formData = new FormData();
        var formats = e.target.value.match(/\.jpg$|\.jpeg$|\.gif$|\.png$/i);

        formData.append("submit_name", e.target.files[0]);
        formData.append("old_name", this.props.old_name || "");
        formData.append("file_type", this.props.type);

        if (!formats || formats.length == 0) {
            // Api.tost('格式错误')
            fileObj.outerHTML ? fileObj.outerHTML = fileObj.outerHTML : fileObj.value = "";
            return false;
        }else if (fileSize > 2) {
            notification.error({message: '提示', description: '头像上传失败，请上传小于2M的图片！'})
            return false;
        }

        // 上传头像
        $.ajax({
            url: Url.uploadTemp,
            data: formData,
            cache: false,
            type: "POST",
            processData: false,
            contentType: false,
            success: function (res) {
                res = JSON.parse(res);
                if (res.code == 200) {
                    // _self.setState({avatar: data.data, avatarStatus: true, buttonStatus: true});
                    notification.success({message: '头像上传成功',duration:1})
                    _self.props && _self
                        .props
                        .photoUpload(res.data)

                } else {
                    notification.error({message: '头像上传失败', description: res.msg})

                }
            }
        });

    }
    render() {
        return (
            // <div className={this.props.className + ' photoUpload-main'}>
            //     <input
            //         className="main-input"
            //         type="file"
            //         ref="photoInput"
            //         style={{"visibility":"hidden"}}
            //         onChange={this.photoChange}
            //         accept=".jpg,.png,.jpeg,.gif"
            //         />
            //         <img className="main-photo" onClick={this.photoClick} src={this.props.photo ? this.props.photo : require("../../public/images/photochang.png")} width="100" height="100"/>
            // </div>

            <div className={this.props.className + ' photoUpload-main'} onClick={this.photoClick}>
                <input
                    className="main-input"
                    type="file"
                    ref="photoInput"
                    style={{"visibility":"hidden"}}
                    onChange={this.photoChange}
                    accept=".jpg,.png,.jpeg,.gif"
                    />

                    {this.props.photo 
                    ? <img className="main-photo" onClick={this.photoClick} src={this.props.photo} width="239" height="239"/>
                    : <div>
                        <img className='default-img' src={require("../../public/images/typeList-add.png")} width="41" height="41" />
                        <p style={{color:"#333333",marginTop:'25px',fontSize:"14px"}}>点击添加图片</p>
                        <p style={{color:"#999999",marginTop:'3px',fontSize:'12px'}}>（支持JPEG,PNG,最大50M）</p>
                    </div>}
            </div>

        );
    }
}

export default PhotoUpload;