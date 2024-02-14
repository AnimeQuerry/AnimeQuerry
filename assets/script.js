var database = null;
var database_ASC = null;
var database_DESC = null;
$(document).ready(function() {
    $.getJSON('./assets/database.json', function(data) {
        database = data;
        database_ASC = data.slice();
        database_ASC.sort(function(a, b) { return a.title.localeCompare(b.title); });
        database_DESC = data.slice();
        database_DESC.sort(function(a, b) { return b.title.localeCompare(a.title); });
        document.getElementById(`searchByName`).setAttribute("placeholder", `Busca entre ${database.length} animes...`);
        FindByName(" ")
        console.log(database_ASC)
    })
});
function go(link){
    window.location = link;
}
function print(){
    console.log(database);
}
function FindTags(id){
    document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("tags")[0].innerHTML += `<button>${database[id]["type"]}</button>`;
    for (var tagID in database[id]["tags"]) {
        var tag = database[id]["tags"][tagID];
        document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("tags")[0].innerHTML += `<button>${tag}</button>`;
    }
}
function FindUrls(id){
    for (var linkID in database[id]["links"]) {
        var link = database[id]["links"][linkID];
        document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("see-more")[0].innerHTML += `<button onClick="go('${link["url"]}')">${link["source"]}</button>`;
    }
}

function alternateLinksDisplay(id){
    if(document.getElementById(`ID${id}_links`).style.display == "none"){
        document.getElementById(`ID${id}_links`).style.display = "block";
    }else{
        document.getElementById(`ID${id}_links`).style.display = "none";
    }
}
function changeSearchFilter(){
    window.location += `?type=a`
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var filterType = getParameterByName('type');

function FindByName(name){
    document.getElementById("container").innerHTML = ``;
    name = name.toLowerCase();
    
    var splits = name.split(" ").filter(function(segment) {return segment !== "";});
    name = splits.join(" ");
    if (name === '') { 
        name = " "; 
    }
    console.log(name)
    for (var itemID in database_ASC) {
        var item = database_ASC[itemID]
        if(item["id"] === -1) { return; }
        var id = item["id"]
        var titles = []
        var titleID = 0;
        titles[titleID] = item["title"]
        for (var title in item["alternativeTitles"]) {
            titleID++;
            titles[titleID] = item["alternativeTitles"][title];
        }
        for (var title in titles) {
            var key = titles[title].toLowerCase();
            if(key.includes(name)){
                if(name != " "){ key = key.replaceAll(name, `<mark>${name}</mark>`); }
                var div = `<div id="ID${id}_item" class="item">
                    <img src="./assets/images/ID${id}.png">
                    <div class="data">
                        <p class="itemTitle">${item["title"]}</p>
                        <div class="tags"><p>Tags: </p></div>
                        <p class="itemSubTitle">Alternative Titles</p>
                        <div class="alternativeTitles"></div>
                        <p class="itemSubTitle">Sources</p>
                        <div class="see-more"></div>
                    </div>
                </div>`
                var sub_p = `<p class="itemAlternativeTitle" onclick='alternateLinksDisplay(${id})'>${key}</p>`;
                if(!document.getElementById(`ID${id}_item`)){
                    document.getElementById("container").innerHTML += div;
                    document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0];
                    FindUrls(id);
                    FindTags(id);
                }
                document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("alternativeTitles")[0].innerHTML += `${sub_p}`;
            }
        }
    }
}