var items = ["rose", "orchid", "petunia", "lilly", "daisy", "geranium", "tulip", "bluebonnet", "lilac", "violet"];

function createButtons () {
    for (var i = 0; i<items.length; i++){
        var newButton = $("<button>").text(items[i]).addClass("btn btn-primary").css({"margin":"10px","width": "100px"});
        $("#buttons").append(newButton);

    }
}

createButtons();