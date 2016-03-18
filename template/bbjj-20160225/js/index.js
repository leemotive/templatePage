;(function () {
    $(function () {
        var fundIds = $('#fundIds').data('value').replace(/\s+/g, '');
        var fundList = $('#fund-list');
        var dataField = $('#data-field').data('value');
        var template = $('#fund-template').html();
        var factory = doT.template(template);
        $.ajax({
            url: 'http://e.lufunds.com/jijin/activityList',
            data: {
                fundCodes: fundIds
            },
            type: 'GET',
            dataType: 'jsonp',
            jsonp: 'jsonpcallback',
            success: function (data) {
                data.dataField = dataField;
                var html = factory(data);
                fundList.html(html);

            }
        })
    });
    
}());