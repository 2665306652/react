//增加标签的文件
import React from 'react';
import ReactDOM from 'react-dom';
class AddLable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value : ''
        }
    }
    onChange=(e)=>{
        this.setState({value : e.target.value})
    }
    onKeyDown =(e)=>{
        //enter
        if(e.keyCode == 13){
            if(!e.target.value){
                return  false;
            }
            this.setState({
                value : ''
            })
            this.props.onEnter && this.props.onEnter(e.target.value)


        }
        //del

        if(e.keyCode == 8 && !e.target.value){
            this.props.onDel && this.props.onDel('end');    
        }
    }

    render() {
        return (
            <div className="AddLable">
                <ul className='lisUl'>
                    {
                        this.props.lableList.map((item, i) => {
                            return <li className='lis' key={i}> {item} <span className="delEle" onClick={(e)=>this.props.onDel(item,e)}>X</span></li>
                        })
                    }

                </ul>
                <input type="text" value={this.state.value} ref='lableInput' onChange={this.onChange} onKeyDown={this.onKeyDown}  />
            </div>
        )
    }

}
export default AddLable