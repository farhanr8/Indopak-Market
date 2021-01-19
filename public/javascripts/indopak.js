var app = angular.module('indopak', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'partials/Home.html',
        controller: 'Home'
    })
    .when('/login', {
        templateUrl: 'partials/Login.html',
        controller: 'LoginCtrl'
    })
    .when('/signup', {
        templateUrl: 'partials/Signup.html',
        controller:'AddAccountCtrl'
    })
    .when('/details', {
        templateUrl: 'partials/Details.html',
        controller: 'Details'
    })
    .when('/cart', {
        templateUrl: 'partials/Cart.html',
        controller: 'Cart'
    })
    .when('/ordersummary', {
        templateUrl: 'partials/OrderSummary.html',
        controller: 'OrderSummary'
    })
    .when('/editproduct/:id', {
        templateUrl: 'partials/EditProduct.html',
        controller: 'EditProduct'
    })
    .when('/deleteproduct/:id', {
		templateUrl: 'partials/DeleteProduct.html',
		controller: 'DeleteProduct'
	})
    .when('/orderhistory', {
        templateUrl: 'partials/OrderHistory.html',
        controller: 'OrderHistory'
    })
    .when('/addnew', {
        templateUrl: 'partials/AddProduct.html',
        controller: 'AddProductCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(event){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
                scope.file = (event.srcElement || event.target).files[0];
                scope.getFile();
            });
        }
    };
}]);

app.factory('fileReader', ["$q", "$log", function($q, $log){

    var onLoad = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };
    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };
    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        return reader;
    };
    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();
        var reader = getReader(deferred, scope);         
        reader.readAsDataURL(file);
        return deferred.promise;
    };
    return {
        readAsDataUrl: readAsDataURL  
    };

}]);

app.factory('ProductsService',function($http,$window,$q){
    var ProductsService = {};
    ProductsService.getAllProducts = function () {
        var allproducts = [];
        var productsdeferred = $q.defer();
        var productspromise = productsdeferred.promise;
        $http.get("/api/products")
        .then(function successCallback(response) {
            for (var i = 0; i < response.data.length; i++) {
                allproducts.push(response.data[i]);
            }
            productsdeferred.resolve(allproducts);
            // console.log('allproducts', allproducts);
        }, function errorCallback(response) {
            productdseferred.reject();
            console.log('ProductsService error');
        });
        return productspromise;
    };
    return ProductsService;
});

app.factory('AuthService',function($http,$window,$q){

	var AuthService = {};
	AuthService.login = function (credentials) {
		credentials.password = md5(credentials.password);
        var deferred = $q.defer();
        var promise = deferred.promise;
		$http.post("/api/login",credentials)
		.then(function successCallback(response) {
            deferred.resolve(response.data['result']);
            console.log('service', response.data['result']);
    	}, function errorCallback(response) {
            deferred.reject();
        	console.log('Login error');
    	});
        return promise;
	};
    // AuthService.matchPassword = function (username, inputOldPw) {
    //     inputOldPw = md5(inputOldPw);
    //     var deferred = $q.defer();
    //     var promise = deferred.promise;
    //     $http.get("/api/user")
    //         .then(function successCallback(response) {
    //             for (var i = 0; i < response.data.length; i++) {
    //                 if (response.data[i].username == username) {
    //                     if (response.data[i].password == inputOldPw) {
    //                         deferred.resolve(true);
    //                     }
    //                 }
    //             }
    //             deferred.resolve(false);
    //         }, function errorCallback(response) {
    //             deferred.reject();
    //             console.log('matchPassword error');
    //         });
    //     return promise;
    // };
    // AuthService.updatePassword = function (username, newpw) {
    //     $http.get("/api/user")
    //     .then(function successCallback(response) {
    //         for (var i = 0; i < response.data.length; i++) {
    //             if (response.data[i].username == username) {
    //                 response.data[i].password = md5(newpw);
    //                 var user = response.data[i];
    //             }
    //         }
    //         var parameter = JSON.stringify(user);
    //         // console.log("parameter = ", parameter);
    //         $http.post('/api/user/' + user['_id'], parameter)
    //         .success(function (data, status, headers, congig) {
    //             console.log('Password Update Success');
    //         })
    //         .error(function (data, status, headers, congig) {
    //             console.log('Password Update Error');
    //         });
    //     }, function errorCallback(response) {
    //         console.log('error');
    //     });
    // };
    return AuthService;
    
});

app.factory('CartService',function($http,$window,$q){

    var CartService = {};
    CartService.updatecart = function (product, username) {
        $http.get("/api/cart")
            .then(function successCallback(response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].username == username) {
                        // console.log(response.data[i]);
                        if (response.data[i].items.hasOwnProperty(product['_id'])) {
                            var item = response.data[i].items[product['_id']];
                            item['qty'] += 1;
                        } else {
                            product['qty'] = 1;
                            response.data[i].items[product['_id']] = product;
                        }
                        var user = response.data[i];
                    }
                }
                // console.log(user);
                var parameter = JSON.stringify(user);
                $http.post('/api/cart/' + user['_id'], parameter)
                    .success(function (data, status, headers, congig) {
                        alert('Product added to Cart!');
                    })
                    .error(function (data, status, headers, congig) {
                        console.log('Update Cart Error');
                    });
                // console.log(response);
            }, function errorCallback(response) {
                console.log('Update Cart error');
            });
    };
    CartService.deleteproduct = function (product, username) {
        $http.get("/api/cart")
            .then(function successCallback(response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].username == username) {
                        if (response.data[i].items.hasOwnProperty(product['_id'])) {
                            var item = response.data[i].items[product['_id']];
                            delete response.data[i].items[product['_id']];
                            // console.log(response.data[i].items);
                        } else {
                            console.log("No such product!");
                        }
                        var user = response.data[i];
                    }
                }
                // console.log(user);
                var parameter = JSON.stringify(user);
                $http.post('/api/cart/' + user['_id'], parameter)
                    .success(function (data, status, headers, congig) {
                        console.log('Deleted Product From Cart');
                    })
                    .error(function (data, status, headers, congig) {
                        console.log('Error Deleting Product In Cart');
                    });
                // console.log(response);
            }, function errorCallback(response) {
                console.log('deleteproduct error');
            });
    };
    CartService.clearCart = function (username) {
        var cartiddefer = $q.defer();
        var cartidpromise = cartiddefer.promise;
        $http.get("/api/cart").then(function successCallback(response) {
            // console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].username == username) {
                    // console.log("return is : ", response.data[i]);
                    response.data[i].items = {};
                    cartiddefer.resolve(response.data[i]);
                    var user = response.data[i];
                }
            }
            // console.log(user);
            var parameter = JSON.stringify(user);
            $http.post('/api/cart/' + user['_id'], parameter)
                .success(function (data, status, headers, congig) {
                    console.log('Clear Cart Success');
                })
                .error(function (data, status, headers, congig) {
                    console.log('Clear Cart Error');
                });
        }, function errorCallback(response) {
            cartiddefer.reject();
            console.log('clearCart error');
        });
        return cartidpromise;
    };
    CartService.thisCartItem = function (username) {
        var cartiddefer = $q.defer();
        var cartidpromise = cartiddefer.promise;
        $http.get("/api/cart").then(function successCallback(response) {
            // console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].username == username) {
                    // console.log("return is : ", response.data[i].items);
                    cartiddefer.resolve(response.data[i].items);
                }
            }
        }, function errorCallback(response) {
            cartiddefer.reject();
            console.log('thisCartItem error');
        });
        return cartidpromise;
    };
    CartService.totalPrice = function (items) {
        var totalprice = 0;
        for (var item in items) {
            totalprice += items[item].price * items[item].qty;
        }
        return totalprice;
    };
    CartService.addQuantity = function (product, username) {
        $http.get("/api/cart")
            .then(function successCallback(response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].username == username) {
                        if (response.data[i].items.hasOwnProperty(product['_id'])) {
                            var item = response.data[i].items[product['_id']];
                            item['qty'] += 1;
                        }
                        var user = response.data[i];
                    }
                }
                var parameter = JSON.stringify(user);
                $http.post('/api/cart/' + user['_id'], parameter)
                    .success(function (data, status, headers, congig) {
                        console.log('Add Quantity Success');
                    })
                    .error(function (data, status, headers, congig) {
                        console.log('Add Quantitiy Error');
                    });
                //console.log(response);
            }, function errorCallback(response) {
                console.log('addQuantity error');
            });
    };
    CartService.DecrQuantity = function (product, username) {
        $http.get("/api/cart")
            .then(function successCallback(response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].username == username) {
                        if (response.data[i].items.hasOwnProperty(product['_id'])) {
                            var item = response.data[i].items[product['_id']];
                            if (item['qty'] > 1)
                                item['qty'] -= 1;
                        }
                        var user = response.data[i];
                    }
                }
                var parameter = JSON.stringify(user);
                $http.post('/api/cart/' + user['_id'], parameter)
                    .success(function (data, status, headers, congig) {
                        console.log('Decrement Quantitiy Success');
                    })
                    .error(function (data, status, headers, congig) {
                        console.log('Decrement Quantitiy Error');
                    });
                //console.log(response);
            }, function errorCallback(response) {
                console.log('DecrQuantity error');
            });
    };
    return CartService;
    
});

app.factory('OrderService', function ($http, $location, $window, $q, CartService) {
    
    var OrderService = {};
    OrderService.addToOrder = function (username, items, totalprice, currenttime) {
        $http.get("/api/order")
            .then(function successCallback(response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].username == username) {
                        var order = {}; 
                        order.items = items;
                        order.time = currenttime;
                        order.totalprice = totalprice;
                        // console.log("order = ", order);
                        response.data[i].orders.push(order); 
                        // console.log("Response.data[i].orders=", response.data[i].orders);
                        var user = response.data[i];
                        // console.log("user : ", user);
                    }
                }
                var parameter = JSON.stringify(user);
                $http.post('/api/order/' + user['_id'], parameter)
                    .success(function (data, status, headers, congig) {
                        console.log('Add Order Success');
                    })
                    .error(function (data, status, headers, congig) {
                        console.log('Add Order Error');
                    });
                //console.log(response);
            }, function errorCallback(response) {
                console.log('addToOrder error');
            });
    };
    OrderService.showOrderHistory = function (username) {
        var res = [];
        $http.get("/api/order")
            .then(function successCallback(response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].username == username) {
                        // console.log("response.data[i].orders : ", response.data[i].orders);
                        for (var j = 0; j < response.data[i].orders.length; j++) {
                            res.push(response.data[i].orders[j]);
                        }
                    }
                }
            }, function errorCallback(response) {
                console.log('showOrderHistory error');
            });
        // console.log("return order history object is : ",res);
        return res;
    };
    OrderService.validateAndPlaceOrder = function (username, cart, totalprice, currenttime) {
        $http.get("/api/products")
            .then(function successCallback(response) {
                // console.log(response.data);
                var res = [];
                for (var i = 0; i < response.data.length; i++) {
                    for (var item in cart) {
                        if (response.data[i].name == cart[item].name && response.data[i].stock < cart[item].qty) {
                            res.push(cart[item].name);
                        }
                    }
                }
                // console.log("res = ", res);
                if (res.length == 0) { 
                    // console.log("Can order!");
                    OrderService.addToOrder(username, cart, totalprice, currenttime);
                    OrderService.updateStock(cart);
                    CartService.clearCart(username);
                } else {   
                    alert("Not enough products : " + res);
                    $location.path('ordersummary');
                }
            }, function errorCallback(response) {
                console.log('validateAndPlaceOrder error');
            });
    };
    OrderService.updateStock = function (cart) {
        $http.get("/api/products")
            .then(function successCallback(response) {
                // console.log("response.data = ", response.data);
                for (var i = 0; i < response.data.length; i++) {
                    for (item in cart) {
                        if (response.data[i].name == cart[item].name) {
                            // console.log("cart[item].name", cart[item].name);
                            response.data[i].stock = response.data[i].stock - cart[item].qty;
                            // console.log(response.data[i].name);
                            var user = response.data[i];
                            // console.log("user : ", user);
                            var parameter = JSON.stringify(user);
                            $http.post('/api/products/' + user['_id'], parameter)
                                .success(function (data, status, headers, congig) {
                                    console.log('Stock update success');
                                })
                                .error(function (data, status, headers, congig) {
                                    console.log('Stock update error');
                                });
                        }
                    }
                }
                //console.log(response);
            }, function errorCallback(response) {
                console.log('updateStock error');
            });
    };
    return OrderService;

});

app.factory('SignService',function($http,$window,$q){
    var SignService = {};
    SignService.signup = function (newuser) {
        newuser.password = md5(newuser.password);
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.post("/api/user",newuser)
        .then(function successCallback(response) {
            deferred.resolve(response.data);
            // console.log('service', response.data['result']);
            // console.log('service', response.data['message']);
        }, function errorCallback(response) {
            deferred.reject();
            console.log('SignService error');
        });
        return promise;
    };
    return SignService;
});

app.controller('Home',['$scope','$location','$resource','$window',
                function($scope,$location,$resource,$window){

    //console.log($window.sessionStorage.getItem('role'));
    if ($window.sessionStorage.getItem('role') === null) {
        $window.sessionStorage.setItem('role',0);
    }
    $scope.user = $window.sessionStorage.getItem('username');
    $scope.auth = $window.sessionStorage.getItem('role');
    $scope.jump = function(path) {
        if ($scope.auth == 1 || $scope.auth == 2) {
            $window.location.href = path;
        }
        else if ($scope.auth == 0) {
            alert("Please log in before you order!");
            $window.location.href = "/#/login";
        }          
    }
    $scope.logout = function(){
        var url = $location.url();
        // console.log(url);
        if (url!="/")
            $window.location.href = "#/";
        $window.sessionStorage.setItem('role',0);
        $window.sessionStorage.setItem('username',null);
        $window.location.reload();
    }

}]);

app.controller('Cart',['$scope','$location','$resource','$window','CartService',
                function($scope,$location,$resource,$window,CartService){

    // console.log($window.sessionStorage.getItem('role'));
    $scope.user = $window.sessionStorage.getItem('username');
    $scope.auth = $window.sessionStorage.getItem('role');

    CartService.thisCartItem($scope.user).then(function (result) {
        //console.log($scope.cart);
        $scope.cart = result;
    }).then(function () {
        $("#totalprice").text(CartService.totalPrice($scope.cart));
    });

    $scope.deleteproduct = function (product, username) {
        CartService.deleteproduct(product, username);
        $window.location.reload(); 
    };

    $scope.confirmation = function () {
        $location.path('ordersummary');
    };

    $scope.incr = function (product, username) {
        //console.log("$scope.cart : ", $scope.cart);
        product.qty += 1;
        CartService.addQuantity(product, username);
        $("#totalprice").text(CartService.totalPrice($scope.cart));
    };

    $scope.decr = function (product, username) {
        if (product.qty > 1)
            product.qty -= 1;
        CartService.DecrQuantity(product, username);
        $("#totalprice").text(CartService.totalPrice($scope.cart));
    };

}]);

app.controller('Details',['$scope','$location','$resource','$window','CartService','ProductsService',
                function($scope,$location,$resource,$window,CartService,ProductsService) {

    // console.log($window.sessionStorage.getItem('role'));
    $scope.user = $window.sessionStorage.getItem('username');
    $scope.auth = $window.sessionStorage.getItem('role');

    // Checkbox
    $scope.category = [{
        id:1,
        tag:'Rice'
    },{
        id:2,
        tag:'Drinks'
    },{
        id:3,
        tag:'Spices'
    }
    ,{
        id:4,
        tag:'Flour'
    }];

    var selectedtag = [];

    $scope.updateSelection = function($event){
        var catebox = $event.target;
        var action = (catebox.checked?'add':'remove');
        updateSelected(action,catebox.name);
    }
    var updateSelected = function(action,name){
        if(action == 'add' && selectedtag.indexOf(name) == -1){
            selectedtag.push(name);
        }
        if(action == 'remove' && selectedtag.indexOf(name) != -1){
            var idx = selectedtag.indexOf(name);
            selectedtag.splice(idx,1);
        }
    }
    var Product = $resource('/api/products');
    Product.query(function(product){
        $scope.product = product;
    });
    $scope.func = function(e){
        if (selectedtag.length < 1) {
            return (e.class == 'Rice'||
                e.class == 'Drinks'||
                e.class == 'Spices'||
                e.class == 'Flour')
                //|| e.class == 'Combo')
        }
        for (var i = 0; i < selectedtag.length; i++) {
            if(e.class == selectedtag[i]){
                //console.log(selectedtag[i]);
                return e.class == selectedtag[i];
            }
        }
    }
    $scope.addtocart = function(product,username){
        // console.log(product);
        // console.log(username);
        CartService.updatecart(product,username);
    };
    $scope.logout = function(){
        var url = $location.url();
        // console.log(url);
        if (url!="/")
            $window.location.href = "#/";
        $window.sessionStorage.setItem('role',0);
        $window.sessionStorage.setItem('username',null);
        $window.location.reload();
    }

}]);

app.controller('AddProductCtrl', function($scope, fileReader, $window, $resource, $location){

    $scope.user = $window.sessionStorage.getItem('username');
    $scope.auth = $window.sessionStorage.getItem('role');
    // console.log($scope.file);
    $window.localStorage.setItem('productImgUrl',undefined);
    $scope.getFile = function () {
        // console.log($scope.file.name);
        if ($window.localStorage.getItem('productImgUrl')==null||
            $window.localStorage.getItem('productImgUrl')==undefined) {
            $window.localStorage.setItem('productImgUrl',$scope.file.name);
        }else{
            $window.localStorage.setItem('productImgUrl',null);
            $window.localStorage.setItem('productImgUrl',$scope.file.name);
        }        
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
          $scope.imageSrc = result;
      });
    };
    //console.log($window.localStorage.getItem('productImgUrl'));
    $scope.category = ["Rice", "Drinks", "Spices", "Flour"]; // "Combo"];
    // console.log($scope.category);
    $scope.newproduct = {
        name:"",
        class:"",
        picture:"",
        price:0,
        stock:0,
        description:""
    };
    $scope.save = function(newproduct){
        // console.log($window.localStorage.getItem('productImgUrl'));
        newproduct.picture = "../images/"+$window.localStorage.getItem('productImgUrl');
        // console.log(newproduct);
        var newProduct = $resource('/api/products');
        newProduct.save(newproduct,function(){
            $location.path('details');
        });
    }
    $scope.logout = function(){
        var url = $location.url();
        // console.log(url);
        if (url!="/")
            $window.location.href = "#/";
        $window.sessionStorage.setItem('role',0);
        $window.sessionStorage.setItem('username',null);
        $window.location.reload();
    }

});

app.controller('EditProduct', ['$scope', '$location', '$resource', '$window', '$routeParams','fileReader',
                function ($scope, $location, $resource, $window, $routeParams, fileReader) {

    $scope.user = $window.sessionStorage.getItem('username');
    $scope.auth = $window.sessionStorage.getItem('role');
    $scope.category = ["Rice", "Drinks", "Spices", "Flour"]; // "Combo"];
    $window.localStorage.setItem('productImgUrl',undefined);
    $scope.getFile = function () {
        // console.log($scope.file.name);
        if ($window.localStorage.getItem('productImgUrl')==null||
            $window.localStorage.getItem('productImgUrl')==undefined) {
            $window.localStorage.setItem('productImgUrl',$scope.file.name);
        } else {
            $window.localStorage.setItem('productImgUrl',null);
            $window.localStorage.setItem('productImgUrl',$scope.file.name);
        }        
        fileReader.readAsDataUrl($scope.file, $scope).then(function(result) {
            $scope.imageSrc = result;
        });
    };
    var Product = $resource('/api/products/:id', {id: '@_id'}, {
        update: {method: 'PUT'}
    });
    Product.get({id: $routeParams.id}, function (product) {
        $scope.product = product;
    });
    $scope.save = function (editproduct) {
        // console.log('EditProduct picture: ',editproduct.picture);
        // console.log('Item: ',$window.localStorage.getItem('productImgUrl'));
        if ($window.localStorage.getItem('productImgUrl')!="undefined") {
            editproduct.picture = "../images/"+$window.localStorage.getItem('productImgUrl');
        }    
        // console.log(editproduct);
        Product.update(editproduct, function () {
            console.log("Product update successful!");
            $location.path('details');
        });
    }
    $scope.logout = function(){
        var url = $location.url();
        // console.log(url);
        if (url!="/")
            $window.location.href = "#/";
        $window.sessionStorage.setItem('role',0);
        $window.sessionStorage.setItem('username',null);
        $window.location.reload();
    }

}]);

app.controller('DeleteProduct', ['$scope', '$resource', '$location', '$routeParams',
	function($scope, $resource, $location, $routeParams){
		var Videos = $resource('/api/products/:id');
		Videos.get({ id: $routeParams.id }, function(video){
			$scope.video = video;
		})
		$scope.delete = function(){
			Videos.delete({ id: $routeParams.id }, function(video){
				$location.path('details');
			});
		}
    }]);
    
app.controller('OrderHistory', ['$scope', '$location', '$resource', '$window', 'OrderService',
                function ($scope, $location, $resource, $window, OrderService) {

    $scope.user = $window.sessionStorage.getItem('username');
    $scope.auth = $window.sessionStorage.getItem('role');
    $scope.orderhistory = OrderService.showOrderHistory($scope.user);
    $scope.item = $scope.orderhistory.items;
    $scope.logout = function(){
        var url = $location.url();
        // console.log(url);
        if (url!="/") {
            $window.location.href = "#/";
        }
        $window.sessionStorage.setItem('role',0);
        $window.sessionStorage.setItem('username',null);
        $window.location.reload();
    }
}]);

app.controller('AddAccountCtrl', ['$scope', '$resource', '$location','$window','SignService',
                function($scope, $resource, $location,$window,SignService){

    // console.log($scope.unique);
    $scope.save = function(newuser){
        if ($scope.signup == undefined || 
            $scope.signup.password == undefined ||
            $scope.signup.username == undefined ||
            $scope.signup.email == undefined) {
            // console.log($scope.signup);
        } else {
            // console.log($scope.signup);
            // console.log('New',newuser);
            SignService.signup(newuser).then(function(state){
                // console.log(state);
                $scope.unique = !state.message;
                if (state.message) {
                    $window.sessionStorage.setItem('username',newuser.username);
                    $window.sessionStorage.setItem('role',state.result);
                    $location.path('details');
                }
            });
        }  
    };
}]);

app.controller('OrderSummary', ['$scope', '$location', '$resource', '$window', 'CartService', 'OrderService',
                function ($scope, $location, $resource, $window, CartService, OrderService) {

    // console.log($window.sessionStorage.getItem('role'));
    $scope.user = $window.sessionStorage.getItem('username');
    $scope.auth = $window.sessionStorage.getItem('role');
    CartService.thisCartItem($scope.user).then(function (result) {
        $scope.cart = result;
        $scope.totalprice = CartService.totalPrice($scope.cart);
    });
    $scope.save = function () {   
        // console.log("username:", $scope.user);
        // console.log("cart: ", $scope.cart);
        // console.log("total price: ", $scope.totalprice);
        var myDate = new Date();
        // console.log("Current time : ", myDate.toLocaleDateString() + " " + myDate.toLocaleTimeString());
        // var valid = OrderService.validateOrder($scope.cart);
        OrderService.validateAndPlaceOrder($scope.user,$scope.cart,$scope.totalprice, myDate.toLocaleDateString() + " " + myDate.toLocaleTimeString());
        $location.path('details');
    };
    $scope.logout = function(){
        var url = $location.url();
        // console.log(url);
        if (url!="/")
            $window.location.href = "#/";
        $window.sessionStorage.setItem('role',0);
        $window.sessionStorage.setItem('username',null);
        $window.location.reload();
    }
}]);

app.controller('LoginCtrl', ['$scope', '$resource', '$location', '$rootScope','$window','AuthService',
                function($scope, $resource, $location, $rootScope, $window,AuthService){

    $scope.credentials = {
        username : '',
        password : ''
    };  
    $scope.login = function(credentials) {
        AuthService.login(credentials).then(function(role){
            // console.log('Role: ',role);
            if (role===1||role===2) {
                $window.sessionStorage.setItem('username',credentials.username);
                $window.sessionStorage.setItem('role',role);
                $location.path('details');
            } else {
                $window.sessionStorage.setItem('username',null);
                $window.sessionStorage.setItem('role',role);
                $location.path('/');
            }
        });
    };
    $scope.jump = function(path) {
        $window.location.href = path;        
    }
}]);



