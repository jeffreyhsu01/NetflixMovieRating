function findName(){
    var broad = document.querySelectorAll('.previewModal--player-titleTreatment-logo');
    if (broad != undefined || broad[0]!=undefined){
        try{
        var title = broad[0].getAttribute("alt");
        }
        catch(err){
            return;
        }
    }
    else{
        return;
    }
    getIMDBScore(title);
}


function getIMDBScore(movieshowtitle) {
    var id = '';
    const http = new XMLHttpRequest();
    var url = "https://www.omdbapi.com/?s="+movieshowtitle+"&[yourapikey]";
    http.open("GET", url)
    http.send()
    http.onreadystatechange = (e) => {
        const resText = http.responseText;
        //parse the JSON from OMDB API
        if (resText){
            var json = JSON.parse(resText);
            const movies_or_shows = json ? json["Search"] : undefined;
            const title = movies_or_shows ? movies_or_shows[0] : undefined;
            
            if(title){
                id = title.imdbID;
                var url2 = "https://www.omdbapi.com/?i="+id+"&[yourapikey]";
                http.open("GET", url2)
                http.send()
                http.onreadystatechange = (e) => {
                    const resText2 = http.responseText;
                    if(resText2) {
                        data = JSON.parse(resText2)
                        addDiv(id, data.imdbRating, data.imdbVotes);
                    }
                }
            }
        }
    }
}

function addDiv(id, rating, num_votes) {
    var div = document.createElement('div');
    var synopsies = document.querySelectorAll('.previewModal--detailsMetadata-right');
    var synopsis = synopsies[0];
    div.className = 'imdbRating';
    div.innerHTML = 'Rating: ' + rating + ' votes: ' + num_votes;
    div.id = id;
    if (!document.getElementById(id)&&synopsis != undefined){
         synopsis.appendChild(div);
    }
}

if (window.sessionStorage != "undefined") {
    var target = document.body;
    //create an observer instance
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            
            findName();
            
        });
    });
    
    //configuration of the observer:
    var config = {
        attributes: true,
        childList: true,
        characterData: true
    };
    observer.observe(target, config);
    

}