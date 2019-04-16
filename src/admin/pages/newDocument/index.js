// 编辑文档
import React from 'react'
import $ from "jquery";


import Api from '../../app/api';
import Url from '../../app/url';


import BreadcrumbOption from '../../commpant/breadcrumb'

import RichText from '../../commpant/richTxt/index.js';



class NewDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <RichText />
      </div>
    )
  }

}


export default NewDocument;
