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
      
      
      $scope.toggleFriendship = function(user) {
        var currentUser = $scope.user;
        var i;
        for (i=0; i < currentUser.friends.length; i++) {
          if (currentUser.friends[i].uName == user.username) {
            currentUser.friends.splice(i, 1);
            $http.delete(`/user/friends/${user.username}/remove`);
            return;
          }
        }
        var new_friend = {uName: user.username};
        if(user.fname != undefined && user.lname != undefined && user.fname != '' && user.lname != '') {
          new_friend['fullName'] = user.fname + ' ' + user.lname;
        } else {
          new_friend['fullName'] = '';
        }
        currentUser.friends.push(new_friend);
        $http.post(`/user/friends/${user.username}/add`);
      }
}]);