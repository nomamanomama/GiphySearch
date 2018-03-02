var topics = ["rose", "orchid", "petunia", "lilly", "daisy", "geranium", "tulip", "bluebonnet", "lilac", "violet"];
var buttonName;
var queryURLpre = "https://api.giphy.com/v1/gifs/search?api_key=pzWkzRyZiQFVEaxvVwyOIxLpA3h7ip8w&q=";
var queryURLpost = "&limit=10&offset=0&rating=G&lang=en";

$(document).ready( function() { 


function createButtons (clear) {
    for (var i = 0; i<topics.length; i++){
        var newButton = $("<button>").text(topics[i]).addClass("btn btn-primary topic").attr("data-search", topics[i]);
        if(clear) {
            $("#gifbuttons").empty();
            clear = false;
        }
        $("#gifbuttons").append(newButton);

    }
}

function createCards(giphyList) {
    console.log(giphyList);
    for (var i = 0; i<giphyList.data.length; i++){
        var giphyItem = giphyList.data[i];
        var gifCard = $("<div>").addClass("card gifCard");
        var gifImage = $("<img>").addClass("card-img-top giphyImage").attr({ "data-gifurl": giphyItem.images.fixed_height_small.url, "data-gifstill": giphyItem.images.fixed_height_small_still.url, "src": giphyItem.images.fixed_height_small_still.url, "alt":"Card image top"});
        var gifBody = $("<div>").addClass("card-body").text("Rating: " + giphyItem.rating.toUpperCase()).attr("height", "50px");
        $("#gifCards").append(gifCard.append(gifImage, gifBody));
    }
}


    
    createButtons ();

    $(document).on("click",".topic", function () {
        buttonName="flower+" + $(this).data("search");
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

    $("#addFlowerButton").on("click", function (e) {
        //e.preventDefault();
        buttonName=$("#addFlower").val();
        topics.push(buttonName);
        createButtons(true);
        
    });



});