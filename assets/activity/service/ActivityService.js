(function () {
    var activity = angular.module('activity');

    activity.service('$_ActivityService', ActivityService);

    ActivityService.$inject = ['$_ActivityResource'];


    //以下是service的定义
    function ActivityService ($_ActivityResource) {
        //以下是成员方法定义
        this.getTemplateList = function () {
            var q = $_ActivityResource.getTemplateList.get().$promise;

            return q.then(function (res) {
                res.data = res.data || [];
                return res.data.map(function (tp) {
                    return {
                        name: tp
                    };
                });
            });
        };

        this.getTemplate = function (params) {
            var q = $_ActivityResource.getTemplate.get(params).$promise;

            return q.then(function (res) {
                return res.data || {};
            });
        };

        this.downloadActivity = function (activityName) {
            var $form = $('<form>', {action: '/download/activity/' + activityName, method: 'GET'});

            $form.submit();
        };

        this.uploadImage = function (file, activityName, templateName, callback) {
            $(file).parent().ajaxSubmit({
                url: 'upload/activity/image',
                data: {
                    activityName: activityName,
                    templateName: templateName
                },
                success: function (res) {
                    callback && callback(res.data);
                }
            });
        };

        this.generateActivityPage = function (params) {
            var q = $_ActivityResource.generate.save(params).$promise;
        };

        this.preview = function (activityName) {
            var q = $_ActivityResource.preview.get({activity: activityName}).$promise;
            return q.then(function (res) {
                return res.data || {};
            });
        };
        //以下是工具方法定义
    }
}());