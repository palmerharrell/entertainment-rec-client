// ng-enter directive
app.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });
		    event.preventDefault();
      }
    });
  };
});

// ng-esc directive
app.directive('ngEsc', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 27) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEsc);
        });
        event.preventDefault();
      }
    });
  };
});

// focus on show directive
app.directive('focusOnShow', function($timeout) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      if ($attr.ngShow){
        $scope.$watch($attr.ngShow, function(newValue){
          if(newValue){
            $timeout(function(){
              $element.focus();
            }, 0);
          }
        });      
      }
      if ($attr.ngHide){
        $scope.$watch($attr.ngHide, function(newValue){
          if(!newValue){
            $timeout(function(){
              $element.focus();
            }, 0);
          }
        });      
      }
    }
  };
});

// Select input text when input gains focus
app.directive('selectOnFocus', ['$window', function ($window) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.on('focus', function () {
        if (!$window.getSelection().toString()) {
          this.setSelectionRange(0, this.value.length);
        }
      });
    }
  };
}]);
