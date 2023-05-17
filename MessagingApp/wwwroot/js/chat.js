"use strict";

const urlParams = new URLSearchParams(window.location.search);
//username parameter from querystring
const username = urlParams.get('username');
let usersList = [];

var connection = new signalR.HubConnectionBuilder().withUrl(`/chatHub?username=${username}`).build();

//Start signalr connection
connection.start().then(function () {
}).catch(function (err) {
    return console.error(err.toString());
});

//Display dialog when signalr is disconnected
connection.onclose(function () {
    new bootstrap.Modal(document.getElementById("disconnectedDialog")).show();
});

//Add message when notified by signalr hub
connection.on("ReceiveMessage", function (user, message) {
    addMessage(user, message);
});

//Update active users list when notified by signalr hub
connection.on("UsersList", function (list) {
    usersList = usersList.concat(list);
    list.forEach(addElementActiveUserList);
});

//Add user when notified by signalr hub
connection.on("NewUser", function (user) {
    usersList.push(user);
    addElementActiveUserList(user);
});

//Remove user when notified by signalr hub
connection.on("RemoveUser", function (user) {
    usersList = usersList.filter(item => item !== user);
    removeElementActiveUserList(user);
});

//Enable and disable send button based on if text area is empty or not
function updateSendButtonState(textAreaValue) {
    var sendButtonElement = document.getElementById("sendButton");
    if (textAreaValue) {
        sendButtonElement.classList.remove("disabled");
    } else {
        sendButtonElement.classList.add("disabled");
    }
}

//Add a user to the list of active users
function addElementActiveUserList(user) {
    document.getElementById('activeUserList').innerHTML += (
        `<div id="${user}" class="row my-2 mx-3" style="border-style: solid; border-radius: 20px;">
        <span class="m-2 align-middle">${user}</span>
        </div > `);
}

//Remove a user from the list of active users
function removeElementActiveUserList(user) {
    const activeUserElement = document.getElementById(user);
    activeUserElement.remove();
}

//Send message to all other active users
function sendMessage() {
    const message = document.getElementById("textArea");
    document.getElementById("sendButton").classList.add("disabled");
    connection.invoke("SendMessage", message.value).catch(function (err) {
        return console.error(err.toString());
    });
    addMessage(null, message.value);
    message.value = '';
    event.preventDefault();
}

//Add new message in text area
function addMessage(user, message) {
    const messageAreaElement = document.getElementById('messageArea')
    const messageAreaInnerHTML = messageAreaElement.innerHTML;
    if (user) {
        messageAreaElement.innerHTML = (
            `<div class="row mx-4 my-1 justify-content-start">
            <div class="pb-1 px-1" style="font-size:12px; color:gray">${user}</div>
            <div class="py-2 bg-dark text-white" style="border-style: solid; border-radius: 20px; width: max-content;">${message}</div>
        </div>`) + messageAreaInnerHTML;
    } else {
        messageAreaElement.innerHTML = (
            `<div class="row mx-4 my-1 justify-content-end">
            <div class="py-2" style="border-style: solid; border-radius: 20px; width: max-content;">${message}</div>
        </div>`) + messageAreaInnerHTML;

    }
}
