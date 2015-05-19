var app = angular.module('history', []);
app.controller('node', function($scope,$http,$timeout) {
    //$scope.getData = function(){
    $http.get('/rest/node/history')
      .success(function(data, status, headers, config) {

      // Your code here
      $scope.nodes = data;
    });
});