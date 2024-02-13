var nameDatabase = {
    "BNHA": 1,
    "Boku No Hero Academia": 1,
    "Boku No Hero Academia 1": 1,
    "Boku No Hero Academia 1st Seasson": 1,

    "BNHA2": 2,
    "Boku No Hero Academia 2": 2,
    "Boku No Hero Academia 2nd Seasson": 2,

    "BNHA3": 3,
    "Boku No Hero Academia 3": 3,
    "Boku No Hero Academia 3rd Seasson": 3,
    
    "Akuyaku Reijou Level 99: Watashi wa Ura-Boss desu ga Maou dewa Arimasen": 4,
    "Villainess Level 99: I May Be the Hidden Boss but I'm Not the Demon Lord": 4,
    
    "Isekai de Mofumofu Nadenade suru Tame ni Ganbattemasu": 5,
    "I'm Doing My Best to Make Myself at Home in Another World, Mofunade": 5,

    "": -1
}
var idDatabase = {
    1: [
        "Boku no Hero Academia",
        "AnimeFLV: https://www3.animeflv.net/anime/boku-no-hero-academia-2016"
    ],
    2: [ 
        "Boku no Hero Academia 2nd Seasson",
        "AnimeFLV: https://www3.animeflv.net/anime/boku-no-hero-academia-2nd-season"
    ],
    3: [
        "Boku no Hero Academia 3rd Seasson",
        "AnimeFLV: https://www3.animeflv.net/anime/boku-no-hero-academia-3rd-season"
    ],
    4:[
        "Villainess Level 99: I May Be the Hidden Boss but I'm Not the Demon Lord",
        "AnimeFLV: https://www3.animeflv.net/anime/akuyaku-reijou-level-99-watashi-wa-uraboss-desu-ga-maou-dewa-arimasen"
    ],
    5:[
        "Isekai de Mofumofu Nadenade suru Tame ni Ganbattemasu.",
        "AnimeFLV: https://www3.animeflv.net/anime/isekai-de-mofumofu-nadenade-suru-tame-ni-ganbattemasu"
    ]
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