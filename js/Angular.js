 (function(){
   var app=angular.module("myFlickr",[]);

   app.controller("mainController",['$scope','$http',function($scope,$http)
   {
     var check=null;
     $scope.recent = '';
     $scope.interesting ='';
     $scope.search = '';
     $scope.lat = "6.64531";
     $scope.lng = "3.3958";
     $scope.imageSrc= null;
     $scope.showOverlay= false;

     $scope.showSearch= false;

     var map;
     var marker;
     var center;
     var initUrl = "https://api.flickr.com/services/rest/";
     var config = {
       params :{

        api_key:'6bf279c5f9d9e36bea5b3fb83f7a44f6',
        has_geo:'1',
        extras: 'geo',
        per_page: '20',
        page: '1',
        format: 'json',
        jsoncallback :"JSON_CALLBACK",
        method:''
      }
    };
    var config2 = {
     params :{

      api_key:'6bf279c5f9d9e36bea5b3fb83f7a44f6',
      has_geo:'1',
      extras: 'geo',
      per_page: '20',
      page: '1',
      format: 'json',
      jsoncallback :"JSON_CALLBACK",
      method:''
    }
  };

  $scope.searchBtn=function(){
    var term=$scope.SearchTerm;
    if(term == undefined)
    {
      alert("Please Enter A valid Search");
    }
    else{
      config2.params.tags = term;
      config2.params.per_page =198;
      config2.params.method = 'flickr.photos.search';
      $http.jsonp(initUrl,config2).success(function(recieved){
        $scope.search = recieved.photos.photo;
        console.log($scope.search);
        $scope.showSearch=true;
      });
    }
  };

  $scope.runAtStartUp = function(){

    config.params.method = "flickr.photos.getRecent";
    $http.jsonp(initUrl,config).success(function(data){
      $scope.recent = data.photos.photo;
    });

    config2.params.method = "flickr.interestingness.getList";
    $http.jsonp(initUrl,config2).success(function(response){
      $scope.interesting = response.photos.photo;
    }); 
$scope.drawMap();
  };

  $scope.imageClicked = function(photo){
    $scope.showOverlay= true;
    var imageUrl='https://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'.jpg';
        $scope.imageSrc = imageUrl;
        /*file is checked for the long and lat and sent to overlays info holder*/
        $scope.lat = photo.latitude;
        $scope.lng = photo.longitude;
        $scope.searchTitle=photo.title;

        var pos = new google.maps.LatLng($scope.lat,$scope.lng);
         console.log(pos);
        map.setCenter(pos);
        marker.setPosition(pos);
     };
     $scope.overlayClicked = function(){
      /*the hoverlay should be hidden when clicked*/
      $scope.showOverlay=false;
    };


    $scope.drawMap = function(e)
    {

        center =   new google.maps.LatLng($scope.lat,$scope.lng);
        var mapCanvas = document.getElementById('mapper');
        console.log(mapCanvas);
        var mapOptions = {
            center: center,
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        map = new google.maps.Map(mapCanvas,mapOptions);

        marker = new google.maps.Marker({
          position: center,
          map: map,
          title: 'Hello World!'
        });
    };

//google.maps.event.addDomListener(window, 'load', $scope.drawMap);
$scope.runAtStartUp();

}]);
})();