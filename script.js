/* ***************************************************** */
/* ********* YOU'LL NEVER AMOUNT TO ANYTHING *********** */
/* ***************************************************** */

var settingsPath = "CSSettings.txt";
var network = client.network();


// commands format: command [param1];[param2] - desc
// params not required obv

var commands = [ 
	"commands - Shows commands",
	"lookup [name] - Displays information about [name]",
	"pm [name] - Opens PM window with [name] selected",
	"pm [name];[message] - PMs user [name] with [message]",
	"ranking [name] - Opens ranking window and selects [name]"
	];


function cmp(x1, x2)
{
	if (typeof x1 !== typeof x2)
	{
		return false;
	}
	else if (typeof x1 === "string")
	{
		if (x1.toLowerCase() === x2.toLowerCase())
		{
			return true;
		}
	}
	return x1 === x2;
}

function getVal(key)
{
	var lines = sys.getFileContent(settingsPath).split("\n");
	
	for (var i = 0; i < lines.length; i++)
	{
		if (lines[i].split(";")[0] === key)
		{
			return lines[i].substr(lines[i].indexOf(";") + 1);
		}
	}
	
	return undefined;
};

function setVal(key, val)
{
	var lines = sys.getFileContent(settingsPath).split("\n");
	var found = false;
	
	for (var i = 0; i < lines.length; i++)
	{
		if (lines[i].split(";")[0] === key)
		{
			lines[i] = lines[i].split(";")[0] + ";" + val;
			found = true;
			break;
		}
	}
	
	if (!found)
	{
		lines.push(key + ";" + val);
	}
	
	sys.writeToFile(settingsPath, lines.join("\n"));
}

String.prototype.getMessage = function()
{
	if (this.indexOf(':') != -1)
		return this.substr(this.indexOf(':') + 2);

	return this;
};

String.prototype.getUser = function()
{
	return this.split(':')[0]; // users can't have colons in names
};

String.prototype.parseCmdDesc = function()
{
	var cmd = "<b>" + this.split(" ")[0] + "</b>";
	var params = this.substr(this.split(" ")[0].length).split(" - ")[0];
	var desc = this.substr(this.indexOf(" - "));
	
	params = params.replace(/\[/g, "<code>[").replace(/]/g, "]</code>");
	desc = desc.replace(/\[/g, "<code>[").replace(/]/g, "]</code>");
	
	var ret = "<a href='po:setmsg/" + this.substr(0, this.indexOf(" - ")) + "' style='text-decoration:none;'>" + cmd + "</a> " + params + desc;
		
	return ret;
};


function isPlayerBattling(id)
{
	if (client.player == null)
	{
	  return false;
	}
	
	return (client.player(id).flags & (1 << 2)) > 0;
}

function print(message, channel)
{
	if (channel === undefined)
	{
		channel = client.currentChannel();
	}
	
	client.printChannelMessage(message, channel, true);
}

function printMessage(message, channel)
{
	print("<font color='" + getVal("botColour") + "'><timestamp /><b>±" + getVal("botName") + ":</font></b> " + message, channel);
}

function printBorder(colour)
{
	if (colour === undefined)
		colour = "#f995f1";
		
	print("<hr>");
}

function stripHTML(string) // i stole this hahas
{
    var regex = /(<([^>]+)>)/ig;
    string = string.replace(regex, "");
    return string;
}

function header(text)
{
	return "<b><u>" + text + "</u></b>";
}

function center(text)
{
	return "<table width='100%'><tr><td align='center'>" + text + "</td></tr></table>";
}

function say(message, channel)
{
	if (channel === undefined)
	{
		channel = client.currentChannel();
	}
	
	network.sendChanMessage(channel, message);
}


({

clientStartUp: function()
{
	if (sys.getFileContent(settingsPath) === undefined)
	{
		sys.writeToFile(settingsPath, "");
		
		setVal("cmdSymbol", "~");
		setVal("botName", "Delibird");
		setVal("botColour", "red");
	}
},
beforeSendMessage: function(message, channel)
{
	var cs = getVal("cmdSymbol");
	var m = message.getMessage();
	
	if (m.substr(0, cs.length) === cs)
	{
		sys.stopEvent();
		handleCommand(m.split(" ")[0].substr(cs.length), m.substr(m.indexOf(" ") + 1).split(";"), channel);
	}
},
beforeChannelMessage: function (message, channel, html)
{
	var cs = getVal("cmdSymbol");
	if (message.indexOf(":") !== -1)
	{
		sys.stopEvent();
		var name = stripHTML(message.getUser());
		var color = client.color(client.id(name));
		var msg = message.getMessage();
		
		// ok so we can just prent whatever they said but make their name clickable
		// todo: if theyre auth make it look like it etc
		
		print("<a href='po:send/" + cs + "challenge " + name + "'><font color='" + color + "'><b>" + name + ": </b></font></a>" + msg, channel);
	}
}


})

function handleCommand(command, data, channel)
{
	var cs = getVal("cmdSymbol");
	
	if (command === "commands")
	{
		printBorder();
		
		printMessage(header("Commands:"));
		var cs = getVal("cmdSymbol");
		
		for (var i = 0; i < commands.length; i++)
		{
			printMessage((cs + commands[i]).parseCmdDesc());
		}
		
		printBorder();
	}
	else if (command === "lookup")
	{
		var id = client.id(data[0]);
		var user = client.name(id); // for correct case
		
		if (id === -1)
		{
			printMessage("That user is not on the server!");
			return;
		}
		
		var avatar = client.player(id).avatar;
		
		print("<hr>");
		print(center("<timestamp /><br /><img src='trainer:" + avatar + "'></img><h3><i><font color='" + client.color(id) + "'>" + user + "</font></i></h3><h4>"
			+ "ID: " + client.id(user) + "<br />"
			+ "Auth Level: " + client.auth(id) + "<br />"
			+ "Ignoring?: " + (client.isIgnored(id) ? "Yes" : "No") + "<br />"
			+ "Colour: <font color='" + client.color(id) + "'><b>" + client.color(id) + "</b></font><br />"
			+ "Tiers: " + client.tiers(id).join(", ") + "<br />"
			+ "Actions: <a href='po:pm/" + id + "'>PM</a>, <a href='po:info/" + id + "'>Challenge</a>" 
				+ (isPlayerBattling(id) ? ", <a href='po:watchplayer/" + id + "'>Watch Battle</a>" : "") + ", "
				+ "<a href='po:ignore/" + id + "'>Toggle Ignore</a>" // dont say ignore/unignore bc after you ignore 'toggle ignore' is still relevant
			
			+ "</h4>"));
		print("<hr>");
	}
	else if (command === "ranking")
	{
		var id = client.id(data[0]);
		
		if (id === -1)
		{
			printMessage("Cannot show ranking for that player!");
			return;
		}
		
		client.seeRanking(id);
	}
	else if (command === "pm")
	{
		var id = client.id(data[0]);
		
		if (id === -1)
		{
			printMessage("Cannot PM that player!");
			return;
		}
		
		client.startPM(id);
		
		if (data.length > 1)
		{
			network.sendPM(id, data[1]);
		}
	}
	else if (command === "challenge")
	{
		var id = client.id(data[0]);
		
		if (id === -1)
		{
			printMessage("Cannot challenge that player!");
			return;
		}
		
		client.seeInfo(id);
	}
	
	
	else
	{
		printMessage("<b>" + cs + command + "</b> is not a command! <a href='po:send/" + cs + "commands'>View commands</a>");
	}
}












