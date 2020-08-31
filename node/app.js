const mylib = require('../pkg/ssvm_nodejs_starter_lib.js');

const express = require('../pkg/node_modules/express');
const bodyParser = require('../pkg/node_modules/body-parser');

const fs = require('fs');
const path = require('path');

const http = require('http');
const url = require('url');

const hostname = '0.0.0.0';
const port = 3000;

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'www', 'index.html'));
});

app.use(express.static(path.join(__dirname, '..', 'www')));

app.post('/TrianglataCalculata/calculate', (req, res) => {
	var height = parseFloat(req.body.height);
	var base = parseFloat(req.body.base);

	res.send(mylib.calculate_triangle_area(JSON.stringify([height, base])));
});

app.get('/NoteUrDay/list_note', (req, res) => {
	res.send(mylib.get_notes());
});

app.post('/NoteUrDay/list_note', (req, res) => {
	res.send(mylib.get_notes());
});

app.post('/NoteUrDay/write_note', (req, res) => {
	var title = req.body.title;
	var content = req.body.content;

	if (content.length > 2000) {
		res.status(500);
		res.send("You can't insert a note with more than 2000 chars in its content");
		return;
	}

	if (title.length > 40) {
		res.status(500);
		res.send("You can't insert a note with more than 40 chars in its title");
		return;
	}

	mylib.write_note(title, content);
	res.status(200);
	res.send("Success");
});

app.post('/NoteUrDay/delete_note', (req, res) => {
	var title = req.body.title;

	const status = mylib.delete_note(title);
	if (status == "Error") {
		res.status(400);
	} else if (status == "Success") {
		res.status(200);
	} else {
		res.status(500);
	}

	res.send(status);
});

app.post('/NoteUrDay/read_note', (req, res) => {
	var title = req.body.title;

	res.send(mylib.read_note(title));
});

app.get('/NoteUrDay/notes/:title', (req, res) => {
	var title = req.params.title;

	res.send(mylib.read_note(title));
});

app.listen(port, () => {
	console.log(`NoteUrDay app listening at https://${hostname}:${port}/NoteUrDay`);
});
