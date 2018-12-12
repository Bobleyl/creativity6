angular.module('myApp', []).
  controller('myController', ['$scope', '$http',
                              function($scope, $http) {
    $http.get('/user/profile')
    .then(function(data, status, headers, config){
      $scope.user = data.data;
      $scope.error = "";
      $scope.users = [];
      return $http.get('/users')
    })
    .then(function(data, status, headers, config) {
          $scope.users = data['data'];
          var i;
          for(i = 0; i < $scope.users.length; i++) {
            var user = $scope.users[i];
            if(user._id == $scope.user._id) {
              $scope.users.splice(i, 1);
            }
          }
      });
      
      
      $scope.toggleFriendship = function(event, user) {
        debugger;
      }
}]);