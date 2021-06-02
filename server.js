
const express = require('express');
const path = require('path');
const fs = require("fs");

let newInfo; // new data to be put into the existied file
let notes; // existed file

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

//function to update the page
function reloadPage() {
    fs.writeFile("db/db.json",JSON.stringify(notes),err => {
            if (err) throw err;
            return true
        }
    )
}

//listenr
app.listen(PORT, () => console.log(`NOTE_TAKER awaits your command on PORT ${PORT}`));


//routes
 //-> read file from db.json
fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) throw err
    notes = JSON.parse(data);
 // ---------------------------------------------------------------------------------------
    // GET method - 'get page', 'get listed item', 'get updated page'
    app.get("/notes", (req, res)=> {
        res.sendFile(path.join(__dirname, "./public/notes.html"))
    });

    app.get("/api/notes", (req, res) => {
        res.json(notes);
    });

    app.get("/api/notes/:id", (req, res) => {
        res.JSON(notes[req.params.id]);
    });
// ---------------------------------------------------------------------------------------

    // GET method - HOME PAGE
     app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, "./public/index.html"));
    });


 // ---------------------------------------------------------------------------------------

    //POST method - 'to create new item and store it in data (JSON file)'
    app.post("/api/notes", (req, res) => {
        newInfo = req.body;
        notes.push(newInfo);
        reloadPage();
        console.log('Database is updated: \n' + newInfo.title + ": " + newInfo.text);
    });

 // ---------------------------------------------------------------------------------------

    // Delete method - 'to remove the selected item from data, and update'
    app.delete("/api/notes/:id", (req, res) => {
        notes.splice(req.params.id, 1);
        reloadPage();
        console.log('Got a DELETE request!')
    })

})
