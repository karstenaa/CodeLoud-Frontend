var app = angular.module('dashboard', []);
app.controller('node', function($scope,$http,$timeout) {
    //$scope.getData = function(){
    $http.get('/rest/node/list')
      .success(function(data, status, headers, config) {

      // Your code here
      $scope.nodes = data;
    });
  	//};

  // Function to replicate setInterval using $timeout service.
  // $scope.intervalFunction = function(){
  //   $timeout(function() {
  //     $scope.getData();
  //     $scope.intervalFunction();
  //   }, 1000)
  // };

  // // Kick off the interval
  // $scope.intervalFunction();
});