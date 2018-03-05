//////////////////////////////////////////////////////
//
//      GIPHY SEARCH - app.js
//

//////////////////////////////////////////////////////
//
//      GLOBAL OBJECTS AND VARIABLE
//
var categoryFlowers = {
    name: "Flowers",
    topics: ["rose", "orchid", "petunia", "lily", "daisy", "geranium", "tulip", "bluebonnet", "lilac", "violet"]
};

var categoryCars = {
    name: "Cars",
    topics: ["mustang", "corvette", "bugati", "ferrari", "lamborghini", "camaro", "truck", "porsche", "bmw", "mercedes"]
};

var categoryAnimals = {
    name: "Animals",
    topics:["cat", "dog", "goat", "sheep", "horse", "mouse", "rabbit", "hamster", "chicken", "pig"]
};

var categoryFavorites = {
    name: "Favorites",
    topics:[]
}

var categories = [categoryFlowers, categoryCars, categoryAnimals];
var activeCategory = categories[0];
var favorites = {data:[]};


var queryURLpre = "https://api.giphy.com/v1/gifs/search?api_key=pzWkzRyZiQFVEaxvVwyOIxLpA3h7ip8w&q=";
var queryURLpost = "&limit=10&offset=0&rating=G&lang=en";

//////////////////////////////////////////////////////
//
//      UTILITY FUNCTIONS TO CREATE CONTENT
//

function createCategoryTabs(currentIndex) {
    $("#categories").empty();
    
    //add favorites button
    var favButton = $("<button>").addClass("nav-link favorites").attr({
        "id": "favTab",
        "data-name": "showFavs"
    });
    //add + special character
    favButton.html('<i class="fas fa-star"></i> Favorites');
    var favItem = $("<li>").addClass("nav-item").append(favButton);
    $("#categories").append(favItem);

    //prepend add new category tab
    var button = $("<button>").addClass("nav-link category").attr({
        "id": "cat+",
        "data-name": "add",
        "data-toggle": "modal",
        "data-target": "#myCategory"
    });
    //add + special character
    button.html('<i class="fas fa-plus-circle"></i>');
    var item = $("<li>").addClass("nav-item").append(button);
    $("#categories").prepend(item);
    
    //iterate in reverse order and prepend
    for (var i = categories.length-1; i >=0 ; i--) {
        var button = $("<button>").addClass("nav-link category").text(categories[i].name).attr({
            "id": "cat" + i,
            "data-name": categories[i].name,
            "data-index": i
        });
        //add the active class only if the current category is the button we are making
        if (currentIndex === i) button.addClass("active");
        //append to the list item
        var item = $("<li>").addClass("nav-item").append(button);
        //append to the html container
        console.log("appending " + categories[i].name);
        $("#categories").prepend(item);
    }  

}

function createButtons() {
    $("#gifbuttons").empty();
    for (var i = 0; i < activeCategory.topics.length; i++) {
        var newButton = $("<button>").text(activeCategory.topics[i]).addClass("btn btn-primary topic").attr("data-search", activeCategory.topics[i]);
        $("#gifbuttons").append(newButton);

    }
}

function createCards(giphyList) {
    for (var i = 0; i < giphyList.data.length; i++) {
        var giphyItem = giphyList.data[i];
        var gifCard = $("<div>").addClass("card gifCard");
        var gifImage = $("<img>").addClass("card-img-top giphyImage").attr({
            "data-gifurl": giphyItem.images.fixed_height_small.url,
            "data-gifstill": giphyItem.images.fixed_height_small_still.url,
            "src": giphyItem.images.fixed_height_small_still.url,
            "alt": "Card image top"
            });
        var gifBody = $("<div>").addClass("card-body");
        var favHTML = '<i class="far fa-star"></i>';
        if (isFavorite(giphyItem))
            favHTML = '<i class="fas fa-star"></i>';
        var favorite = $("<button>").addClass("makeFav").html(favHTML).data("giphy",giphyItem);
        var rating = $("<p>").text("Rating: " + giphyItem.rating.toUpperCase());
        var trendingDate = $("<p>").text("Slug: " + giphyItem.slug);
        var name = $("<p>").html(giphyItem.title).addClass("gifTitle");
        var download = $("<a>").attr({ 
            "href": giphyItem.images.fixed_height_small.url,
            "download": ""
            }).html('&nbsp <i class="fas fa-cloud-download-alt"></i>').css("color","#cccccc");
        name.append(download);
        gifBody.append(favorite, rating, name, trendingDate);
        $("#gifCards").append(gifCard.append(gifImage, gifBody));
    }
}

function displayFavorites() {
    $("#gifbuttons").empty();
    $("#gifCards").empty();
    console.log(favorites);
    createCards(favorites);
    $("#cat" + categories.indexOf(activeCategory)).removeClass("active");
    $("#favTab").addClass("active");
    $("body").css("background-image",'url("./assets/images/bg.jpg")');
}

function isFavorite (giphy) {
    var found = false;
    for (var i = 0; i < favorites.data.length; i++){
        if(giphy.id === favorites.data[i].id) {
            found = true;
            break;
        }
    }
    return found;
}
//////////////////////////////////////////////////////
//
//      AFTER DOC LOADS 
//
$(document).ready( function() { 

    //create category tabs - initial current category is index 0
    createCategoryTabs (0);
    //create topic buttons for current category
    createButtons ();

    //handle event if a topic is clicked
    $(document).on("click",".topic", function () {
        //get the button name from the clicked button
        var buttonName= activeCategory.name + "+" + $(this).data("search");
        //console.log(buttonName);
        //ajax call with queryURL and buttonName using get method
        $.ajax({
            url: queryURLpre + buttonName + queryURLpost,
            method: "GET"
        //after the search returns results, create and display cards    
        }).then(function (response) {
            $("#gifCards").empty();
            createCards(response);
        });
    });

    //handle event if a gif image is clicked 
    $("#gifCards").on("click", ".giphyImage", function () {
        //get data values store on clicked item 
        var source = $(this).attr("src");
        var gifMotion = $(this).data("gifurl");
        var gifStill = $(this).data("gifstill");
        //toggle between still and motion gif
        if(source === gifMotion)
            source = gifStill;
        else
            source = gifMotion; 
        $(this).attr("src",source);
    });

    //handle event if topic button add topic button is clicked
    $("#addTopicButton").on("click", function (e) {
        //stop page refresh
        e.preventDefault();
        //get user input
        var userInput = $("#addTopic").val().trim();
        //if the item is not already listed and the user entered a value
        if ((activeCategory.topics.indexOf(userInput) === -1) && (userInput.length > 0)){
            //add user input to topic array
            activeCategory.topics.push(userInput);
            //create new buttons
            createButtons();
        }
        $("#addTopic").val('');
        
    });

    //event handler for category tabs
    $(document).on("click", ".category",function (e) {
        //if the current tab is clicked do nothing
        var tabName = $(this).attr("data-name");
        var categoryIndex = $(this).attr("data-index");
        if (tabName === activeCategory.name)
            return;
        else if(tabName === "add"){
            //prompt user for a new category name
            var result = prompt("Enter new category name");
            //if the user typed something
            if (result != ""){
                //create a new category object with the entered name and no topics
                var newCategory = {
                    name: result,
                    topics:[]
                };
                //add the new category object to the array of categories
                categories.push(newCategory);
                //create the tabs and make the newly added tab "active"
                createCategoryTabs(categories.length - 1);
                //set the global variable to the new category object
                activeCategory = categories[categories.length - 1];
            }
        }
        else{   
            //remove the "active" class from the current category tab
            $("#cat" + categories.indexOf(activeCategory)).removeClass("active");
            //set the newly clicked tab to the current category
            activeCategory = categories[$(this).attr("data-index")];
            //add the active class to the current category
            $("#cat" + categoryIndex).addClass("active");
            //adjust the background
            var bgImage = 'url("./assets/images/bg';
            switch(categories.indexOf(activeCategory)){
                case 0:
                case 1:
                case 2:
                    bgImage += categories.indexOf(activeCategory);
                    break;
                default:
                    break;    
            }
            bgImage += '.jpg")';
            console.log(bgImage);
            $("body").css("background-image",bgImage);
        }
        //favorite tab inactive
        $("#favTab").removeClass("active");
        //topic changed - create topic buttons for current category
        createButtons();
        //empty the gifs from the previous tab
        $("#gifCards").empty();
    });

    //handle make favorite icon clicked
    $(document).on("click", ".makeFav", function (e) {
        //save card to favorites array
        console.log(this);
        var giphy = $(this).data("giphy");
        //if it's already a favorite, remove from favs list and change star to outline
        if (isFavorite(giphy))
        {
            var index = favorites.data.indexOf(giphy);
            $(this).html('<i class="far fa-star"></i>');
            //remove item from favorites array
            favorites.data.splice(index,1);
        } else {
            favorites.data.push(giphy);
            $(this).html('<i class="fas fa-star"></i>');
        }
    });   
    
    //handle favorite tab clicked
    $(document).on("click", ".favorites", function (e) {
        displayFavorites();
        activeCategory = categoryFavorites;
    });

/////////////////////////////////////////////////////////////
//
//  WEB STORAGE
//

//create variables for storage keys
// store array of category objects
// store array of favorites

    // if (!localStorage.getItem('bgcolor')) {
    //     populateStorage();
    // } else {
    //     setStyles();
    // }

    // function populateStorage() {
    //     localStorage.setItem('bgcolor', document.getElementById('bgcolor').value);
    //     localStorage.setItem('font', document.getElementById('font').value);
    //     localStorage.setItem('image', document.getElementById('image').value);

    //     setStyles();
    // }

    // function setStyles() {
    //     var currentColor = localStorage.getItem('bgcolor');
    //     var currentFont = localStorage.getItem('font');
    //     var currentImage = localStorage.getItem('image');

    //     document.getElementById('bgcolor').value = currentColor;
    //     document.getElementById('font').value = currentFont;
    //     document.getElementById('image').value = currentImage;

    //     htmlElem.style.backgroundColor = '#' + currentColor;
    //     pElem.style.fontFamily = currentFont;
    //     imgElem.setAttribute('src', currentImage);
    // }

    // bgcolorForm.onchange = populateStorage;
    // fontForm.onchange = populateStorage;
    // imageForm.onchange = populateStorage;

});