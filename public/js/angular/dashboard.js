var app = angular.module('dashboard', []);
app.controller('node', function($scope,$http,$timeout) {
    //$scope.getData = function(){
    $http.get('/rest/node/list')
      .success(function(data, status, headers, config) {

      // Your code here
      $scope.nodes = data;
    });
  	//};

  	$scope.input = function(node){
  		console.log(node);
  		$http.post('/rest/node/input/'+ node._id,{stdin: node.stdin})
	      .success(function(data, status, headers, config) {

	      // Your code here
	      console.log(data);
	      node.stdin="";
	    });
  	}
  //Function to replicate setInterval using $timeout service.
  $scope.intervalFunction = function(){
    $timeout(function() {
	    angular.forEach($scope.nodes, function(node, key) {
			$http.get('/rest/node/output/' + node._id)
		      .success(function(data, status, headers, config) {
		      console.log(data);
		      var result = JSON.parse(data);
		      // Your code here
		      console.log(result.stdout);
		      if(result.stdout){
		      		node.stdout += result.stdout;
		      }
		      if(result.stderr){
		      		node.stderr += result.stderr;
		      }
		      
		    });
		});
		$scope.intervalFunction();
	}, 5000);
  };

  // Kick off the interval
  $scope.intervalFunction();
});