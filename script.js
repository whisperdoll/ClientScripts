/* ***************************************************** */
/* ********* YOU'LL NEVER AMOUNT TO ANYTHING *********** */
/* ***************************************************** */

var settingsPath = "CSSettings.txt";
var network = client.network();

var star = "<img alt='' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJQSURBVHjajFJNTxNRFD3vY6aVVghQmyAChRhiJOLCHSvYukJcmbjQRFyRqCujexbudGvY+Qf8F8aEBdTPkEBpClKrA6ZfM0znveedmVbahCa+mZO8eXPPufeed1njBYCAIAgMvUvjNQw9As96zk0bPHr7rBZyPDf0iOcGV2k/1S+sv4DGY744meKLU6lw//8CYWk+RtlE+gG/Ogw+Oww2kXpIZ5no37kCnZ5URB6Eh6di4fIYpIhCxC3a+3hCXg1RNegWkoTbZN5NOpxGUs6wATnGxtLX+NwloEnueho8NwI+n3lpKrW75lSV4asiqewT9xNrPEdeLE7e4NezwIAAu0iakuAS2aV0p5TOJwSERgBTbUXC+uAEaq/8lVPm+/qLU4jImRQJU1c1CqpTP24XakEkxqxE1Kou/ylQBfeoQeTNUWM5eLtdNKVqPBNNyuyaXnhhNaT/s4Zgc/fA1L0Vaj0fm2iTiOMtB+8+75tSPZyBmOC20VQx2Wki2C6UjOvfocRbvdeYxJapeOv6mxMLuF0CoZhnoCs1mIb/isibZ7eguy7VxjhLJ8msdt+hUGggtcSoNWHZUALZiMM6AqxrgGw+x6QVZw0YzLFLAnSNkozTFGBZYELMG63OFZAsYc0yaQNVH6rwC7r0+yOMUTw7uiCzI2BJErLkDDxlE8+PPehMoabSEvKKLh6j9WFnX+2W10wQLBmlltSPyqr/fW9HOydgtpim+PEO76wCiQFTbR4GTnGDzt7Q99G/keXYML7/vlU8XINgK2TihY5tfwUYAAPpHgSOMoDeAAAAAElFTkSuQmCC' />";

// commands format: command [param1];[param2] - desc
// params not required obv

var commands = [ 
	"commands - Shows commands",
	"lookup [name] - Displays information about [name]",
	"pm [name] - Opens PM window with [name] selected",
	"pm [name];[message] - PMs user [name] with [message]",
	"ranking [name] - Opens ranking window and selects [name]"
	];

	
function say(message, channel) 
{ 
    if (channel === undefined) 
    {
        channel = client.currentChannel(); 
    } 
  
    network.sendChanMessage(channel, message); 
} 
	
function randomInt(arg1, arg2)
{
	if (arg2 !== undefined) // randomInt(min, max)
		return Math.floor(Math.random() * (arg2 - arg1)) + arg1;
	else // randomInt(max)
		return Math.floor(Math.random() * arg1);
}

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

function getVal(key, def)
{
	var lines = sys.getFileContent(settingsPath).split("\n");
	
	for (var i = 0; i < lines.length; i++)
	{
		if (lines[i].split(";")[0] === key)
		{
			return lines[i].substr(lines[i].indexOf(";") + 1);
		}
	}
	
	return def;
}

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

String.prototype.fixLinks = function()
{
	// oh god
	
	var s = this;
	var words = s.split(" ");
	
	for (var i = 0; i < words.length; i++)
	{
		if ( (cmp(words[i].substr(0, 7), "http://") || cmp(words[i].substr(0, 8), "https://") )&& words[i].indexOf(".") !== -1)
		{
			words[i] = "<a href='" + words[i] + "'>" + words[i] + "</a>";
		}
	}
	
	return words.join(" ");
};


function isPlayerBattling(id)
{
	if (client.player == null)
	{
		return false;
	}
	
	return (client.player(id).flags & (1 << 2)) > 0;
}

function isPlayerOnline(name)
{
	return client.id(name) !== -1;
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

function header(text)
{
	return "<b><u>" + text + "</u></b>";
}

function center(text)
{
	return "<table width='100%'><tr><td align='center'>" + text + "</td></tr></table>";
}

Array.prototype.shuffle = function()
{
	var count = this.length;
	var ret = new Array();
	var rands = new Array();
	var nos = new Array();

	for (var i = 0; i < count; i++)
	{
		nos.push(i);
	}

	for (var i = 0; i < count; i++)
	{
		var r = randomInt(nos.length);
		rands.push(nos[r]);
		nos.removeAt(r);
	}

	for (var i = 0; i < count; i++)
	{
		ret.push(this[rands[i]]);
	}

	for (var i = 0; i < count; i++)
	{
		this.removeAt(0);
	}

	for (var i = 0; i < count; i++)
	{
		this.push(ret[i]);
	}
	
	return;
};

Array.prototype.removeAt = function(ind)
{
	this.splice(ind, 1);

	return;
};

function sayMispelled(m, channel)
{
	var words = m.split(" ");
	var newwords = "";
			
	for (var i = 0; i < words.length; i++)
	{
		var word = words[i];
		var fl = word[0];
		var ll = word[word.length - 1];
			
		var letters = new Array();
				
		if (word.length === 1)
		{
			newwords += word + " ";
			continue;
		}
				
		for (var j = 1; j < word.length - 1; j++)
		{
			letters.push(word[j]);
			
			if (randomInt(6) === 2)
			{
				var l = "qwertyuiop[]\asdfghjkl;'zxcvbnm,./";
				letters.push(l[randomInt(l.length)]);
			}
		}
				
		letters.shuffle();
				
		var newword = fl + letters.join("") + ll;
		newwords += newword + " ";
	}
			
	newwords = newwords.substr(0, newwords.length - 1); // remove last space
			
	say(newwords, channel);
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
	
	printMessage("Hey, you're running cool client scripts, " + client.ownName() + "!");
	printMessage("Your command symbol is: <b>" + getVal("cmdSymbol", "~") + "</b>");
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
	else
	{
		if (getVal("misspell", false))
		{
			sys.stopEvent();
			sayMispelled(m, channel);
		}
	}
},
beforeChannelMessage: function(message, channel, html)
{
	if (message.indexOf(": ") !== -1 && isPlayerOnline(message.getUser()))
	{
		var name = message.getUser();
		var msg = message.getMessage();
		var id = client.id(name);
		var colour = client.color(id);
		
		sys.stopEvent();
		
		// ok lets do this
		
		var cmd = "po:send/" + getVal("cmdSymbol", "~") + "lookup " + name;
		
		if (msg.indexOf("http") !== -1)
			msg = msg.fixLinks();
		
		print("<a href='" + cmd + "' style='text-decoration:none;'><font color='" + colour + "'><timestamp /><b> " + name + ":</b></font></a> " + msg, channel);
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
				+ "<a href='po:ignore/" + id + "'>Toggle Ignore</a>, " // dont say ignore/unignore bc after you ignore 'toggle ignore' is still relevant
				+ "<a href='po:send/" + getVal("cmdSymbol", "~") + "ranking " + user + "'>View Rank</a>"
			
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
	else if (command === "changename")
	{
		var name = data[0];
		
		client.changeName(name);
	}
	else if (command === "setcs")
	{
		var symbol = data[0];
		
		if (symbol !== undefined && symbol.length === 1)
		{
			setVal("cmdSymbol", symbol);
			printMessage("Changed command symbol to: <b>" + symbol + "</b>");
		}
		else
		{
			printMessage("There was something wrong with the command symbol specified. Command symbols must be one character in length! <b>You've got more sense than that, "
				+ client.ownName() + "!</b>");
		}
	}
	
	
	else
	{
		printMessage("<b>" + cs + command + "</b> is not a command! <a href='po:send/" + cs + "commands'>View commands</a>");
	}
}











