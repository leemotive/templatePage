(function () {
    var activity = angular.module('activity');

    activity.factory('$_ActivityResource', ActivityResource);

    ActivityResource.$inject = ['$resource'];


    //以下是resource的定义
    function ActivityResource ($resource) {
        return {
            getTemplateList:            $resource('/api/template'),
            getTemplate:                $resource('/api/template/:name'),
            preview:                    $resource('/api/preview/:activity'),
            generate:                   $resource('/api/activity')
        };
    }

}());