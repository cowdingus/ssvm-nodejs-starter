// Note: Caution: all None async functions will block the app proccess if some errors occured.
// I know this :D. will be improved later.
// I'm new in JS and RUST, and the deadline is this day so sorry if any errors happens.

function insertNoteClient(noteElement)
{
	document.getElementById("notes").appendChild(noteElement);
}

function insertNoteServer(title, content) {
	var xhttp = new XMLHttpRequest();
	
	var insertionStatus = false;

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			insertionStatus = true;
		} else if (this.readyState == 4 && this.status != 200) {
			alert("An error occured when trying to insert a note to the server");
			insertionStatus = false;
		}
	};

	if (title != "") {
		xhttp.open("POST", "NoteUrDay/write_note", false);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("title="+encodeURIComponent(title)+"&content="+encodeURIComponent(content));
	}

	return insertionStatus;
}

function insertNote(noteElement)
{
	const title = noteElement.getElementsByClassName("card-title")[0].innerHTML;
	const content = noteElement.getElementsByClassName("card-text")[0].innerHTML;

	if (insertNoteServer(title, content))
		insertNoteClient(noteElement);
}

function removeNoteClient(noteElement)
{
	document.getElementById("notes").removeChild(noteElement);
}

function removeNoteServer(title)
{
	var xhttp = new XMLHttpRequest();

	var deletionStatus = false;

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			deletionStatus = true;
		} else if (this.readyState == 4 && this.status != 200) {
			alert("An error occured when trying to delete a note.");
			deletionStatus = false;
		}
	};
	xhttp.open("POST", "NoteUrDay/delete_note", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("title=" + encodeURIComponent(title));

	return deletionStatus;
}

function removeNote(noteElement)
{
	const title = noteElement.getElementsByClassName("card-title")[0].innerHTML;

	if (removeNoteServer(title))
		removeNoteClient(noteElement);
}

function createNoteElement(title, content)
{
	var noteElement = document.createElement("div");
	noteElement.setAttribute("class", "card note");

	var noteBody = document.createElement("div");
	noteBody.setAttribute("class", "card-body p-3");
	
	noteElement.appendChild(noteBody);

	var noteTitle = document.createElement("h5");
	noteTitle.setAttribute("class", "card-title");

	var noteContent = document.createElement("p");
	noteContent.setAttribute("class", "card-text mb-1");

	var titleNode = document.createTextNode(title);
	var contentNode = document.createTextNode(content);

	noteTitle.appendChild(titleNode);
	noteContent.appendChild(contentNode);

	noteBody.appendChild(noteTitle);
	noteBody.appendChild(noteContent);

	var nodeModContainer = document.createElement("div");
	nodeModContainer.setAttribute("class", "d-flex flex-row-reverse card-modifier note-mod");

	noteBody.appendChild(nodeModContainer);

	var nodeDeleteIcon = document.createElement("span");
	nodeDeleteIcon.setAttribute("class", "fas fa-trash px-1");

	nodeModContainer.appendChild(nodeDeleteIcon);

	var nodeEditIcon = document.createElement("span");
	nodeEditIcon.setAttribute("class", "fas fa-edit px-1");
	
	nodeModContainer.appendChild(nodeEditIcon);

	// Callback for delete icon
	noteElement.getElementsByClassName("note-mod")[0]
		.getElementsByClassName("fa-trash")[0]
		.addEventListener("click", function(){
			removeNote(noteElement);	
		});

	// Callback for edit icon
	noteElement.getElementsByClassName("note-mod")[0]
		.getElementsByClassName("fa-edit")[0]
		.addEventListener("click", function(){
			const assignee = noteElement.getElementsByClassName("card-title")[0].innerHTML;

			setNoteAssignee(assignee);
			showNoteForm();
		});

	return noteElement;
}

function showNoteForm() {
	var noteForm = document.getElementsByClassName("note-form")[0];
	noteForm.style.display = "block";
}

function hideNoteForm() {
	var noteForm = document.getElementsByClassName("note-form")[0];
	noteForm.style.display = "none";
}

function clearNoteForm() {
	document.getElementById("note-form-title").value = "";
	document.getElementById("note-form-content").value = "";
	document.getElementById("previous_title").innerHTML = "";
}

function setNoteAssignee(assignee) {
	document.getElementById("previous_title").innerHTML = assignee;
}

function getNoteAssignee() {
	const previous_title = document.getElementById("previous_title").innerHTML;
	if (previous_title)
		return previous_title;
	else
		return "";
}

function getNoteWithTitle(title) {
	var notes = document.getElementsByClassName("note");
	for (const note of notes) {
		if (note.getElementsByClassName("card-title")[0].title === title)
		{
			return note;
		}
	}
	return;
}

function submitNoteForm() {
	var assignee = getNoteAssignee();

	var newNoteTitle = document.getElementById("note-form-title").value;
	var newNoteContent = document.getElementById("note-form-content").value;

	if (assignee != "")
		removeNote(getNoteWithTitle(assignee));

	let newNode = createNoteElement(newNoteTitle, newNoteContent);
	insertNote(newNode);
}

const newNoteButton = document.getElementById("NewNotePrimary");
newNoteButton.addEventListener("click", function() {
	showNoteForm();	
});
