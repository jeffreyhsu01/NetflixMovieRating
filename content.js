function findName(){
    var broad = document.querySelectorAll('.previewModal--player-titleTreatment-logo');
    //const now = new Date().getTime();
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
    var url = "https://www.omdbapi.com/?s="+movieshowtitle+"&apikey=59781fea";
    http.open("GET", url);
    http.send();
    http.onreadystatechange = (e) => {
        const resText = http.responseText;
        //parse the JSON from OMDB API that returns all of the titles with the keyword -- OPTIMIZE THIS
        if (resText){
            var json = JSON.parse(resText);
            const movies_or_shows = json ? json["Search"] : undefined;
            const title = movies_or_shows ? movies_or_shows[0] : undefined;
            
            if(title){
                id = title.imdbID;
                var url2 = "https://www.omdbapi.com/?i="+id+"&apikey=59781fea";
                http.open("GET", url2);
                http.send();
                http.onreadystatechange = (e) => {
                    const resText2 = http.responseText;
                    if(resText2) {//in here check if the json is in the cache. if not then fetch from api and add it in.
                        data = JSON.parse(resText2);
                        addDiv(id, data); // data is the parsed json object
                    }
                }
            }
                
        }
    }
}

// function getIMDBScore(movieshowtitle) {
//     var id = '';
//     const http = new XMLHttpRequest();
//     var url = "https://www.omdbapi.com/?s="+movieshowtitle+"&apikey=59781fea";//could be multiple titles of the same show
//     http.open("GET", url);
//     http.send();
//     http.onreadystatechange = (e) => {
//         const resText = http.responseText;
//         //parse the JSON from OMDB API that returns all of the titles with the keyword -- OPTIMIZE THIS
//         if (resText){
//             var json = JSON.parse(resText);
//             const movies_or_shows = json ? json["Search"] : undefined;
//             const title = movies_or_shows ? movies_or_shows[0] : undefined;
            
//             if(title){//a title is found, we can either request directly from url2 or get from cache
//                 id = title.imdbID;
//                 var url2 = "https://www.omdbapi.com/?i="+id+"&apikey=59781fea";
//                 self.addEventListener("fetch", event => {
//                     if(event.request.url.includes("api")){
                         
//                     }
//                     else{
//                         event.respondWith(caches.match(event.request));
//                         event.waitUntil(update(event.request));
//                     }
//                 });
//                 // http.open("GET", url2);
//                 // http.send();
//                 // http.onreadystatechange = (e) => {
//                 //     const resText2 = http.responseText;
//                 //     if(resText2) {//in here check if the json is in the cache. if not then fetch from api and add it in.
//                 //         data = JSON.parse(resText2);
//                 //         addDiv(id, data); // data is the parsed json object
//                 //     }
//                 // }
//                 res = caches.match(url2);

//             }
                
//         }
//     }
// }

// function update(request){
//     return fetch(request.url).then(
//         response => 
//             cache(request, response) //put response into cache
//                 .then(() => response) // resolve promise with the Response obejct
//     );
// }

//function addDiv(id, rating, num_votes) {
function addDiv(id, data){
    var div = document.createElement('div');
    var synopsies = document.querySelectorAll('.previewModal--detailsMetadata-right');
    var synopsis = synopsies[0];
    div.className = 'imdbRating';
    //div.innerHTML = 'Rating: ' + rating + ' votes: ' + num_votes;
    div.innerHTML = 'Rating : ' + data.imdbRating + ' Votes: ' + data.imdbVotes;
    div.id = id;
    if (!document.getElementById(id)&&synopsis != undefined){
         synopsis.appendChild(div);
    }
}

//the main driver of the extension
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