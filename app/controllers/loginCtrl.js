"use strict";

app.controller("LoginCtrl",
[
  "$scope",
  "$location",
  "$http",
  "authFactory",

  function ($scope, $location, $http, authFactory) {
    
    $("#logout-link").hide(); // Hide logout link
    $("#email-input").focus(); // Set focus to email input

    $scope.account = { email: "", password: "" };

    // register a new user account and login  

    // authenticate user

  }
]);
