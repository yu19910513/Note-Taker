
const express = require('express');
const path = require('path');
const fs = require("fs");

let newInfo; // new data to be put into the existied file
let notes; // existed file

const Note_Taker = express();
const PORT = 4000;


Note_Taker.use(express.urlencoded({extended: true }));
Note_Taker.use(express.json());
Note_Taker.use(express.static(__dirname));

//function to update the page
function reloadPage() {
    fs.writeFile("db/db.json",JSON.stringify(notes),err => {
            if (err) throw err;
            return true
        }
    )
}

//listenr
Note_Taker.listen(PORT, () => console.log(`Note_Taker awaits your command on PORT ${PORT}`));


//routes
 //-> read file from db.json
fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) throw err
    notes = JSON.parse(data);
 // ---------------------------------------------------------------------------------------
    // GET method - 'get page', 'get listed item', 'get updated page'
    Note_Taker.get("/notes", (ask, ans)=> {
        ans.sendFile(path.join(__dirname, "./public/notes.html"))
    });

    Note_Taker.get("/api/notes", (ask, ans) => {
        ans.json(notes);
    });

    Note_Taker.get("/api/notes/:id", (ask, ans) => {
        ans.JSON(notes[ask.params.id]);
    });
// ---------------------------------------------------------------------------------------

    // GET method - HOME PAGE
     Note_Taker.get('*', (ask, ans) => {
        ans.sendFile(path.join(__dirname, "./public/index.html"));
    });


 // ---------------------------------------------------------------------------------------

    //POST method - 'to create new item and store it in data (JSON file)'
    Note_Taker.post("/api/notes", (ask, ans) => {
        newInfo = ask.body;
        notes.push(newInfo);
        reloadPage();
        console.log('Got a POST ask: \n' + newInfo.title + ": " + newInfo.text);
    });

 // ---------------------------------------------------------------------------------------

    // Delete method - 'to remove the selected item from data, and update'
    Note_Taker.delete("/api/notes/:id", (ask, ans) => {
        notes.splice(ask.params.id, 1);
        reloadPage();
        console.log('Got a DELETE ask!')
    })

})
