var database = [];
var database_TYPES = [ "Anime", "Film", "Manhwa", "Manga", "OVA", "Special" ].sort();
var database_TAGS = [ "Demonios", "Deportes", "Multi-Season", "Isekai", "Comedia", "Fantasia", "Escolares", "Romance", "Shounen", "Ecchi", "Aventuras", "Accion", "Sobrenatural", "Yaoi", "Yuri", "Drama", "Ciencia Ficcion", "Superpoderes", "Harem", "Comida"].sort()
var searchByNameOnly = false;
var userFavorites = [];
var userToSee = [];
var userSeen = [];
var userSeeing = [];

var search_tags = [];
var search_tag_mode = "some";
var search_type = [];
var search_favorites = false;
var search_toSee = false;
var search_seeing = false;
var search_seen = false;
$(document).ready(function() {
    $.getJSON('./assets/database.json', function(data) {
        
        data.sort(function(a, b) {
            return a["title"].localeCompare(b["title"]);
        });
        database = data.slice();
        for(const tag in database_TAGS) {
            document.getElementById("searchTags").getElementsByTagName(`div`)[1].innerHTML += `<button name="tag-${database_TAGS[tag].toLowerCase().replaceAll(' ','-')}" class="inactive-tag" onclick="changeFilter(this)">${database_TAGS[tag]}</button>`;
        }
        for(const type in database_TYPES) {
            document.getElementById("searchTags").getElementsByTagName(`div`)[0].innerHTML += `<button name="type-${database_TYPES[type].toLowerCase().replaceAll(' ','-')}" class="inactive-type" onclick="changeFilter(this)">${database_TYPES[type]}</button>`;
        }
        
        document.getElementById(`searchByName`).setAttribute("placeholder", `Busca entre ${database.length-1} animes...`);
        var showAlert = false;
        var news = ``
        if (!window.localStorage.getItem("lastAnimeCount")) { window.localStorage.setItem("lastAnimeCount", 0); } 
        if (!window.localStorage.getItem("lastTagsCount"))  { window.localStorage.setItem("lastTagsCount",  0); }
        if (!window.localStorage.getItem("lastTypesCount")) { window.localStorage.setItem("lastTypesCount", 0); }
        if (!window.localStorage.getItem("userFavorites"))  { window.localStorage.setItem("userFavorites", "[]"); }
        if (!window.localStorage.getItem("userToSee"))      { window.localStorage.setItem("userToSee", "[]"); }
        if (!window.localStorage.getItem("userSeen"))       { window.localStorage.setItem("userSeen", "[]"); }
        if (!window.localStorage.getItem("userSeeing"))     { window.localStorage.setItem("userSeeing", "[]"); }
        userFavorites = JSON.parse(window.localStorage.getItem("userFavorites"));
        userToSee = JSON.parse(window.localStorage.getItem("userToSee"));
        userSeeing = JSON.parse(window.localStorage.getItem("userSeeing"));
        userSeen = JSON.parse(window.localStorage.getItem("userSeen"));
        if(window.localStorage.getItem("lastAnimeCount") != database.length-1){
            var amount = database.length-1-window.localStorage.getItem("lastAnimeCount");
                 if (amount ==  1) { news += `<li>Hemos añadido ${Math.abs(amount)} anime en nuestra base de datos</li>`;}
            else if (amount >   1) { news += `<li>Hemos añadido ${Math.abs(amount)} animes en nuestra base de datos</li>`;}
            else if (amount == -1) { news += `<li>Hemos eliminado ${Math.abs(amount)} anime de nuestra base de datos</li>`;}
            else if (amount <   1) { news += `<li>Hemos eliminado ${Math.abs(amount)} animes de nuestra base de datos</li>`;}
            showAlert = true;
            window.localStorage.setItem("lastAnimeCount", database.length-1);
        }
        if(window.localStorage.getItem("lastTagsCount") != database_TAGS.length){
            var amount = database_TAGS.length-window.localStorage.getItem("lastTagsCount");
            if (amount ==  1) { news += `<li>Hemos añadido ${Math.abs(amount)} etiqueta en nuestro filtro</li>`;}
            else if (amount >   1) { news += `<li>Hemos añadido ${Math.abs(amount)} etiquetas en nuestro filtro</li>`;}
            else if (amount == -1) { news += `<li>Hemos eliminado ${Math.abs(amount)} etiqueta de nuestro filtro</li>`;}
            else if (amount <   1) { news += `<li>Hemos eliminado ${Math.abs(amount)} etiquetas de nuestro filtro</li>`;}
            showAlert = true;
            window.localStorage.setItem("lastTagsCount", database_TAGS.length);
        }
        if(window.localStorage.getItem("lastTypesCount") != database_TYPES.length){
            var amount = database_TYPES.length-window.localStorage.getItem("lastTypesCount");
            if (amount ==  1) { news += `<li>Hemos añadido ${Math.abs(amount)} tipo en nuestro filtro</li>`;}
            else if (amount >   1) { news += `<li>Hemos añadido ${Math.abs(amount)} tipos en nuestro filtro</li>`;}
            else if (amount == -1) { news += `<li>Hemos eliminado ${Math.abs(amount)} tipo de nuestro filtro</li>`;}
            else if (amount <   1) { news += `<li>Hemos eliminado ${Math.abs(amount)} tipos de nuestro filtro</li>`;}
            showAlert = true;
            window.localStorage.setItem("lastTypesCount", database_TYPES.length);
        }
        if(showAlert){
            document.getElementById(`news-contain`).innerHTML += news;
            document.getElementById(`alert-page`).style.display = "flex";
        }
        FindByName("")
    })
});
function removeFavorite(id) {
    userFavorites.splice(userFavorites.indexOf(id), 1);
    window.localStorage.setItem("userFavorites", JSON.stringify(userFavorites))
    var element = document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("itemTitle")[0]
    element.getElementsByClassName("favorite")[0].setAttribute("onclick", `addFavorite(${id})`);
    element.getElementsByClassName("favorite")[0].classList.add("unfavorite");
    element.getElementsByClassName("favorite")[0].classList.remove("favorite");
    element.classList.add('unfavorite');
    element.classList.remove('favorite');
    if(search_favorites){
        document.getElementById(`ID${id}_item`).remove();
    }
}
function addFavorite(id){
    userFavorites.push(id);
    window.localStorage.setItem("userFavorites", JSON.stringify(userFavorites))
    var element = document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("itemTitle")[0]
    element.getElementsByClassName("unfavorite")[0].setAttribute("onclick", `removeFavorite(${id})`);
    element.getElementsByClassName("unfavorite")[0].classList.add("favorite");
    element.getElementsByClassName("unfavorite")[0].classList.remove("unfavorite");
    element.classList.add('favorite');
    element.classList.remove('unfavorite');
}
function alternameFilterOptions(){
    if(document.getElementById(`searchTags`).style.display === "none"){
        document.getElementById(`searchTags`).style.display = "";
    }else{
        document.getElementById(`searchTags`).style.display = "none";
    }
}
function random(min,max){
    return Math.floor(Math.random() * max)
}
function getRandom(){
    var random = database[Math.floor(Math.random() * database.length)];
    if(random["id"] === null ){ random = database[1]; console.log("null evitado")}
    document.getElementById(`searchByName`).value = random["title"];
    searchByNameOnly = true;
    FindByName(random["title"])
    searchByNameOnly = false;
}
function go(link){
    if(link != "."){
        window.open(link, '_blank');
    }else{
        window.location = link;
    }
}
function FindTags(item){
    var tagContainer = document.getElementById(`ID${item["id"]}_item`).getElementsByClassName("data")[0].getElementsByClassName("tags")[0];
    var typeActive = search_type.includes(`type-${item["type"].toLowerCase()}`);
    if(!tagContainer.innerText.includes(item["type"])){
        tagContainer.innerHTML += `<button name="type-${item["type"].toLowerCase()}" class='${typeActive ? "active-type": "inactive-type"}' onclick="changeFilter(this)">${item["type"]}</button>`;
    }else{
        if(typeActive){
            tagContainer.querySelector(`button[name='type-${item["type"].toLowerCase()}']`).classList.remove("inactive-type")
            tagContainer.querySelector(`button[name='type-${item["type"].toLowerCase()}']`).classList.add("active-type")
        }else{
            tagContainer.querySelector(`button[name='type-${item["type"].toLowerCase()}']`).classList.remove("active-type")
            tagContainer.querySelector(`button[name='type-${item["type"].toLowerCase()}']`).classList.add("inactive-type")
        }
    }
    for (var tagID in item["tags"]) {
        var tag = item["tags"][tagID];
        var tagActive = search_tags.includes(`tag-${tag.toLowerCase().replaceAll(' ', '-')}`);
        if(!tagContainer.innerText.includes(tag)){
            tagContainer.innerHTML += `<button name="tag-${tag.toLowerCase().replaceAll(' ', '-')}" class='${tagActive ? "active-tag":"inactive-tag" }' onclick="changeFilter(this)">${tag}</button>`;
        }else{
            if(tagActive){
                tagContainer.querySelector(`button[name='tag-${tag.toLowerCase().replaceAll(' ', '-')}']`).classList.remove("inactive-tag")
                tagContainer.querySelector(`button[name='tag-${tag.toLowerCase().replaceAll(' ', '-')}']`).classList.add("active-tag")
            }else{
                tagContainer.querySelector(`button[name='tag-${tag.toLowerCase().replaceAll(' ', '-')}']`).classList.remove("active-tag")
                tagContainer.querySelector(`button[name='tag-${tag.toLowerCase().replaceAll(' ', '-')}']`).classList.add("inactive-tag")
            }
        }
    }
}
function FindUrls(item){
    var urlContainer = document.getElementById(`ID${item["id"]}_item`).getElementsByClassName("data")[0].getElementsByClassName("see-more")[0];
    for (var linkID in item["links"]) {
        var link = item["links"][linkID];
        var url = link["url"];
        var source = link["source"];
        urlContainer.innerHTML += `<button class="normal-tag" onclick="go('${url}')">${source}</button>`;
    }
}
function changeFilter(button) {
    if(button.getAttribute("class") === "active-account-tag"){
        button.classList.remove("active-account-tag");
        button.classList.add("inactive-account-tag");
        document.getElementById("searchTags").querySelector(`button[name='account-tag-${button.innerText.toLowerCase().replaceAll(' ', '-')}']`).classList.add("inactive-account-tag");
        document.getElementById("searchTags").querySelector(`button[name='account-tag-${button.innerText.toLowerCase().replaceAll(' ', '-')}']`).classList.remove("active-account-tag");
        if(button.getAttribute("name") === "account-tag-favoritos") { search_favorites = false; }
        if(button.getAttribute("name") === "account-tag-por-ver") { search_toSee = false; }
        if(button.getAttribute("name") === "account-tag-viendo") { search_seeing = false; }
        if(button.getAttribute("name") === "account-tag-visto") { search_seen = false; }
    }else if(button.getAttribute("class") === "inactive-account-tag"){
        button.classList.remove("inactive-account-tag");
        button.classList.add("active-account-tag");
        document.getElementById("searchTags").querySelector(`button[name='account-tag-${button.innerText.toLowerCase().replaceAll(' ', '-')}']`).classList.add("active-account-tag");
        document.getElementById("searchTags").querySelector(`button[name='account-tag-${button.innerText.toLowerCase().replaceAll(' ', '-')}']`).classList.remove("inactive-account-tag");
        if(button.getAttribute("name") === "account-tag-favoritos") { search_favorites = true; }
        if(button.getAttribute("name") === "account-tag-por-ver") { 
            search_toSee = true; 
            search_seen = false;
            document.getElementById("searchTags").querySelector(`button[name='account-tag-visto']`).classList.remove("active-account-tag");    
            document.getElementById("searchTags").querySelector(`button[name='account-tag-visto']`).classList.add("inactive-account-tag");
            search_seeing = false;
            document.getElementById("searchTags").querySelector(`button[name='account-tag-viendo']`).classList.remove("active-account-tag");    
            document.getElementById("searchTags").querySelector(`button[name='account-tag-viendo']`).classList.add("inactive-account-tag");
        }
        if(button.getAttribute("name") === "account-tag-viendo") {
            search_toSee = false;
            document.getElementById("searchTags").querySelector(`button[name='account-tag-por-ver']`).classList.remove("active-account-tag");    
            document.getElementById("searchTags").querySelector(`button[name='account-tag-por-ver']`).classList.add("inactive-account-tag");
            search_seen = false;
            document.getElementById("searchTags").querySelector(`button[name='account-tag-visto']`).classList.remove("active-account-tag");    
            document.getElementById("searchTags").querySelector(`button[name='account-tag-visto']`).classList.add("inactive-account-tag");
            search_seeing = true;
        }
        if(button.getAttribute("name") === "account-tag-visto") {
            search_toSee = false;
            document.getElementById("searchTags").querySelector(`button[name='account-tag-por-ver']`).classList.remove("active-account-tag");    
            document.getElementById("searchTags").querySelector(`button[name='account-tag-por-ver']`).classList.add("inactive-account-tag");
            search_seen = true;
            search_seeing = false;
            document.getElementById("searchTags").querySelector(`button[name='account-tag-viendo']`).classList.remove("active-account-tag");    
            document.getElementById("searchTags").querySelector(`button[name='account-tag-viendo']`).classList.add("inactive-account-tag");
        }
    }else if(button.getAttribute("class") === "tag-mode-all"){
        button.classList.remove("tag-mode-all");
        button.classList.add("tag-mode-some");
        button.innerText = "Modo limitado";
        search_tag_mode = "some";
    }else if(button.getAttribute("class") === "tag-mode-some"){
        button.classList.remove("tag-mode-some");
        button.classList.add("tag-mode-all");
        button.innerText = "Modo completo";
        search_tag_mode = "all";
    }else if(button.getAttribute("class") === "active-tag"){
        button.classList.remove("active-tag");
        button.classList.add("inactive-tag");
        document.getElementById("searchTags").querySelector(`button[name='tag-${button.innerText.toLowerCase().replaceAll(' ', '-')}']`).classList.remove("active-tag");
        document.getElementById("searchTags").querySelector(`button[name='tag-${button.innerText.toLowerCase().replaceAll(' ', '-')}']`).classList.add("inactive-tag");
        search_tags.splice(search_tags.indexOf(button.getAttribute("name")),1);
    }else if(button.getAttribute("class") === "inactive-tag"){
        button.classList.remove("inactive-tag");
        button.classList.add("active-tag");
        document.getElementById("searchTags").querySelector(`button[name='tag-${button.innerText.toLowerCase().replaceAll(' ', '-')}']`).classList.remove("inactive-tag");
        document.getElementById("searchTags").querySelector(`button[name='tag-${button.innerText.toLowerCase().replaceAll(' ', '-')}']`).classList.add("active-tag");
        search_tags.push(button.getAttribute("name"));
    }else if(button.getAttribute("class") === "active-type"){
        button.classList.remove("active-type");
        button.classList.add("inactive-type");
        document.getElementById("searchTags").querySelector(`button[name='type-${button.innerText.toLowerCase()}']`).classList.remove("active-type");
        document.getElementById("searchTags").querySelector(`button[name='type-${button.innerText.toLowerCase()}']`).classList.add("inactive-type");
        search_type.splice(search_type.indexOf(button.getAttribute("name")),1);
    }else if(button.getAttribute("class") === "inactive-type"){
        button.classList.remove("inactive-type");
        button.classList.add("active-type");
        document.getElementById("searchTags").querySelector(`button[name='type-${button.innerText.toLowerCase()}']`).classList.remove("inactive-type");
        document.getElementById("searchTags").querySelector(`button[name='type-${button.innerText.toLowerCase()}']`).classList.add("active-type");
        search_type.push(button.getAttribute("name"));
    }
    FindByName(document.getElementById("searchByName").value)
}
function FindByName(name){
    document.getElementById(`searchByName`).value = name;
    name = name.toLowerCase().split(" ").filter(function(segment) {return segment !== "";}).join(" ");
    for (var itemID in database) {        
        var item = database[itemID];
        if ( item["id"] != null ) {  
            var titles = [item["title"]].concat(Object.values(item["alternativeTitles"]));
            for (var title in titles) {
                var key = titles[title].toLowerCase();
                var includeTag = false;
                var includeType = search_type.includes(`type-${item["type"].toLowerCase().replaceAll(' ', '-')}`);
                var isFavorite =  userFavorites.includes(item["id"]);
                var isToSee = userToSee.includes(item["id"]);
                var isSeeing = userSeeing.includes(item["id"]);
                var isSeen = userSeen.includes(item["id"]);
                if(search_tag_mode === "all"){
                    includeTag = search_tags.every(function(tag) { return item["tags"].some(function(itemTag) { return itemTag.toLowerCase() === tag.split("tag-")[1].toLowerCase().replaceAll('-', ' '); }); });
                }else{
                    includeTag = item["tags"].some(function(tag) { return search_tags.includes(`tag-${tag.toLowerCase().replaceAll(' ', '-')}`); });
                }
                if (
                    key.includes(name) && 
                    (searchByNameOnly || (
                        (search_type.length == 0 || includeType) && 
                        (search_tags.length == 0 || includeTag) &&
                        (!search_favorites || (search_favorites && isFavorite)) &&
                        (!search_toSee || (search_toSee && isToSee )) &&
                        (!search_seeing || (search_seeing && isSeeing )) &&
                        (!search_seen || (search_seen && isSeen ))
                    ))
                ) {
                    if(name != " "  && name != ''){ key = key.replaceAll(name, `<mark>${name}</mark>`); }
                    var seeClass = null;
                    var seeFunction = null;
                    if (userToSee.includes(item["id"]))  { seeClass = "to-see"; seeFunction = `addSeeing(${item["id"]})`; }
                    else if (userSeeing.includes(item["id"])) { seeClass = "seeing"; seeFunction = `addSeen(${item["id"]})`}
                    else if (userSeen.includes(item["id"]))   { seeClass = "seen"; seeFunction = `removeSeen(${item["id"]})`}
                    else { seeClass = "un-see"; seeFunction = `addToSee(${item["id"]})`}
                    var favoriteClass = userFavorites.includes(item["id"]) ? `favorite`: `unfavorite`;
                    var favoriteFunction = favoriteClass == "favorite" ? `removeFavorite(${item["id"]})`: `addFavorite(${item["id"]})`;
                    var div = `
                        <div name="${item["title"]}" id="ID${item["id"]}_item" class="item">
                            <img src="./assets/images/ID${item["id"]}.png" onclick="showImage(this.src)">
                            <div class="data">
                                <p class="itemTitle ${favoriteClass}">
                                    <span>${item["title"]}</span>
                                    <button class="${seeClass}" onclick='${seeFunction}'></button>
                                    <button class="${favoriteClass}" onclick='${favoriteFunction}'></button>
                                </p>
                                <div class="tags"><p>Tags: </p></div>
                                <!--<p class="itemSubTitle">Alternative Titles</p>-->
                                <!--<div class="alternativeTitles"></div>-->
                                <p class="itemSubTitle">Sources</p>
                                <div class="see-more"></div>
                            </div>
                        </div>
                    `;
                    if(!document.getElementById(`ID${item["id"]}_item`)){
                        document.getElementById("container").innerHTML += div;
                        FindUrls(item);
                        FindTags(item);
                        break;
                    }else{
                        FindTags(item);
                    }
                    document.getElementById(`ID${item["id"]}_item`).removeAttribute('style');
                }else if(document.getElementById(`ID${item["id"]}_item`)) {
                    document.getElementById(`ID${item["id"]}_item`).style.display = 'none';
                }
            }
        }
    }
}
function addToSee(id){
    userToSee.push(id);
    window.localStorage.setItem("userToSee", JSON.stringify(userToSee))
    var element = document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("itemTitle")[0]
    element.getElementsByClassName("un-see")[0].setAttribute("onclick", `addSeeing(${id})`);
    element.getElementsByClassName("un-see")[0].classList.add("to-see");
    element.getElementsByClassName("un-see")[0].classList.remove("un-see");
    
}
function addSeeing(id){
    userToSee.splice(userToSee.indexOf(id), 1);
    window.localStorage.setItem("userToSee", JSON.stringify(userToSee))
    userSeeing.push(id);
    window.localStorage.setItem("userSeeing", JSON.stringify(userSeeing))
    var element = document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("itemTitle")[0]
    element.getElementsByClassName("to-see")[0].setAttribute("onclick", `addSeen(${id})`);
    element.getElementsByClassName("to-see")[0].classList.add("seeing");
    element.getElementsByClassName("to-see")[0].classList.remove("to-see");
    if(search_toSee){
        document.getElementById(`ID${id}_item`).remove();
    }
}
function addSeen(id){
    userSeeing.splice(userSeeing.indexOf(id), 1);
    window.localStorage.setItem("userSeeing", JSON.stringify(userSeeing))
    userSeen.push(id);
    window.localStorage.setItem("userSeen", JSON.stringify(userSeen))
    var element = document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("itemTitle")[0]
    element.getElementsByClassName("seeing")[0].setAttribute("onclick", `removeSeen(${id})`);
    element.getElementsByClassName("seeing")[0].classList.add("seen");
    element.getElementsByClassName("seeing")[0].classList.remove("seeing");
    if(search_seeing){
        document.getElementById(`ID${id}_item`).remove();
    }
}
function removeSeen(id){
    userSeen.splice(userSeeing.indexOf(id), 1);
    window.localStorage.setItem("userSeen", JSON.stringify(userSeen))
    var element = document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("itemTitle")[0]
    element.getElementsByClassName("seen")[0].setAttribute("onclick", `addToSee(${id})`);
    element.getElementsByClassName("seen")[0].classList.add("un-see");
    element.getElementsByClassName("seen")[0].classList.remove("seen");
    if(search_seen){
        document.getElementById(`ID${id}_item`).remove();
    }
}
function showImage(src){
    document.getElementById("img-page").getElementsByClassName("img")[0].style.backgroundImage = `url('${src}')`;
    document.getElementById("img-page").style.display = "flex";
}