
(function(){
    
var myApp = angular.module("CodeGreen",[]);

myApp.controller("MainController", ['$scope', '$http', function($scope, $http){
    

var restletQuestions = function()
    {
       $http({
        method: 'GET',
        url: 'https://codegreen.restlet.net/v1/questions/',
        headers: {
            "authorization" : "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
            "content-type": "application/json",
            "accept": "application/json",
        }
    }).then(function successCallback(response)
        {
        $scope.questions = response.data;
        console.log(response.data);
        }, 
        function errorCallback(response){
        console.error('Error while fetching notes');
        console.error(response);
    });
};

    restletQuestions();


    
    $scope.addQuestion = function(questionText, questionType, questionChoices)
    {
      $http({
            method: 'POST',
            url: 'https://codegreen.restlet.net/v1/questions/',
            headers: {
                "authorization" : "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                "content-type": "application/json",
                "accept": "application/json",
            },
            data: {"id":"","questionType": questionType ,"questionText": questionText,"questionChoices":[questionChoices]},
        }).then(function(response)
            {
            console.log("Successful PUT request");
            }, 
            function(response){
            console.error('Error while fetching notes');
            console.error(response);
        });
            restletQuestions();
    };
    
    
    
    
    
        
var restletQuestionsPost = function()
    {
       $http({
        method: 'POST',
        url: 'https://codegreen.restlet.net/v1/questions/',
        headers: {
            "authorization" : "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
            "content-type": "application/json",
            "accept": "application/json",
        },
        data: '{"id":"12312safasyt3123","questionType":"TOM was here","questionText":"Angular API","questionChoices":["some text"]}',
    })
           
    .then(function(response)
        {
        console.log("Successful PUT request");
        }, 
        function(response){
        console.error('Error while fetching notes');
        console.error(response);
    });
};
    
    

   var person = {
        firstName: "John",
        lastName: "Smith"
    }; 
    
   
    
     $scope.peoples = person;
     $scope.repoSortOrder = "+name";

    
    var onUserComplete = function(response){
        $scope.user = response.data;
        $http.get($scope.user.repos_url)
            .then(onRepos, errorMessage);
    };
    
    var onRepos = function(response){
       
      $scope.repos = response.data;  
    };
    
    var errorMessage = function(reason){
        $scope.error = "Could not fetch the user";
    };
    
    $scope.search = function(username){
        $http.get("https://api.github.com/users/" + username)
    .then(onUserComplete, errorMessage);
    }; 
    
    
    /* =========== WORKS WITHOUT AUTHORIZATION WHEN APPLIED WITHIN RESTEL ========== */
    var restlet = function()
    {
        $http.get("https://codegreen.restlet.net/v1/questions/")
        .then(function(response){
           $scope.test = response.data;
            console.log($scope.test);
        });
        
    }
    
   
 

    
}]);
    
    
      
}());
                            
    
