"use strict";

var app = angular.module("ERM-App", ["ngRoute"]);

// Address of Firebase database
app.constant('firebaseURL', "https://entertainmentbacklog.firebaseio.com");

// Set up angular-route
app.config(["$routeProvider",
  function ($routeProvider) {
    $routeProvider.
      when("/", {
        templateUrl: "partials/front-page.html",
        controller: "frontCtrl"
      }).
      when("/login", {
        templateUrl: "partials/login.html",
        controller: "LoginCtrl"
      }).
      when("/logout", {
        templateUrl: "partials/login.html",
        controller: "LoginCtrl"
      }).
      otherwise({
        redirectTo: "/"
      });
  }]);

// redirect to login if user is not authenticated





