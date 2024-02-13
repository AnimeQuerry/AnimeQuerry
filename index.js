var database = null;
$(document).ready(function() {
    $.getJSON('index.json', function(data) {
        database = data;
    })
});
console.log(database);
var idDatabase = database.idDatabase;
var nameDatabase = database.nameDatabase;
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
    for (var realKey in nameDatabase) {
        var id = nameDatabase[realKey];
        var key = realKey.toLowerCase();
        if(key.includes(name)){
            var li = `<li onclick='alternateLinksDisplay(${id})'>${FindAssignedName(id)}</li>`;
            if(!document.getElementById("suggested").innerText.includes(FindAssignedName(id))){
                document.getElementById("suggested").innerHTML += li;
                FindUrls(id);
            }
        }
    }
}