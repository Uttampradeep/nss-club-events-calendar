const calendar = document.getElementById("calendar");
const monthName = document.getElementById("month-name");
const eventListContainer = document.getElementById("events-container");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const adminOptions = document.getElementById("admin-options");
const addEventOptions = document.getElementById("add-event-options");
const editEventBtn = document.getElementById("edit-event");
const deleteEventBtn = document.getElementById("delete-event");
const addEventBtn = document.getElementById("add-event");

let currentMonth = new Date().getMonth(); // Start from current month
let events = JSON.parse(localStorage.getItem('events')) || {}; // Retrieve events from Local Storage

const ADMIN_PASSWORD = "admin123";

// Generates the calendar for the given month
function generateCalendar(month) {
    calendar.innerHTML = "";
    monthName.textContent = new Date(2024, month).toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(2024, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const key = `${day}-${month}`;
        calendar.innerHTML += `
            <div class="day" onclick="showModal(${day}, ${month})">
                ${day}
                ${events[key] ? `<div class="event">${events[key].title}</div>` : ""}
            </div>
        `;
    }
    updateEventList(month);
}

// Displays event details in the modal
function showModal(day, month) {
    const key = `${day}-${month}`;
    const event = events[key];

    modalTitle.textContent = event ? event.title : "No Event";
    modalDescription.textContent = event ? event.description : "No description available";
    modal.style.display = "flex";

    if (event) {
        const password = prompt("Enter Admin Password to Edit/Delete Event:");
        if (password === ADMIN_PASSWORD) {
            adminOptions.style.display = "block";
            addEventOptions.style.display = "none";
            editEventBtn.onclick = () => editEvent(key);
            deleteEventBtn.onclick = () => deleteEvent(key);
        } else {
            adminOptions.style.display = "none";
            addEventOptions.style.display = "none";
        }
    } else {
        adminOptions.style.display = "none";
        addEventOptions.style.display = "block";
        addEventBtn.onclick = () => addEvent(key);
    }
}

// Adds an event to the selected date
function addEvent(key) {
    const password = prompt("Enter Admin Password to Add Event:");
    if (password === ADMIN_PASSWORD) {
        const title = prompt("Enter Event Title:");
        const description = prompt("Enter Event Description:");
        if (title && description) {
            events[key] = { title, description };
            localStorage.setItem('events', JSON.stringify(events)); // Save events to Local Storage
            alert("Event added successfully!");
            modal.style.display = "none";
            generateCalendar(currentMonth);
        }
    } else {
        alert("Incorrect Admin Password.");
    }
}

// Edits an event
function editEvent(key) {
    const title = prompt("Edit Event Title:", events[key].title);
    const description = prompt("Edit Event Description:", events[key].description);
    if (title && description) {
        events[key] = { title, description };
        localStorage.setItem('events', JSON.stringify(events)); // Save events to Local Storage
        alert("Event updated successfully!");
        modal.style.display = "none";
        generateCalendar(currentMonth);
    }
}

// Deletes an event
function deleteEvent(key) {
    if (confirm("Are you sure you want to delete this event?")) {
        delete events[key];
        localStorage.setItem('events', JSON.stringify(events)); // Save updated events to Local Storage
        alert("Event deleted successfully!");
        modal.style.display = "none";
        generateCalendar(currentMonth);
    }
}

// Updates the upcoming events list based on the current month
function updateEventList(month) {
    eventListContainer.innerHTML = "";
    for (const key in events) {
        const [day, eventMonth] = key.split("-");
        if (parseInt(eventMonth) === month) {
            const event = events[key];
            eventListContainer.innerHTML += `
                <div class="event-item">
                    <h4>${event.title}</h4>
                    <p><strong>Date:</strong> ${new Date(2024, eventMonth, day).toLocaleDateString()}</p>
                    <p><strong>Description:</strong> ${event.description}</p>
                </div>
            `;
        }
    }
}

closeModal.onclick = () => (modal.style.display = "none");

// Previous month button logic (wraps around to December if January is selected)
document.getElementById("prev-month").onclick = () => {
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1; // Loop back to December if it's January
    generateCalendar(currentMonth);
};

// Next month button logic (wraps around to January if December is selected)
document.getElementById("next-month").onclick = () => {
    currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1; // Loop back to January if it's December
    generateCalendar(currentMonth);
};

generateCalendar(currentMonth);
