var topicName = "Flower";
var topics = ["rose", "orchid", "petunia", "lilly", "daisy", "geranium", "tulip", "bluebonnet", "lilac", "violet"];
var buttonName;
var queryURLpre = "https://api.giphy.com/v1/gifs/search?api_key=pzWkzRyZiQFVEaxvVwyOIxLpA3h7ip8w&q=";
var queryURLpost = "&limit=10&offset=0&rating=G&lang=en";

$(document).ready( function() { 

$("gifTopic").text(topicName);

function createButtons () {
    $("#gifbuttons").empty();
    for (var i = 0; i<topics.length; i++){
        var newButton = $("<button>").text(topics[i]).addClass("btn btn-primary topic").attr("data-search", topics[i]);
        $("#gifbuttons").append(newButton);

    }
}

function createCards(giphyList) {
    console.log(giphyList);
    for (var i = 0; i<giphyList.data.length; i++){
        var giphyItem = giphyList.data[i];
        var gifCard = $("<div>").addClass("card gifCard");
        var gifImage = $("<img>").addClass("card-img-top giphyImage").attr({
             "data-gifurl": giphyItem.images.fixed_height_small.url, 
             "data-gifstill": giphyItem.images.fixed_height_small_still.url, 
             "src": giphyItem.images.fixed_height_small_still.url, 
             "alt":"Card image top"
        });
        var gifBody = $("<div>").addClass("card-body");
        var rating = $("<p>").text("Rating: " + giphyItem.rating.toUpperCase());
        var trendingDate = $("<p>").text("Trending: " + Date(giphyItem.trending));
        var name= $("<p>").text(giphyItem.title).addClass("gifTitle");
        gifBody.append(rating, name, trendingDate);
        $("#gifCards").append(gifCard.append(gifImage, gifBody));
    }
}


    
    createButtons ();

    $(document).on("click",".topic", function () {
        buttonName= topicName + "+" + $(this).data("search");
        console.log(buttonName);
        $.ajax({
            url: queryURLpre + buttonName + queryURLpost,
            method: "GET"
        }).then(function (response) {
            $("#gifCards").empty();
            createCards(response);
        });
    });


    $("#gifCards").on("click", ".giphyImage", function () {
        console.log(this);
        var source = $(this).attr("src");
        var gifMotion = $(this).data("gifurl");
        var gifStill = $(this).data("gifstill");
        if(source === gifMotion)
            source = gifStill;
        else
            source = gifMotion; 
        $(this).attr("src",source);
    });

    $("#addTopicButton").on("click", function (e) {
        e.preventDefault();
        var userInput = $("#addTopic").val().trim();
        if((topics.indexOf(userInput) === -1) && (userInput.length > 0)){
            topics.push(userInput);
            createButtons();
        }
        
    });



});