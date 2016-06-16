app.controller("frontCtrl", [
  "$scope",
  "$http",
  "$location",
  "getFactory",
  "authFactory",
  "apiURL",
  
  function($scope, $http, $location, getFactory, authFactory, apiURL) {
    
    let currentUser = authFactory.getUser();

    if (currentUser === null) {
      $location.path('/login');
    };

    let selectedFilters = {};
    
    // For editing properties of existing items
    $scope.editProp = {
      Name: "",
      Recommender: "",
      Notes: ""
    };

    $scope.newItem = {
      DateAdded: "", 
      Favorite: false, 
      Finished: false, 
      IdAppUser: 0, 
      IdMediaType: 0, 
      Name: "",
      Notes: "",
      Rating: 0,
      Recommender: ""
    };

    $scope.loadMediaItems = function() {
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
      $scope.newItem.DateAdded = new Date(); // Set date added
      $scope.newItem.IdAppUser = currentUser.IdAppUser; // Tie this item to current user
      $scope.newItem.IdMediaType = 3 // TEST - GET THIS FROM SELECTED TYPE!

      $http.post(apiURL + '/mediaitem',

        JSON.stringify({
          DateAdded: $scope.newItem.DateAdded,
          Favorite: $scope.newItem.Favorite,
          Finished: $scope.newItem.Finished,
          IdAppUser: $scope.newItem.IdAppUser,
          IdMediaType: $scope.newItem.IdMediaType,
          Name: $scope.newItem.Name,
          Notes: $scope.newItem.Notes,
          Rating: $scope.newItem.Rating,
          Recommender: $scope.newItem.Recommender

        }))
      .then(
        function() {  // Handle RESOLVE
          $scope.loadMediaItems(); // Reload MediaItems from API (change this to update scope array instead!)
           // Clear input boxes on submit
          $scope.newItem.Name = null;
          $scope.newItem.Type = null;
          $scope.newItem.Recommender = null;
          $scope.newItem.Notes = null;
          // Set focus to Name input to easily add another item
          $("#name-input").focus();

        },
        function(response) {  // Handle REJECT
          console.log("POST Rejected:", response);
        }
      );
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


    $scope.loadMediaItems(); // Get list on page load
    $("#name-input").focus(); // Set focus to new item inputs
    $("#logout-link").show(); // Show logout link

  }
]);


