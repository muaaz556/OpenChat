"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();


let usersList = [];

//Disable the send button until connection is established.
//document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    // We can assign user-supplied strings to an element's textContent because it
    // is not interpreted as markup. If you're assigning in any other way, you 
    // should be aware of possible script injection concerns.
    li.textContent = `${user} says ${message}`;
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
        '<div id="' + user + '" class="row m-2" style="border-style: solid; border-radius: 20px;">' +
        '<span class="m-2 align-middle">' + user + '</span>' +
        '</div > ');
}

function removeElement(user) {
    const element = document.getElementById(user);
    element.remove();
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
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});
