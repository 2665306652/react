import React from 'react';
import {TreeSelect} from 'antd';

import 'antd/dist/antd.css';

const TreeNode = TreeSelect.TreeNode;
const SHOW_ALL = TreeSelect.SHOW_ALL;
class SelectController extends React.Component {
    state = {
        value: ''
    }
    onClear(){
        this.setState({
            value : ''
        })
    }
    onChange(value) {
        this.setState({value});
        this.props.onChange && this.props.onChange(value);
    }
    render() {
        const loop = data => data.map((item, i) => {
            // console.log(data.length,i)
            if (item.subcat && item.subcat.length) {
                return <TreeNode
                    disabled={this.props.item && item.id == this.props.item.id
                    ? true
                    : false}
                    value={item.id}
                    key={item.id}
                    title={item.title}>{loop(item.subcat)}</TreeNode>;
            }
            return <TreeNode
                disabled={this.props.item && item.id == this.props.item.id
                ? true
                : false}
                value={item.id}
                key={item.id}
                title={item.title}/>;
        });
        const treeSelectOption = {
            showSearch: true,
            style: {
                width: '100%'
            },
            dropdownStyle: {
                maxHeight: 400,
                overflow: 'auto'
            },
            value: this.props.pid
                ? this.props.pid
                : this.state.value,
            placeholder: 'Please select',
            allowClear: true,
            treeDefaultExpandAll: true,
            showCheckedStrategy: SHOW_ALL,
            treeNodeFilterProp: 'title',
            showSearch: false,
           
            onChange: this.onChange.bind(this)
        }
        return (
            <div>

                <TreeSelect {...treeSelectOption}>
                    {loop(this.props.treeData)}
                </TreeSelect>
            </div>
        );
    }
};

export default SelectController;