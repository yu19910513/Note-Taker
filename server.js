
const express = require('express');
const path = require('path');
const fs = require("fs");

let newInfo; // new data to be put into the existied file
let notes; // existed file

const note_taker = express();
const PORT = process.env.PORT || 3000;


note_taker.use(express.urlencoded({extended: true }));
note_taker.use(express.json());
note_taker.use(express.static(__dirname));

//function to update the page
function reloadPage() {
    fs.writeFile("db/db.json",JSON.stringify(notes),err => {
            if (err) throw err;
            return true
        }
    )
}

//listenr
note_taker.listen(PORT, () => console.log(`NOTE_TAKER awaits your command on PORT ${PORT}`));


//routes
 //-> read file from db.json
fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) throw err
    notes = JSON.parse(data);
 // ---------------------------------------------------------------------------------------
    // GET method - 'get page', 'get listed item', 'get updated page'
    note_taker.get("/notes", (ask, ans) => {
        ans.sendFile(path.join(__dirname, "./public/notes.html"))
    });

    note_taker.get("/api/notes", (ask, ans) => {
        ans.json(notes);
    });

    note_taker.get("/api/notes/:id", (ask, ans) => {
        ans.JSON(notes[ask.params.id]);
    });
// ---------------------------------------------------------------------------------------

    // GET method - HOME PAGE
     note_taker.get('/', (ask, ans) => {
        ans.sendFile(path.join(__dirname, "./public/index.html"));
    });


 // ---------------------------------------------------------------------------------------

    //POST method - 'to create new item and store it in data (JSON file)'
    note_taker.post("/api/notes", (ask, ans) => {
        newInfo = ask.body;
        notes.push(newInfo);
        reloadPage();
        console.log('Database is updated: \n' + newInfo.title + ": " + newInfo.text);
    });

 // ---------------------------------------------------------------------------------------

    // Delete method - 'to remove the selected item from data, and update'
    note_taker.delete("/api/notes/:id", (ask, ans) => {
        notes.splice(ask.params.id, 1);
        reloadPage();
        console.log('Got a DELETE request!')
    })

})
