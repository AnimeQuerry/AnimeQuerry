var database = null;
$(document).ready(function() {
    $.getJSON('./assets/database.json', function(data) {
        database = data;
        print()
    })
});
function print(){
    console.log(database);
}
function FindAssignedName(id){
    return idDatabase[id][0];
}
function FindUrls(id){
    if (id == -1) {
        document.getElementById("commentary").innerText = ``;
        document.getElementById("list").innerHTML = "";
    } else {
        document.getElementById("commentary").innerText = ``;
        var list = ``;
        for (var linkID in idDatabase[id]) {
            if (linkID != 0) {
                var link = idDatabase[id][linkID];
                list += `<li><a href="${link.split(": ")[1]}">${link.split(": ")[0]}</a></li>`
            }
        }
        document.getElementById("suggested").innerHTML += `<ul id='ID${id}_links' class='links' style='display:none'">${list}</ul>`;
    }
}

function alternateLinksDisplay(id){
    if(document.getElementById(`ID${id}_links`).style.display == "none"){
        document.getElementById(`ID${id}_links`).style.display = "block";
    }else{
        document.getElementById(`ID${id}_links`).style.display = "none";
    }
}

function FindByName(name){
    document.getElementById("suggested").innerHTML = ``;
    if (name === '') { return; }
    name = name.toLowerCase();
    
    var splits = name.split(" ").filter(function(segment) {return segment !== "";});
    name = splits.join(" ");
    for (var itemID in database) {
        var item = database[itemID]
        var id = item["id"]
        var titles = []
        var titleID = 0;
        titles[titleID] = item["title"]
        for (var title in item["alternativeTitles"]) {
            titleID++;
            titles[titleID] = item["alternativeTitles"][title];
        }
        for (var title in item["alternativeTitles"]) {
            var key = title.toLowerCase();
            if(key.includes(name)){
                var li = `<li onclick='alternateLinksDisplay(${id})'>${item["title"]}</li>`;
                if(!document.getElementById("suggested").innerText.includes(item["title"])){
                    document.getElementById("suggested").innerHTML += li;
                    FindUrls(id);
                }
            }
        }
    }
}