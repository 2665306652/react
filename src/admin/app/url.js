let  Url ={
    local : '',
    code : '../bverify', //验证码接口
    blogin : '../blogin', //后台登录接口
    bsignout:'../bsignout',//退出登录接口
    bgetaccountList:'../bgetaccountList',//用户信息列表接口
    bgetcategorylist : '../bgetcategorylist',//类目列表接口
    bsavecategory : '../bsavecategory',//编辑类目接口
    bdelaccount:'../bdelaccount',//删除用户信息
    bgetaccountinfo:'../bgetaccountinfo',//获取用户登录信息
    bsaveaccount:'../bsaveaccount',//保存用户信息
    bupdatepwd:'../bupdatepwd',//修改我的密码接口
    bresetpassword:'../bresetpassword',//重置密码接口
    basicinfo:'../basicinfo',//保存我的信息

    // typeList : '../getcategorylist',//所有类型接口
    typeList : '../../../data/typelist.json',//所有类型接口
    bdelcategory : '../bdelcategory',//删除类目接口
    uploadTemp:'../uploadtemp',//上传图片接口
    rtxtPresent:'../bsavedocment',//保存、提交 文档
    bgetdocmentlist:'../bgetdocmentlist',// 文档列表
    bdeldoc:'../bdeldoc',//删除文档接口
    getCategorylist:'../getcategorylist',//获取类目数据
    //  mock  数据
    listjson:'./document/list.json',//模拟列表数据
    

    indent:'./document/indent.json',//订单管理

    //卖家审批管理    // 获取审批列表    // 提交审核
    sellerAudit:'http://2kf1951144.51mypc.cn:14432/user/examine',
    examineDetail:'http://2kf1951144.51mypc.cn:14432/user/examineDetail',
    audit:' http://2kf1951144.51mypc.cn:14432/user/pass',

    // 商品审核管理  // 获取审批列表    // 提交审核
    shopSellerAudit:'http://2kf1951144.51mypc.cn:14432/commodity/examine',
    shopExamineDetail:'http://2kf1951144.51mypc.cn:14432/commodity/examineDetail',
    shopAudit:'http://2kf1951144.51mypc.cn:14432/commodity/pass',

    // 订单管理获取列表
    indent:'http://2kf1951144.51mypc.cn:14432/order/manage/orderList',//删除数据将参数返回给后台
    search:'./document/search.json',//商品审核管理
};
// export default Url;
module.exports = Url;
