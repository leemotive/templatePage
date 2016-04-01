;(function () {
    $(function () {
        var template, factory;
        
        template = $('#fund-template').html();
        factory = doT.template(template);

        for (var index = 1; index < 4; index++) {
            getFundList(index);
        }

        function getFundList (index) {
            var fundIds = $('#fundIds' + index).attr('fundIds').replace(/\s+/g, '');
            var fundList = $('#fund-list' + index);
            var dataField = $('#data-field' + index).data('value');
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
                        var dataDate = res.dataDate && res.dataDate.split(/\W+/) || [];
                        $.each(res.data, function (i, fund) {
                            fund.fundData = fund[dataField] ? (fund[dataField] * 100).toFixed(2) + '%' : '--';
                            fund.fundDataDecrease = fund[dataField] < 0 ? 'decrease' : '';
                            var discount, feeStyle, feeDiscount, fee, symbol;
                            feeStyle = 'line';
                            discount = feeDiscount = fee = '';
                            if (!fund.extApplyProductFeeGson || !fund.extApplyProductFeeGson.fee) {
                                feeStyle = discount = '';
                                fee = feeDiscount = '--';
                            } else {
                                if(!fund.extApplyProductFeeGson.discount || fund.extApplyProductFeeGson.discount ==1) {
                                    discount = feeDiscount = feeStyle = '';
                                } else if (fund.extApplyProductFeeGson.discount < 1) {
                                    discount = (fund.extApplyProductFeeGson.discount * 10).toFixed(2) + '折';
                                    feeDiscount = fund.extApplyProductFeeGson.discountFee.toFixed(2) + '%';
                                } else if (fund.extApplyProductFeeGson.discount > 1) {
                                    discount = '';
                                    feeDiscount = fund.extApplyProductFeeGson.discount + '元/笔';
                                }
                                if (fund.extApplyProductFeeGson.fee) {
                                    symbol = '%';
                                }
                                fee = fund.extApplyProductFeeGson.fee.toFixed(2) + symbol;
                            }
                            fund.feeDiscount = feeDiscount;
                            fund.feeStyle = feeStyle;
                            fund.discount = discount;
                            fund.fee = fee;
                        });

                        var html = factory(res);
                        fundList.html(html);
                        if (dataDate.length > 2) {
                            $('#dataDate' + index).html(dataDate[2] + '年' + monthName(dataDate[0]) + '月' + dataDate[1] + '日');
                        }
                    }
                }
            });
        }

        var monthNames = {
            'Jan': 1, 
            'Feb': 2, 
            'Mar': 3, 
            'Thu': 4, 
            'May': 5, 
            'Jun': 6, 
            'Jul': 7, 
            'Aug': 8, 
            'Sep': 9, 
            'Oct': 10, 
            'Nov': 11, 
            'Dec': 12};
        function monthName (name) {
            return monthNames[name];
        }
    });
    
    var userAgent = navigator.userAgent;
    $('.fund-list').on('click', '.btn-invest', function () {
        var $this = $(this);
        if (!$this.hasClass('btn-stop')) {
            if (userAgent.indexOf('lufax') < 0) {
                $this.attr('href', 'https://game.lufax.com/game/app?redirectUri=lufax://funddetail?productid=' + $this.attr('productId'))
            } else {
                window.Bridge.call({
                    'task': 'schema',
                    'url': 'lufax://funddetail?productid=' + $this.attr('productId')
                })
            }
        }
    });

}());