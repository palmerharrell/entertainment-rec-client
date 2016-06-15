"use strict";

let app = angular.module("ERM-App", ["ngRoute"]);

app.constant('apiURL', 'http://localhost:5000/api');

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

// TODO: redirect to login if user is not authenticated





