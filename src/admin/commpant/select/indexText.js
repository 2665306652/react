import React, {Component} from 'react';

import {TreeSelect, Select} from 'antd';
import 'antd/dist/antd.css';

const Option = Select.Option;

class indexText extends Component {
    render() {

        const children = data => data.map((item,i)=>{
                return <Option key={i} value={item.id}>{item.title}</Option>
            })

        // console.log(children(this.props.treeData))
        return (
            <div>
                <Select 
                style={{ width: 100 }}
                value={this.props.parentArr[0] ? this.props.parentArr[0]['id'] : this.props.treeData[0]['id']}
                >
                   {children(this.props.treeData)}
                </Select>

                {this
                    .props
                    .parentArr
                    .map((item, i) => {
                        var value = this.props.parentArr[i+1] ? this.props.parentArr[i+1]['id'] : '';
                        console.log(this.props.parentArr,this.props,2222)
                        if (item.subcat) {
                            return <Select 
                                    style={{ width: 200 }} 
                                    value={this.props.pid}
                                    key={i}
                                    >
                                {item
                                    .subcat
                                    .map((item, j) => {
                                        return <Option  key={item.id} value={item.id}>{item.title}</Option>
                                       
                                    })}
                            </Select>
                        }
                    })}
            </div>
        );
    }
}

export default indexText;