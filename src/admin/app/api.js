import $ from "jquery";


let Api = {
    _ajax: function (config) {
        var type = config.type ? config.type : 'get';

        $.ajax({
            type: type,
            url: config.url,
            data: config.data,
            success: function (res) {
                res = typeof res == 'string' ? JSON.parse(res) : res;
                config.success(res)
            },
            error: function () {

            }
        })
    }
};


module.exports = Api;