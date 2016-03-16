(function () {
    var app = angular.module('fundTemplate');

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
        function ($sateProvider, $urlRouterProvider, $httpProvider) {
            $sateProvider
                .state('activity', {
                    'url': '/activity',
                    'templateUrl': 'activity/view/activity.html',
                    'controller': 'ActivityController as ac'
                })
                .state('upload', {
                    'url': '/upload',
                    'templateUrl': 'upload/view/upload.html',
                    'controller': 'UploadController as uc'
                });
        }
    ]);
}());