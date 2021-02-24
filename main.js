//function that runs on page load, and restore notes from localStorage
function restoreNote() {
  let notes = localStorage.getItem("taskList");
  if (notes == null) {
    return;
  }
  if (notes == "") {
    return;
  }
  let notesObj = JSON.parse(notes);
  localStorage.clear("taskList");
  for (item of notesObj) {
    let note = createNote(item.text, item.date, item.time);
    showNoteUI(note);
    saveNoteInModel(note);
  }
}

/* when pressing 'add task' function activities check validation, create and shows note and add data note to the localStorage */
function onCreateNewNoteClicked() {
  let checkValidInputs = checkValidation();

  if (checkValidInputs) {
    let taskText = document.getElementById("taskText").value;
    let date = document.getElementById("taskDate").value;
    let time = document.getElementById("taskTime").value;
    let note = createNote(taskText, date, time);
    showNoteUI(note);
    saveNoteInModel(note);
  }
}

function checkValidation() {
  let taskText = isTaskTextValid();
  let date = isTaskDateValid();
  let time = isTaskTimeValid();

  if (taskText && date && time) {
    return true;
  }
  return false;
}

//function checks if text field is empty and if not returns input value
function isTaskTextValid() {
  let taskText = document.getElementById("taskText");
  taskText.style.backgroundColor = "";

  if (taskText.value.trim() == "") {
    taskText.style.backgroundColor = "pink";
    alert("Please add task");
    return false;
  }
  return true;
}

//function checks if date field is empty or the date has passed
function isTaskDateValid() {
  let inputDate = document.getElementById("taskDate");
  inputDate.style.backgroundColor = "";

  if (inputDate.value == "") {
    inputDate.style.backgroundColor = "pink";
    alert("Please add date");
    return false;
  }

  let presentDate = new Date();
  let inputDateCheck = new Date(inputDate.value);
  //reduce the digit to only ten wich give you only the date whithout time
  presentDate = presentDate.toISOString().slice(0, 10);
  inputDateCheck = inputDateCheck.toISOString().slice(0, 10);

  if (inputDateCheck < presentDate) {
    inputDate.style.backgroundColor = "pink";
    alert("Due date has passed");
    return false;
  }
  return true;
}

//function checks if the time value has passed present time
function isTaskTimeValid() {
  let inputTime = document.getElementById("taskTime");
  inputTime.style.backgroundColor = "";

  if (inputTime.value == "") {
    return true;
  }

  let inputDate = document.getElementById("taskDate");
  let inputDateAndTimeCheck = new Date(inputDate.value + " " + inputTime.value);
  let presentDateTime = new Date();

  if (presentDateTime > inputDateAndTimeCheck) {
    inputTime.style.backgroundColor = "pink";
    alert("Due time has passed");
    return false;
  }

  return true;
}

//function that create note when you press on the 'add task' button
function createNote(text, date, time) {
  let noteObj = {
    text: text,
    date: date,
    time: time,
  };
  noteObj = addNoteId(noteObj);
  return noteObj;
}

//function get object and produce note in user intarface
function showNoteUI(noteObj) {
  // let newDivNote = $("</div>");
  $("</div>").appendTo("#allNotes");
  // newDivNote.attr("id", noteObj.id).appendTo("#allNotes");
  // setStyleNote($("#noteObj.id"));
  // createXbutton(newDivNote);
  // createTextNote(newDivNote, noteObj.text);
  // createDateTimeNote(newDivNote, noteObj.date, noteObj.time);
}

function setStyleNote(divNote) {
  divNote.css("background-image", "images/notebg.png");
  divNote.css("height", "250px");
  divNote.css("width", "200px");
  divNote.css("marginLeft", "30px");
  divNote.fadeIn(2000);
}
//   //functions that show and hide X button
//   divNote.onmouseover = function showX() {
//     divNote.firstChild.style.visibility = "visible";
//   };
//   divNote.onmouseout = function hideX() {
//     divNote.firstChild.style.visibility = "hidden";
//   };
// }

// function fadeIn(divNote) {
//   divNote.style.opacity = "0";
//   divNote.style.transition = "all 2s";
//   setTimeout(function () {
//     divNote.style.opacity = "1";
//   }, 0);
// }

//Add X button to new note
function createXbutton(newDivNote) {
  let divX = document.createElement("div");
  divX.style.visibility = "hidden";
  divX.style.height = "20px";
  divX.style.width = "20px";
  divX.style.marginLeft = "80%";
  divX.style.marginTop = "18px";
  divX.style.backgroundImage = "url(images/x.png)";
  divX.style.backgroundSize = "100%";
  divX.onclick = function () {
    removeNote(this);
  };
  newDivNote.prepend(divX);
}

//Add text to new note
function createTextNote(newDivNote, text) {
  let divText = document.createElement("div");
  divText.style.height = "55%";
  divText.style.width = "80%";
  divText.style.overflow = "auto";
  divText.style.marginLeft = "5%";
  divText.style.marginBottom = "13%";
  divText.innerHTML = text;
  newDivNote.append(divText);
}

//Add date and time to new note
function createDateTimeNote(newDivNote, date, time) {
  let divDate = document.createElement("div");
  divDate.style.height = "8%";
  divDate.style.width = "80%";
  divDate.style.marginLeft = "5%";
  divDate.innerHTML = date;
  newDivNote.append(divDate);

  if (time != "") {
    let divTime = document.createElement("div");
    divTime.style.height = "8%";
    divTime.style.width = "80%";
    divTime.style.marginLeft = "5%";
    divTime.innerHTML = time;
    newDivNote.append(divTime);
  }
}

//clear inputs
function onClear() {
  let task = document.getElementById("taskText");
  let date = document.getElementById("taskDate");
  let time = document.getElementById("taskTime");
  task.style.backgroundColor = "";
  date.style.backgroundColor = "";
  time.style.backgroundColor = "";
  time.value = "";
  date.value = "";
  task.value = "";
}

//function revome note when you click on X button
function removeNote(divX) {
  removeNoteFromStorage(divX);
  //remove note UI
  divX.parentNode.remove();
}

function removeNoteFromStorage(divX) {
  let noteId = divX.parentNode.id;
  let indexNote = getIndexNoteInStorage(noteId);
  let taskList = JSON.parse(localStorage.getItem("taskList"));
  taskList.splice(indexNote, 1);
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

//function search index in array with right id
function getIndexNoteInStorage(noteId) {
  let taskList = JSON.parse(localStorage.getItem("taskList"));
  //search index
  for (item in taskList) {
    if (taskList[item].id == noteId) {
      return item;
    }
  }
}

//Add id to each note
function addNoteId(noteObj) {
  let taskList = JSON.parse(localStorage.getItem("taskList"));

  if (taskList == null) {
    noteObj.id = "note1";
    return noteObj;
  }
  if (taskList == "") {
    noteObj.id = "note1";
    return noteObj;
  }
  noteObj.id = "note" + (+getLastNoteIdNumber(taskList) + 1);
  return noteObj;
}

//function take lats note id and slice his number
function getLastNoteIdNumber(taskList) {
  let lastNote = taskList[taskList.length - 1];
  let lastNoteId = lastNote.id;
  let lastNoteIdNumber = lastNoteId.slice(4);
  return lastNoteIdNumber;
}

//function save notes in Storage
function saveNoteInModel(note) {
  let notesArray;
  let taskList = JSON.parse(localStorage.getItem("taskList"));
  if (taskList == null) {
    notesArray = new Array();
  } else {
    notesArray = taskList;
  }
  notesArray.push(note);
  localStorage.setItem("taskList", JSON.stringify(notesArray));
}
