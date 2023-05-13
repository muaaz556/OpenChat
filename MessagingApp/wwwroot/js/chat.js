"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

let usersList = [];

function update(value) {
    var element = document.getElementById("sendButton");
    if (value) {
        //not disabled
        element.classList.remove("disabled");
    } else {
        element.classList.add("disabled");
    }
}

function sendMessage() {
    var message = document.getElementById("textArea").value;
    document.getElementById("textArea").value = '';
    document.getElementById("sendButton").classList.add("disabled");
    console.log("sending message");
    connection.invoke("SendMessage", message).catch(function (err) {
        return console.error(err.toString());
    });
    addMessage(message, 'white');
    event.preventDefault();
}

connection.on("ReceiveMessage", function (user, message) {
    addMessage(message, 'black');
    //document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    //li.textContent = `${user} says ${message}`;
});

connection.on("UserList", function (list) {
    console.log("list " + list);
    usersList = usersList.concat(list);
    list.forEach(addElement);
    //var li = document.createElement("li");
    //document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    //li.textContent = `${user} says ${message}`;
});
 

function addElement(user) {
    document.getElementById('scrollView').innerHTML += (
        '<div id="' + user + '" class="row my-2 mx-3" style="border-style: solid; border-radius: 20px;">' +
        '<span class="m-2 align-middle">' + user + '</span>' +
        '</div > ');
}

function removeElement(user) {
    const element = document.getElementById(user);
    element.remove();
}

function addMessage(message, color) {
    var position = '';
    if (color === 'black') {
        color = 'bg-dark text-white';
        position = 'start';
    } else {
        color = ''
        position = 'end';
    }
    var innerContent = document.getElementById('messageArea').innerHTML;
    document.getElementById('messageArea').innerHTML = (
        `<div class="row mx-4 my-1 justify-content-${position}">
            <div class="py-2 ${color}" style="border-style: solid; border-radius: 20px; width: max-content;">${message}</div>
        </div>`) + innerContent;
}

connection.on("NewUser", function (user) {
    console.log("new user " + user);
    usersList.push(user);
    addElement(user);
    //var li = document.createElement("li");
    //document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    //li.textContent = `${user} says ${message}`;
});

connection.on("RemoveUser", function (user) {
    console.log(user);
    usersList = usersList.filter(item => item !== user);
    removeElement(user);
    //var li = document.createElement("li");
    //document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    //li.textContent = `${user} says ${message}`;
});

connection.start().then(function () {
}).catch(function (err) {
    return console.error(err.toString());
});


