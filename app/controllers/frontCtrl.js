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

    $scope.newItemTypeName = "";

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

    $scope.loadMediaTypes = function() {
      $scope.mediaTypes = [];
      $http.get(`${apiURL}/mediatype`)
        .then(
          function(mediaTypesObj) {
            for (var i in mediaTypesObj.data) {
              $scope.mediaTypes.push(mediaTypesObj.data[i]);
            }
          },
          function() {
            console.log("Rejected");
          }
        );
    }

    $scope.loadMediaItems = function() {
      $scope.localCopy = [];
      getFactory().then(
          function(JSONobjFromGet) { // Handle RESOLVE
            for(var i in JSONobjFromGet) {
              $scope.localCopy.push(JSONobjFromGet[i]);
            }
          },
          function() { // Handle REJECT
            console.log("Rejected");
          }
      );
    };

    $scope.addNewItem = function() {
      $scope.newItem.DateAdded = new Date();
      $scope.newItem.IdAppUser = currentUser.IdAppUser;
      $scope.newItem.IdMediaType = $scope.getMediaId($scope.newItemTypeName);

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
        function(response) {  // Handle RESOLVE
          // Add new item to local array instead of relaoding from API:
          let newLocalItem = {
            IdMediaItem : response.data.IdMediaItem,
            IdMediaType : response.data.IdMediaType,
            Name : response.data.Name,
            Recommender : response.data.Recommender,
            Notes : response.data.Notes,
            Finished : response.data.Finished,
            Favorite : response.data.Favorite,
            Rating : response.data.Rating,
            DateAdded : response.data.DateAdded,
            Type : $scope.getMediaName(response.data.IdMediaType)
          }
          $scope.localCopy.push(newLocalItem);

          // Reset newItem values and clear input boxes on submit
          $scope.newItem.Name = null;
          $scope.newItem.Type = null;
          $scope.newItem.Recommender = null;
          $scope.newItem.Notes = null;
          $scope.newItem.Favorite = false;
          $scope.newItem.Finshed = false;
          $scope.newItem.IdMediaType = 0;
          $scope.newItem.Rating = 0;
          $scope.newItem.DateAdded = null;

          // Set focus to Name input to easily add another item
          $("#name-input").focus();

        },
        function(response) {  // Handle REJECT
          console.log("POST Rejected:", response);
        }
      );
    }

    $scope.cloneItem = function() {
      let itemToClone = this.item;
      $scope.newItemTypeName = $scope.getMediaName(itemToClone.IdMediaType);
      $scope.newItem.Favorite = itemToClone.Favorite;
      $scope.newItem.Finished = itemToClone.Finished;
      $scope.newItem.Name = itemToClone.Name;
      $scope.newItem.Notes = itemToClone.Notes;
      $scope.newItem.Rating = itemToClone.Rating;
      $scope.newItem.Recommender = itemToClone.Recommender;

      $scope.addNewItem();
    }

    $scope.getMediaId = function(typeName) {
      let selectedTypeObj = $scope.mediaTypes.filter(function(item) {
        return item.Name == typeName;
      });
      let typeId = selectedTypeObj[0].IdMediaType;
      return typeId;
    }

    $scope.getMediaName = function(typeId) {
      let selectedTypeObj = $scope.mediaTypes.filter(function(item) {
        return item.IdMediaType == typeId;
      });
      let typeName = selectedTypeObj[0].Name;
      return typeName;
    }

    $scope.deleteItem = function() {
      let itemToDelete = this.item;
      $http.delete(`${apiURL}/mediaitem?userid=${currentUser.IdAppUser}&itemid=${this.item.IdMediaItem}`)
      .then(
        function() { // Handle RESOLVE
          // Remove item from localCopy
          $scope.localCopy.splice($scope.localCopy.indexOf(itemToDelete), 1);
        },
        function() { // Handle REJECT
          console.log("DELETE rejected.", response);
        }
      );
    };

    $scope.editProperty = function(propToChange, newVal) {
      let itemToUpdate = this.item;
      let updatedItem = {
        IdMediaItem: this.item.IdMediaItem,
        IdMediaType: this.item.IdMediaType,
        IdAppUser: currentUser.IdAppUser,
        Name: this.item.Name,
        Recommender: this.item.Recommender,
        Notes: this.item.Notes,
        Finished: this.item.Finished,
        Favorite: this.item.Favorite,
        Rating: this.item.Rating,
        DateAdded: this.item.DateAdded
      }

      if (propToChange == "Type") {
        updatedItem["IdMediaType"] = $scope.getMediaId(newVal);
      } else {
        updatedItem[propToChange] = newVal;
      };

      $http.put(`${apiURL}/mediaitem?userid=${currentUser.IdAppUser}`,
        JSON.stringify(updatedItem))
      .then(
        function() {  // Handle RESOLVE
          // Update local array with updatedItem
          updatedItem["Type"] = $scope.getMediaName(updatedItem.IdMediaType);
          $scope.localCopy[$scope.localCopy.indexOf(itemToUpdate)] = updatedItem;
        },
        function(response) {  // Handle REJECT
          console.log("PUT Rejected:", response);
        }
      );
    }

    $scope.cancelAdd = function() {
      // Clear input boxes and set focus back to Name
      $scope.newItem.Name = null;
      $scope.newItemTypeName = null;
      $scope.newItem.Recommender = null;
      $scope.newItem.Notes = null;
      $("#name-input").focus();
    };

    // set value of input to current property value
    $scope.editMode = function(propName) {
      $scope.editProp[propName] = this.item[propName];
    };

    $scope.cancelEdit = function() {
      $("#name-input").focus();
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

    // Get MediaTypes and MediaItems on page load if user is authenticated
    if (currentUser != null) {
      $scope.loadMediaTypes();
      $scope.loadMediaItems();
    };

    $("#name-input").focus(); // Set focus to new item inputs
    $("#logout-link").show(); // Show logout link

  }
]);


