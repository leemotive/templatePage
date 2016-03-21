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
                        fund.fundData = fund[dataField] || '--';
                        var discount, feeStyle, feeDiscount, fee, symbol;
                        feeStyle = 'del';
                        discount = feeStyle = feeDiscount = fee = '';
                        if (!fund.extApplyProductFeeGson || !fund.extApplyProductFeeGson.fee) {
                            discount = '';
                            fee = feeDiscount = '--';
                        } else {
                            if(!fund.extApplyProductFeeGson.discount || fund.extApplyProductFeeGson.discount ==1) {
                                discount = feeDiscount = feeStyle = '';
                            } else if (fund.extApplyProductFeeGson.discount < 1) {
                                discount = (fund.extApplyProductFeeGson.discount * 10).toFixed(2) + '折';
                                feeDiscount = fund.extApplyProductFeeGson.discountFee.toFixed(2) + '%';
                            } else if (fund.extApplyProductFeeGson.discount > 1) {
                                discount = 1;
                                feeDiscount = fund.extApplyProductFeeGson.discount + '元/笔';
                            }
                            if (fund.extApplyProductFeeGson.fee) {
                                symbol = '%';
                            }
                            fee = fund.extApplyProductFeeGson.fee.toFixed(2) + symbol;
                        }
                        fund.feeDiscount = discount;
                        fund.feeStyle = feeStyle;
                        fund.discount = discount;
                        fund.fee = fee;
                    });

                    var html = factory(model);
                    fundList.html(html);
                }
            }
        });
    });
    
}());