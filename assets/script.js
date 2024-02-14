var database = null;
var database_ASC = null;
var database_DESC = null;
var search_tags = [];
var search_type = [];
var search_tag_mode = "some";
$(document).ready(function() {
    $.getJSON('./assets/database.json', function(data) {
        database = data;
        database_ASC = data.slice();
        database_ASC.sort(function(a, b) { return a.title.localeCompare(b.title); });
        database_DESC = data.slice();
        database_DESC.sort(function(a, b) { return b.title.localeCompare(a.title); });
        document.getElementById(`searchByName`).setAttribute("placeholder", `Busca entre ${database.length-1} animes...`);
        console.log(database);
        FindByName("");
    })
});
function alternameFilterOptions(){
    if(document.getElementById(`searchTags`).style.display === "none"){
        document.getElementById(`searchTags`).style.display = "";
    }else{
        document.getElementById(`searchTags`).style.display = "none";
    }
}
function getRandom(){
    var random = database[Math.floor(Math.random() * database.length)];
    document.getElementById(`searchByName`).value = random["title"]
    FindByName(random["title"])
}
function go(link){
    window.location = link;
}
function FindTags(id){
    for (var typeID in database[id]["types"]) {
        var type = database[id]["types"][typeID];
        if(search_type.includes(`type-${type.toLowerCase()}`)){
            document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("tags")[0].innerHTML += `<button name="type-${type.toLowerCase()}" class='active-type' onclick="changeFilter(this)">${type}</button>`;
        }else{
            document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("tags")[0].innerHTML += `<button name="type-${type.toLowerCase()}" class='inactive-type' onclick="changeFilter(this)">${type}</button>`;
        }
    }
    for (var tagID in database[id]["tags"]) {
        var tag = database[id]["tags"][tagID];
        if(search_tags.includes(`tag-${tag.toLowerCase().replaceAll(' ', '-')}`)){
            document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("tags")[0].innerHTML += `<button name="tag-${tag.toLowerCase().replaceAll(' ', '-')}" class='active-tag' onclick="changeFilter(this)">${tag}</button>`;
        }else{
            document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("tags")[0].innerHTML += `<button name="tag-${tag.toLowerCase().replaceAll(' ', '-')}" class='inactive-tag' onclick="changeFilter(this)">${tag}</button>`;
        }
    }
}
function FindUrls(id){
    for (var linkID in database[id]["links"]) {
        var link = database[id]["links"][linkID];
        document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("see-more")[0].innerHTML += `<button class="normal-tag" onclick="go('${link["url"]}')">${link["source"].replaceAll('(',"<b>").replaceAll(')', "</b>")}</button>`;
    }
}
function changeFilter(button) {
    if(button.getAttribute("class") === "tag-mode-all"){
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
    name = name.toLowerCase();
    
    var splits = name.split(" ").filter(function(segment) {return segment !== "";});
    name = splits.join(" ");
    if (name === '') { 
        name = " "; 
    }
    for (var itemID in database_ASC) {
        var item = database_ASC[itemID]
        var id = item["id"]
        var titles = [item["title"]].concat(Object.values(item["alternativeTitles"]));
        for (var title in titles) {
            var key = titles[title].toLowerCase();
            var includeTag = false;
            var includeType = false;
            if(search_tag_mode === "all"){
                includeTag = search_tags.every(function(tag) {
                    return item["tags"].some(function(itemTag) {
                        return itemTag.toLowerCase() === tag.split("tag-")[1].toLowerCase().replaceAll('-', ' ');
                    });
                });
            }else{
                includeTag = item["tags"].some(function(tag) {
                    return search_tags.includes(`tag-${tag.toLowerCase().replaceAll(' ', '-')}`);
                });
            }
            includeType = item["types"].some(function(type) {
                return search_type.includes(`type-${type.toLowerCase().replaceAll(' ', '-')}`);
            });
            if (
                key.includes(name) && 
                (search_type.length == 0 || includeType) && 
                (search_tags.length == 0 || includeTag)
            ) {
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
                </div>`;
                if(!document.getElementById(`ID${id}_item`)){
                    document.getElementById("container").innerHTML += div;
                    document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0];
                    FindUrls(id);
                    FindTags(id);
                }
                if(document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("alternativeTitles")[0].childElementCount+1 <= 3){
                    document.getElementById(`ID${id}_item`).getElementsByClassName("data")[0].getElementsByClassName("alternativeTitles")[0].innerHTML += `<p class="itemAlternativeTitle">${key}</p>`;
                }
            }
        }
    }
}