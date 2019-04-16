// 新建文档
import React from 'react'
import $ from "jquery";


import Api from '../../app/api';
import Url from '../../app/url';


import BreadcrumbOption from '../../commpant/breadcrumb'

import RichText from '../../commpant/richTxt/index.js';
import BraftEditor from 'braft-editor'

var resetData = [];

class AddDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiveData: {
        title: '',
        RtextContent: '',
        imgUrl: '',
        files: [],
        annex: '',
        desc: '',
        status: '',
        targerId: '',
        id: '',
        category_id: '',
        treeData: [],
      }
    }
  }

  componentDidMount() {
    let _self = this;
    _self.refs.selectController && _self.refs.selectController.onClear();
    Api._ajax({
      url: Url.bgetcategorylist,
      success: function (res) {
        _self.setState({
          treeData: res.data,
          resetData: _self.dataReset(res.data)
        }, () => {
          // _self.getParent(3)
        })
      }
    })
    const userInfo = this.props.location.query;
    if (userInfo && userInfo.item) {
      this.setState({
        receiveData: {
          imgUrl: userInfo.item.coverimg,
          title: userInfo.item.title,
          RtextContent: BraftEditor.createEditorState(userInfo.item.content),
          targerId: userInfo.item.c_id,
          files: userInfo.item.annex ? JSON.parse(userInfo.item.annex) : [],
          desc: userInfo.item.introduction,
          status: userInfo.item.status,
          id: userInfo.item.id,
        }
      });
    }
  }


  dataReset(data) {
    let _self = this;
    data.map((item, i) => {
      resetData.push(item);
      if (item.subcat && item.subcat.length) {
        let aa = _self.dataReset(item.subcat);
        resetData.concat(aa);
      }
    })

    return resetData;

  }

  render() {
    return (
      <div>
        <RichText receiveData={this.state.receiveData} />
      </div>
    )
  }

}


export default AddDocument;
