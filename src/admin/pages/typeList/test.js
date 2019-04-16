import React from 'react';
import {
    Tree,
    Button,
    Icon,
    Modal,
    Input,
    notification
} from 'antd';

import './index.less';
import '../../public/app.less';
import Api from '../../app/api';
import Url from '../../app/url';

import SelectController from '../../commpant/select/';

import BreadcrumbOption from '../../commpant/breadcrumb';

import SelectText from '../../commpant/select/indexText';

const TreeNode = Tree.TreeNode;

var resetData = [];
class TypeList extends React.Component {
    state = {
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: ["4"],
        gData: [],
        treeData: [],
        status: 1,
        visible: false,
        editTitle: null,
        editId: null,
        editPid: null,
        editValue: null,
        parentArr: [],
        itemChangeTitle: '',
        itemChangePid: '',
        itemChangeId: '',
        msg: '',
        delVisible: false,
        delItem: ''
    }

    addType = () => {
        let _self = this;

        this.refs.selectController && this
            .refs
            .selectController
            .onClear();
        _self.setState({
            editId: null,
            editPid: null,
            editTitle: '新增类目',
            editValue: null,
            parentArr: [],
            visible: true,
            itemChangeId: null,
            itemChangePid: 0,
            editItem: null,
            delTitle : ''
        })
    }

    typeClick = (item, e) => {
        let _self = this;
        // if (!key[0]) {     return false; } var item = e.selectedNodes[0].props.value;

        _self.setState({
            editItem: item,
            editId: item.id,
            editPid: item.pid,
            editTitle: '修改类目',
            editValue: item.title,
            visible: true,
            itemChangeId: item.id,
            itemChangePid: item.pid,
            itemChangeTitle: item.title,
            parentArr: _self.getParent(item.pid)
        })
    }
    componentDidMount() {
        this.getList();
    }
    getList() {
        let _self = this;

        Api._ajax({
            url: Url.bgetcategorylist,
            success: function (res) {
                // console.log(res);
                _self.setState({
                    treeData: res.data,
                    resetData: _self.dataReset(res.data)
                }, () => {
                    // _self.getParent(3)
                })
            }
        })
    }
    dataReset(data) {
        let _self = this;
        var resetArr = [];
        function resetData(data) {
            data.map((item, i) => {
                resetArr.push(item);
                if (item.subcat && item.subcat.length) {
                    let aa = _self.dataReset(item.subcat);
                    resetArr.concat(aa);
                }
            })
        }
        resetData(data);
        return resetArr;
    }
    getParent(pid) {
        let _self = this;
        var arr = [];
        dataMap(pid);
        function dataMap(pid) {
            _self
                .state
                .resetData
                .map((item, i) => {
                    if (item.id == pid) {
                        arr.push(item);
                        if (item.pid) {
                            arr.concat(dataMap(item.pid))
                        }
                    }
                })
        }

        arr = arr.reverse();
        arr.pop();
        return arr;
    }

    handleOk = () => {
        let _self = this;
        let msg = false;

        // console.log(_self.state)

        if (!_self.state.itemChangeTitle) {
            this.setState({msg: '请输入标题'})
            return false;
        }

        this.setState({msg: ''})
        _self.saveChange();

    }
    handleCancel = () => {
        this.setState({
            visible: false,
            delVisible : false
        }, () => {
            this.refs.selectController && this
                .refs
                .selectController
                .onClear();

        })
    }
    itemTitleChange = (e) => {
        this.setState({itemChangeTitle: e.target.value, editValue: e.target.value})
    }
    selectChange = (id) => {
        // console.log(id, "selectChange")
        this.setState({itemChangePid: id})
    }
    saveChange() {
        let _self = this;
        Api._ajax({
            url: Url.bsavecategory,
            data: {
                pid: _self.state.itemChangePid,
                title: _self.state.itemChangeTitle,
                id: _self.state.itemChangeId
            },
            success: function (res) {
                if (res.code == 200) {
                    _self.getList();
                    _self.setState({visible: false})
                } else {}
            }
        })
    }

    treeEach(key,data,callback){
        let _self = this;
        data.forEach((item,i)=>{
            if(item.id == key){
                item.hide = !item.hide;
                return callback(key,item)
            }

            if(item.subcat){
                return _self.treeEach(key,item.subcat,callback)
            }
        })
    }
    treeToggle=(item,e)=>{
        let _self = this;
        _self.treeEach(item.id,_self.state.treeData,function(key,item){
            // console.log(key,item)
            _self.setState({
                treeData : _self.state.treeData
            })
        })
    }

    typeDel = (item, e) => {
        this.setState({delVisible: true, delItem: item,delTitle : item.title})
    }
    delOk = () => {
        // console.log('del ok')
        let _self = this;
        Api._ajax({
            url : Url.bdelcategory,
            data : {
                category_id : _self.state.delItem.id
            },
            success: function(res){
                _self.setState({
                    delVisible : false
                })
                if(res.code == 200){
                     _self.getList();
                    notification.success({
                        message: '删除成功',
                        description: _self.state.delItem.title + ' 删除成功',
                      });
                }else{
                    notification.error({
                        message: '删除失败',
                        description: res.msg,
                      });
                }
            }
        })
    }

    render() {
        const loop = data => data.map((item, i) => {
            if (item.subcat && item.subcat.length) {
                return <TreeNode value={item} key={item.id} title={item.title}>{loop(item.subcat)}</TreeNode>;
            }
            return <TreeNode value={item} key={item.id} title={item.title}></TreeNode>;
        });

        const customLoop = data => data.map((item, i) => {
            if (item.subcat && item.subcat.length) {
                return <li key={i} className="tree-main tree-line" style={{height: item.hide ? '40px' : 'auto',overflow:"hidden"}}>
                    <p className="main-title" >
                        <span className="title-icon">
                            <Icon type={item.hide ? 'plus-square' : 'minus-square'} theme="twoTone" onClick={(e)=>this.treeToggle(item,e)}/>
                        </span>
                        {item.title}
                        <span className="title-edit">
                            <i className="edit-icon" onClick={(e) => this.typeClick(item, e)}>编辑</i>|
                            <i className="edit-del" onClick={(e) => this.typeDel(item, e)}>删除</i>
                        </span>
                    </p>
                    <ul className="main-content">
                        {customLoop(item.subcat)}
                    </ul>
                </li>
            } else {
                return <li key={i} className="tree-text tree-line">
                    <span className="title-icon">
                        <Icon type="copy" theme="twoTone"/>
                    </span>
                    {item.title}
                    <span className="title-edit">
                        <i className="edit-icon" onClick={(e) => this.typeClick(item, e)}>编辑</i>|<i className="edit-del" onClick={(e) => this.typeDel(item, e)}>删除</i>
                        {/* <Icon type="edit" theme="twoTone"/>
                        <Icon type="delete" theme="twoTone"/> */}
                    </span>
                </li>
            }

        })

        return (
            <div className="">
                <BreadcrumbOption/>

                <div className="typeList">
                    <Button
                        className="base-submit-button type_add"
                        size="large"
                        type="primary"
                        htmlType="submit"
                        onClick={this.addType}>新增</Button>
                    <div className="list-tree">
                        <ul className="custom-tree-list">
                            {this.state.treeData.length
                                ? customLoop(this.state.treeData)
                                : 'loading  tree'}
                        </ul>

                        {/* {this.state.treeData.length
                            ? <Tree
                                    showLine={true}
                                    size='large'
                                    className="draggable-tree"
                                    onSelect={this.typeClick}
                                    defaultExpandAll>
                                    {loop(this.state.treeData)}
                                </Tree>
                            : 'loading tree' */}

                    </div>

                    <Modal
                        title="确认删除"
                        cancelText='取消'
                        okText='确定'
                        visible={this.state.delVisible}
                        onOk={this.delOk}
                        onCancel={this.handleCancel}>
                        
                        <p>确认删除 <span style={{'color':'#2592FC'}}>`{this.state.delTitle}`</span> 吗?</p>
                    </Modal>

                    <Modal
                        title={this.state.editTitle}
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        cancelText='取消'
                        okText='确定'>
                        <div className="editMain">

                            <div className="editSelect">
                                <span className="select-title">编辑类目名称:</span>
                                <Input
                                    maxLength={20}
                                    value={this.state.editValue}
                                    placeholder={this.state.editValue}
                                    onChange={this.itemTitleChange}/>
                            </div>

                            <div className="editSelect">
                                <span className="select-title">修改所属类目:</span>
                                <SelectController
                                    ref='selectController'
                                    pid={this.state.itemChangePid}
                                    item={this.state.editItem}
                                    treeData={this.state.treeData}
                                    onChange={this.selectChange}/> {/* <SelectText
                            pid={this.state.itemChangePid}
                            treeData={this.state.treeData}
                            parentArr={this.state.parentArr}
                            /> */}
                            </div>
                            <div className="edit-msg">{this.state.msg}</div>

                        </div>
                    </Modal>
                </div>
            </div>
        );
    }

};

export default TypeList;