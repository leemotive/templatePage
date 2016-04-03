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
            if (!vm.activityName || !vm.targetTemplate.name) {
                return;
            }
            vm.targetTemplate.placeholders.forEach(function (ph) {
                params[ph.key] = ph.value;
                if (ph.type === 'select') {
                    ph.options.forEach(function (op) {
                        if (op.value === ph.value) {
                            params[ph.key + 'Text'] = op.text;
                        }
                    })
                }
                if (ph.type === 'loop') {
                    ph.value.forEach(function (value) {
                        ph.placeholders.forEach(function (lph) {
                            if (lph.type === 'select') {
                                lph.options.forEach(function (op) {
                                    if (op.value === value[lph.key]) {
                                        value[lph.key + 'Text'] = op.text;
                                    }
                                });
                            }
                        });
                    });
                }
                if (ph.type === 'dot') {
                    ph.placeholders.forEach(function (dph) {
                        if (dph.type === 'select') {
                            dph.options.forEach(function (op) {
                                if (op.value === ph.value[dph.key]) {
                                    ph.value[dph.key + 'Text'] = op.text;
                                }
                            });
                        }
                    });
                }
            });
            params = params || [];
            params.activityName = vm.activityName;
            params.templateName = vm.targetTemplate.name;
            $_ActivityService.generateActivityPage(params);
        };

        vm.downloadActivity = function (event) {
            event && event.stopPropagation();
            if (!vm.activityName) {
                return;
            }
            $_ActivityService.downloadActivity(vm.activityName);
        };

        vm.uploadImage = function (event, phd) {
            event && event.stopPropagation();
            if (!vm.activityName || !vm.targetTemplate.name) {
                return;
            }
            $_ActivityService.uploadImage(event.target, vm.activityName, vm.targetTemplate.name, setField);

            function setField (imgAddress) {
                $scope.$apply(function() {  
                    phd.value = imgAddress;
                });  
            }
        };

        vm.preview = function (event) {
            event && event.stopPropagation();
            if (!vm.activityName) {
                return;
            }
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
            if (!vm.targetTemplate.name){
                return;
            }
            return $_ActivityService.getTemplate({name: vm.targetTemplate.name}).then(function (res) {
                $.extend(vm.targetTemplate, res);
            });
        }
    }
}());