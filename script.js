
// DIGITAL CLOCK
function updateClock() {
    let now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("en-PH", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });
}

updateClock();
setInterval(updateClock, 1000);


// WEEKLY CLASS SCHEDULE

const classInfo = {
    GE2: { time: "7:30 - 8:30 AM", room: "401" },
    GE1: { time: "8:30 - 9:30 AM", room: "401" },
    GE4: { time: "9:30 - 10:30 AM", room: "401" },
    ITC111: { time: "1:00 - 3:00 AM", room: "405" },
    GE3: { time: "3:00 - 4:00 AM", room: "401" },
    AL111: { time: "7:30 - 9:00 AM", room: "401" },
    PATHFIT1: { time: "10:30 AM - 12:00 PM", room: "New Building" },
    ITC112: { time: "1:00 - 4:00 PM", room: "COMLAB" }
};

const defaultSchedule = {
    Monday: ["GE2", "GE1", "GE4", "ITC111", "GE3"],
    Tuesday: ["AL111", "PATHFIT1", "ITC112"],
    Wednesday: ["GE2", "GE1", "GE4", "ITC111", "GE3"],
    Thursday: ["AL111", "PATHFIT1", "ITC112"],
    Friday: ["GE2", "GE1", "GE4", "ITC111", "GE3"]
};

function loadSchedule() {
    let saved = JSON.parse(localStorage.getItem("mySchedule"));
    let result = {};

    for (let day in defaultSchedule) {
        let subjects = saved && saved[day]
            ? saved[day]
            : defaultSchedule[day];

        result[day] = subjects.map(item => {
            if (typeof item === "string") {
                return {
                    name: item,
                    time: classInfo[item]?.time || "Not set",
                    room: classInfo[item]?.room || "Not set"
                };
            }
            return item;
        });
    }

    return result;
}

let schedule = loadSchedule();
let currentDay = "Monday";

function saveSchedule() {
    localStorage.setItem("mySchedule", JSON.stringify(schedule));
}

function showDay(day) {
    currentDay = day;
    document.getElementById("dayTitle").textContent = day;

    let subjectList = document.getElementById("subjectList");
    subjectList.innerHTML = "";

    schedule[day].forEach((subject, index) => {
        let li = document.createElement("li");

        let details = document.createElement("div");

        details.innerHTML = `
            <strong>${escapeHTML(subject.name)}</strong><br>
            <small>Time: ${escapeHTML(subject.time)}</small><br>
            <small>Room: ${escapeHTML(subject.room)}</small>
        `;

        let editBtn = document.createElement("button");
        editBtn.textContent = "EDIT";
        editBtn.onclick = () => editSubject(index);

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "DELETE";
        deleteBtn.onclick = () => deleteSubject(index);

        li.appendChild(details);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        subjectList.appendChild(li);
    });
}

function addSubject() {
    let input = document.getElementById("subjectInput");
    let name = input.value.trim();

    if (!name) {
        alert("Please enter a subject name!");
        return;
    }

    let time = prompt("Enter class time:");
    if (time === null) return;

    let room = prompt("Enter room:");
    if (room === null) return;

    schedule[currentDay].push({
        name: name,
        time: time,
        room: room
    });

    saveSchedule();
    showDay(currentDay);
    input.value = "";
}

function editSubject(index) {
    let subject = schedule[currentDay][index];

    let newName = prompt("Subject name:", subject.name);
    if (newName === null || newName.trim() === "") return;

    let newTime = prompt("Class time:", subject.time);
    if (newTime === null) return;

    let newRoom = prompt("Room:", subject.room);
    if (newRoom === null) return;

    schedule[currentDay][index] = {
        name: newName.trim(),
        time: newTime.trim(),
        room: newRoom.trim()
    };

    saveSchedule();
    showDay(currentDay);
}

function deleteSubject(index) {
    if (confirm("Are you sure you want to delete this subject?")) {
        schedule[currentDay].splice(index, 1);
        saveSchedule();
        showDay(currentDay);
    }
}

showDay("Monday");


// ASSIGNMENT TRACKER

let assignments = JSON.parse(
    localStorage.getItem("myAssignments")
) || [];

function saveAssignments() {
    localStorage.setItem("myAssignments", JSON.stringify(assignments));
}

function showAssignments() {
    let list = document.getElementById("assignmentList");
    list.innerHTML = "";

    assignments.forEach((item, index) => {
        let li = document.createElement("li");

        let details = document.createElement("div");

        details.innerHTML = `
            <strong>${escapeHTML(item.name)}</strong><br>
            <small>${escapeHTML(item.subject)}</small><br>
            <small>Deadline: ${escapeHTML(item.deadline || "No deadline")}</small><br>
            <small>Status: ${item.completed ? "Completed" : "Pending"}</small>
        `;

        let completeBtn = document.createElement("button");
        completeBtn.textContent = item.completed ? "UNDO" : "DONE";
        completeBtn.onclick = () => completeAssignment(index);

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "DELETE";
        deleteBtn.onclick = () => deleteAssignment(index);

        li.appendChild(details);
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);

        list.appendChild(li);
    });
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function addAssignment() {
    let name = document.getElementById("assignmentName").value.trim();
    let subject = document.getElementById("assignmentSubject").value.trim();
    let deadline = document.getElementById("assignmentDeadline").value;

    if (!name || !subject) {
        alert("Please enter the assignment name and subject!");
        return;
    }

    assignments.push({
        name: name,
        subject: subject,
        deadline: deadline,
        completed: false
    });

    saveAssignments();
    showAssignments();

    document.getElementById("assignmentName").value = "";
    document.getElementById("assignmentSubject").value = "";
    document.getElementById("assignmentDeadline").value = "";
}

function completeAssignment(index) {
    assignments[index].completed = !assignments[index].completed;
    saveAssignments();
    showAssignments();
}

function deleteAssignment(index) {
    if (confirm("Delete this assignment?")) {
        assignments.splice(index, 1);
        saveAssignments();
        showAssignments();
    }
}

showAssignments();
