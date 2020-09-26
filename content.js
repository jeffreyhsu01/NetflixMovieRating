alert('gr')
function fetch() {
    var movie_show = document.querySelectorAll('.fallback-text-container .fallback-text');


}
function check(){
    var check = document.querySelectorAll('.fallback-text-container .fallback-text');
    if(check === null)
        return;
}


function getIMDBScore(movieshowtitle) {
    var id = '';
    const http = new XMLHttpRequest();
    var url = "https://www.omdbapi.com/?s=${movieshowtitle}&apikey=59781fea";
    http.open("GET", url);
    http.send();
    http.onreadystatechange = (e) => {
        const resText = http.responseText;
        
        //parse the JSON from OMDB API
        if (resText){
            var json = JSON.parse(resText);
            const movies_or_shows = json ? json["Search"] : undefined;
            const title = movies_or_shows ? movies_or_shows[0] : undefined;
            
            if(title){
                id = title.imdbID;
                var url2 = "https://www.omdbapi.com/?i=${id}&apikey=59781fea";
                http.open("GET", url2)
                http.send()
                http.onreadystatechange = (e) => {
                    const resText2 = http.resText;
                    if(resText2) {
                        json = JSON.parse(resText2);
                        addDiv(json, json.Title, json.year);
                    }
                }
            }
        }
    }
}

function addIMDBRating(imdbMetaData, name, year) {
    var divId = getDivId(name, year);

    var divEl = document.getElementById(divId);
    if (divEl && (divEl.offsetWidth || divEl.offsetHeight || divEl.getClientRects().length)) {
        return;
    }

    var synopsises = document.querySelectorAll('.jawBone .synopsis');
    if (synopsises.length) {
        var synopsis = synopsises[synopsises.length - 1];
        var div = document.createElement('div');

        var imdbRatingPresent = imdbMetaData && (imdbMetaData !== 'undefined') && (imdbMetaData !== "N/A");
        var imdbVoteCount = null;
        var imdbRating = null;
        var imdbId = null;
        if (imdbRatingPresent) {
            var imdbMetaDataArr = imdbMetaData.split(":");
            imdbRating = imdbMetaDataArr[0];
            imdbVoteCount = imdbMetaDataArr[1];
            imdbId = imdbMetaDataArr[2];
        }
        var imdbHtml = 'IMDb rating : ' + (imdbRatingPresent ? imdbRating : "N/A") + (imdbVoteCount ? ", Vote Count : " + imdbVoteCount : "");

        if (imdbId !== null) {
            imdbHtml = "<a target='_blank' href='https://www.imdb.com/title/" + imdbId + "'>" + imdbHtml + "</a>";
        }

        div.innerHTML = imdbHtml;
        div.className = 'imdbRating';
        div.id = divId;
        synopsis.parentNode.insertBefore(div, synopsis);
    }
}

//const movie_show = document.querySelectorAll('.fallback-text-container .fallback-text');

////movie_show.forEach(function(outerText){

// console.log(outerText);
// getIMDBScore(outerText)
// });

if (window.sessionStorage !== "undefined") {
    var target = document.body;
    // create an observer instance
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            const movie_show = document.querySelectorAll('.fallback-text-container .fallback-text');
            movie_show.forEach(function(outerText){
                console.log(outerText);
                window.setTimeout(getIMDBScore(outerText), 5);
                });
        });
    });
    // configuration of the observer:
    var config = {
        attributes: true,
        childList: true,
        characterData: true
    };
    observer.observe(target, config);
}