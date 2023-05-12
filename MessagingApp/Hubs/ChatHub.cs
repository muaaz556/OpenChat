﻿using Microsoft.AspNetCore.SignalR;

namespace MessagingApp.Hubs
{
    public class ChatHub : Hub
    {
        private readonly static Dictionary<string, string> _connections =
            new Dictionary<string, string>();

        public override async Task OnConnectedAsync()
        {
            string user = Guid.NewGuid().ToString();
            lock (_connections)
            {
                var users = _connections.Values.ToArray();
                _connections.Add(Context.ConnectionId, user);
                Clients.AllExcept(new List<string>() { Context.ConnectionId }).SendAsync("NewUser", user);
                //var users = _connections.Values.ToArray();
                //users = users.Where(x => x != _connections[Context.ConnectionId]).ToArray();
                Clients.Client(Context.ConnectionId).SendAsync("UserList", users);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            lock (_connections)
            {
                Clients.All.SendAsync("RemoveUser", _connections[Context.ConnectionId]);
                _connections.Remove(Context.ConnectionId);
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}

