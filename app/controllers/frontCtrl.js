app.controller("frontCtrl", [
  "$scope",
  "$http",
  "$location",
  "getFactory",
  "authFactory",
  
  function($scope, $http, $location, getFactory, authFactory) {
    
    let currentUser = authFactory.getUser();

    if (currentUser === null) {
      $location.path('/login');
    };

    let selectedFilters = {};
    
    // For editing properties of existing items
    $scope.editProp = {
      name: "",
      recommended: "",
      notes: ""
    };

    $scope.newItem = {
      id: "", 
      fbuid: "", 
      name: "", 
      type: "", 
      finished: false, 
      recommended: "",
      notes: "",
      rating: 0,
      date: ""
    };

    $scope.loadFromAPI = function() {
      $scope.localCopy = [];
      getFactory().then(
          function(JSONobjFromGet) { // Handle RESOLVE
            for(var i in JSONobjFromGet) {
              $scope.localCopy.push(JSONobjFromGet[i]);
            }
            console.table($scope.localCopy);
          },
          function() { // Handle REJECT
            console.log("Rejected");
          }
      );
    };

    // ~~~~~~~~~~~~
    // ~~~ POST ~~~
    // ~~~~~~~~~~~~

    // Example POST object:

    // {
    //   "DateAdded" : "3/3/2016",
    //   "Favorite" : false,
    //   "Finished" : false,
    //   "IdAppUser" : 14,
    //   "IdMediaType" : 1,
    //   "Name" : "Book POST test",
    //   "Notes" : "This was created via POST method",
    //   "Rating" : 0,
    //   "Recommender" : "Trevor"
    // }

    $scope.addNewItem = function() {
      console.log("addNewItem function called");
    }

    $scope.cancelAdd = function() {
      // Clear input boxes and set focus back to Name
      $scope.newItem.name = null;
      $scope.newItem.type = null;
      $scope.newItem.recommended = null;
      $scope.newItem.notes = null;
      $("#name-input").focus();
    };

    // set value of input to current property value
    $scope.editMode = function(propName) {
      $scope.editProp[propName] = this.item[propName];
    };

    $scope.cancelEdit = function() {
      //$scope.loadFromFirebase(); // Reload Firebase db
    };

    $scope.filterButtonClasses = function(e) {
      var clickedButtonId = `#${e.target.id}`;
      // remove .active-filter from all .filter-button
      var filterButtons = $(".filter-button");
      for (var i = 0; i < filterButtons.length; i++) {
        var currentButton = filterButtons[i];
        $(currentButton).removeClass("active-filter");
        $(currentButton).addClass("hand");
      }
      // add .active-filter to clicked button
      $(clickedButtonId).addClass("active-filter");
      $(clickedButtonId).removeClass("hand");
    };

    $scope.sortLinkClasses = function(e) {
      console.log("event", e);
      var clickedLinkId = `#${e.target.id}`;
      var sortLinks = $(".sort-link");
      for (var i = 0; i < sortLinks.length; i++) {
        var currentLink = sortLinks[i];
        $(currentLink).removeClass("active-sort");
        $(currentLink).addClass("hand");
      }
      $(clickedLinkId).addClass("active-sort");
      $(clickedLinkId).removeClass("hand");
    };

    $scope.backlogButtonClasses = function(e) {
      var clickedButtonId = `#${e.target.id}`;
      // remove .active-filter from other button
      if (clickedButtonId === "#backlog-button") {
        $("#finished-button").removeClass("active-filter");
        $("#finished-button").addClass("hand");
      } else {
        $("#backlog-button").removeClass("active-filter");
        $("#backlog-button").addClass("hand");
      }
      // add .active-filter to clicked button
      $(clickedButtonId).addClass("active-filter");
      $(clickedButtonId).removeClass("hand");
    };

    $scope.changeTheme = function(e) {
      var clickedButtonId = `#${e.target.id}`;
      if (clickedButtonId === "#bw-button") {
        $("#color-button").removeClass("active-filter");
        $("#color-button").addClass("hand");
        $("#front-container").removeClass("color-theme");
        $("#front-container").addClass("gray-theme");
      } else {
        $("#bw-button").removeClass("active-filter");
        $("#bw-button").addClass("hand");
        $("#front-container").removeClass("gray-theme");
        $("#front-container").addClass("color-theme");
      }
      // add .active-filter to clicked button
      $(clickedButtonId).addClass("active-filter");
      $(clickedButtonId).removeClass("hand");

    };

    // Add class based on type to each list item for color-coding
    $scope.applyClass = function(item) {
      if (item.Type === "Book") {
        return "book-item";
      } else if (item.Type === "Movie") {
        return "movie-item";
      } else if (item.Type === "TV Show") {
        return "show-item";
      } else if (item.Type === "Music") {
        return "music-item";
      } else if (item.Type === "Game") {
        return "game-item";
      } else {
        return "";
      }
    };


    $scope.loadFromAPI(); // Get list on page load
    $("#name-input").focus(); // Set focus to new item inputs
    $("#logout-link").show(); // Show logout link

  }
]);


