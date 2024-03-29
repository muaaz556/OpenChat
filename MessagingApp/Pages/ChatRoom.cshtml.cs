﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MessagingApp.Pages
{
	public class ChatRoomModel : PageModel
    {
        public void OnGet(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                Response.Redirect("/index");
            }
        }
    }
}
