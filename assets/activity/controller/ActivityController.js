(function () {
    var activity = angular.module('activity');

    activity.controller('ActivityController', ActivityController);

    ActivityController.$inject = ['$scope', '$_ActivityService'];


    //以下是controller的定义
    function ActivityController ($scope, $_ActivityService) {
        var vm = this;
        vm.templates = [];
        vm.targetTemplate = {};
        vm.activityName = '';

        getTemplateList();

        vm.selectTemplate = function (event) {
            event && event.stopPropagation();

            if (vm.targetTemplate.template) {

            } else {
                getTemplate();
            }
        };

        vm.generateActivityPage = function ($event) {
            event && event.stopPropagation();
            var params = {};
            vm.targetTemplate.placeholders.map(function (ph) {
                params[ph.key] = ph.value;
            });
            params = params || [];
            params.activityName = vm.activityName;
            params.templateName = vm.targetTemplate.name;
            $_ActivityService.generateActivityPage(params);
        };

        vm.downloadActivity = function (event) {
            event && event.stopPropagation();
            
            $_ActivityService.downloadActivity(vm.activityName);
        };

        vm.uploadImage = function (event, phd) {
            event && event.stopPropagation();
            
            $_ActivityService.uploadImage(event.target, vm.activityName, vm.targetTemplate.name, setField);

            function setField (imgAddress) {
                $scope.$apply(function() {  
                    phd.value = imgAddress;
                });  
            }
        };

        vm.preview = function (event) {
            event && event.stopPropagation();
            $_ActivityService.preview(vm.activityName).then(function () {
                window.open('/preview/' + vm.activityName + '/index.html');
            });
        };

        function resolveTemplate () {

        }

        function getTemplateList () {
            return $_ActivityService.getTemplateList().then(function (res) {
                vm.templates = res;
            });
        }

        function getTemplate () {
            return $_ActivityService.getTemplate({name: vm.targetTemplate.name}).then(function (res) {
                $.extend(vm.targetTemplate, res);
            });
        }
    }
}());