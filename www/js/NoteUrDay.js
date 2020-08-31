function insertNote(noteElement)
{
	document.getElementById("notes").appendChild(noteElement);
}

function removeNote(noteElement)
{
	document.getElementById("notes").removeChild(noteElement);
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

	return noteElement;
}

function produceNote(title, content)
{
	let noteElement = createNoteElement(title, content);
	insertNote(noteElement);
	noteElement.getElementsByClassName("note-mod")[0]
		.getElementsByClassName("fa-trash")[0]
		.addEventListener("click", function(){
			const title = noteElement.getElementsByClassName("card-title")[0].innerHTML;
			
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					removeNote(noteElement);	
				}
			};
			xhttp.open("POST", "NoteUrDay/delete_note", true);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("title=" + title);
		});

	noteElement.getElementsByClassName("note-mod")[0]
		.getElementsByClassName("fa-edit")[0]
		.addEventListener("click", function(){
			const assignee = noteElement.getElementsByClassName("card-title")[0].innerHTML;

			setNoteAssignee(assignee);
			showNoteForm();
		});
}

function showNoteForm() {
	var noteForm = document.getElementsByClassName("note-form")[0];
	noteForm.style.display = "block";
}

function hideNoteForm() {
	var noteForm = document.getElementsByClassName("note-form")[0];
	noteForm.style.display = "none";
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

function clearNoteForm() {
	document.getElementById("note-form-title").value = "";
	document.getElementById("note-form-content").value = "";
	document.getElementById("previous_title").innerHTML = "";
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

	var xhttp_for_del = new XMLHttpRequest();

	xhttp_for_del.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200)
		{
			removeNote(getNoteWithTitle(assignee));
		}
	};

	if (assignee != "")
	{
		xhttp_for_del.open("POST", "NoteUrDay/delete_note", true);
		xhttp_for_del.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp_for_del.send("title="+assignee);
	}

	var xhttp_for_insert = new XMLHttpRequest();

	xhttp_for_insert.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200)
		{
			produceNote(newNoteTitle, newNoteContent);
		}
	};

	if (newNoteTitle != "")
	{
		xhttp_for_insert.open("POST", "NoteUrDay/write_note", true);
		xhttp_for_insert.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp_for_insert.send("title="+encodeURIComponent(newNoteTitle)+"&content="+encodeURIComponent(newNoteContent));
	}
}

const newNoteButton = document.getElementById("NewNotePrimary");
newNoteButton.addEventListener("click", function() {
	showNoteForm();	
});



