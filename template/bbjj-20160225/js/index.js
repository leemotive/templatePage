;(function () {
    $(function () {
        var fundIds, fundList, dataField, template, factory;
        fundIds = $('#fundIds').data('value').replace(/\s+/g, '');
        fundList = $('#fund-list');
        dataField = $('#data-field').data('value');
        template = $('#fund-template').html();
        factory = doT.template(template);
        $.ajax({
            url: 'http://e.lufunds.com/jijin/activityList',
            data: {
                fundCodes: fundIds
            },
            type: 'GET',
            dataType: 'jsonp',
            jsonp: 'jsonpcallback',
            success: function (res) {
                if (res.data) {
                    $.each(res.data, function (i, fund) {
                        fund.fundData = fund[dataField];
                    });

                    var html = factory(model);
                    fundList.html(html);
                }
            }
        });
    });
    
}());