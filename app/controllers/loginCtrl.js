"use strict";

app.controller('LoginCtrl',
[
  '$http', 
  '$scope',
  '$location',
  'apiURL',
  'authFactory',

  function ($http, $scope, $location, apiURL, authFactory) {

    console.log("LoginCtrl loaded");

    $scope.githubOauth = function () {
      OAuth.initialize('TVVqPAV8aRr7Rb5TUDTOFMd3fgc')
      OAuth.popup('github').done(function(result) {
          console.log(result)

          result.me().done(function(data) {
              
              console.log(data);

              $http({
                url: apiURL + '/AppUser',
                method: 'POST',
                data: JSON.stringify({
                  username: data.alias,
                  email: data.email
                })
              }).then(
                response => {
                  console.log("response.data: ", response.data);
                  let theUser = response.data;
                  authFactory.setUser(theUser);
                  console.log("resolve fired", theUser);
                  $location.path('/');
                },
                response => {
                  console.log("reject fired", response);

                  // User has already been created
                  if (response.status === 409) {
                    $http
                      .get(`${apiURL}/appUser?username=${data.alias}`)
                      .then(
                        response => {
                          let theUser = response.data[0];
                          console.log("Found the User", theUser);
                          authFactory.setUser(theUser);
                          $location.path('/');
                        },
                        response => console.log("Could not find that User", response)
                        
                      )
                  }
              }
              )
          })
      });
    };
  }
]);
