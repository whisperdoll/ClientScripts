/* ***************************************************** */
/* ********* STOP LOOKING AT ME YOU CRAZY245 *********** */
/* ***************************************************** */

var settingsPath = "CSSettings.txt";
var network = client.network();

var initCheck = false;

var sep = "⁄";

var scriptUrl = "https://raw.githubusercontent.com/SongSing/ClientScripts/master/script.js";

var acceptCommand = true;

var star = "<img alt='' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJQSURBVHjajFJNTxNRFD3vY6aVVghQmyAChRhiJOLCHSvYukJcmbjQRFyRqCujexbudGvY+Qf8F8aEBdTPkEBpClKrA6ZfM0znveedmVbahCa+mZO8eXPPufeed1njBYCAIAgMvUvjNQw9As96zk0bPHr7rBZyPDf0iOcGV2k/1S+sv4DGY744meKLU6lw//8CYWk+RtlE+gG/Ogw+Oww2kXpIZ5no37kCnZ5URB6Eh6di4fIYpIhCxC3a+3hCXg1RNegWkoTbZN5NOpxGUs6wATnGxtLX+NwloEnueho8NwI+n3lpKrW75lSV4asiqewT9xNrPEdeLE7e4NezwIAAu0iakuAS2aV0p5TOJwSERgBTbUXC+uAEaq/8lVPm+/qLU4jImRQJU1c1CqpTP24XakEkxqxE1Kou/ylQBfeoQeTNUWM5eLtdNKVqPBNNyuyaXnhhNaT/s4Zgc/fA1L0Vaj0fm2iTiOMtB+8+75tSPZyBmOC20VQx2Wki2C6UjOvfocRbvdeYxJapeOv6mxMLuF0CoZhnoCs1mIb/isibZ7eguy7VxjhLJ8msdt+hUGggtcSoNWHZUALZiMM6AqxrgGw+x6QVZw0YzLFLAnSNkozTFGBZYELMG63OFZAsYc0yaQNVH6rwC7r0+yOMUTw7uiCzI2BJErLkDDxlE8+PPehMoabSEvKKLh6j9WFnX+2W10wQLBmlltSPyqr/fW9HOydgtpim+PEO76wCiQFTbR4GTnGDzt7Q99G/keXYML7/vlU8XINgK2TihY5tfwUYAAPpHgSOMoDeAAAAAElFTkSuQmCC' />";
var smile = "<img alt='' src='data:image/gif;base64,R0lGODlhFgATANQAAAAAABwcHCwsLEhISIhgAOw4DP9ACKSMAP9sPMSsANSwHP/QKP/gDP/wLP/4aPDw8P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkZABAALAAAAAAWABMAAAWhYBBAZGmepRgIIupCIrsK7GvO9eo4ox00ixqs0dj1UD/GQnH8NRjMAGAKEC2uzNtTQUgwGLtvgoA9kgLQL3GtXGZPAcV6DrwuzakvYa4kv5ENAg8DREqCAwt4Zw6BA3tfQY4KfylrhAosCgtkdygACAZECl9KmgugAJ4GBgVyDAcHpasFqZ4FBQ0JB08HCQu3tS5OfF+Uwk6kDC02NyrLKCEAOw==' />";

// commands format: command [param1];[param2] - desc
// params not required obv

var commands = [ 
	"commands - Shows commands",
	"lookup [name] - Displays information about [name]",
	"pm [name] - Opens PM window with [name] selected",
	"pm [name];[message] - PMs user [name] with [message]",
	"ranking [name] - Opens ranking window and selects [name]",
	"changename [name] - Attempts to change your name to [name]",
	"setcs [symbol] - Changes your command symbol to [symbol]",
	"setbotname [name] - Changes my name to [name]",
	"setbotcolour [colour] - Changes my colour to [colour]",
	"eval [string] - Runs [string] through a JavaScript evaluator. Can be used for math and things!",
	"emotes - Shows available emotes",
	"emotes [on/off] - Enables/disables emotes",
	"update - Checks for updates",
	"stalkwords - Shows a list of your stalkwords",
	"addstalkword [stalkword] - Adds [stalkword] to your stalkwords",
	"removestalkword [stalkword] - Removes [stalkword] from your stalkwords",
	"enrichedtext [on/off] - Enables or disables enriched text"
];

	
function cs()
{
	return getVal("cmdSymbol", "~");
}
	
function say(message, channel) 
{ 
	if (channel === undefined) 
	{
		channel = client.currentChannel(); 
	} 
  
	network.sendChanMessage(channel, message); 
}

function hexToRgb(hex) // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
{
	hex = hex.toString();
	
	hex = hex.replace(/#/g, "");
	
	var bigint = parseInt(hex, 16);
	var r = (bigint >> 16) & 255;
	var g = (bigint >> 8) & 255;
	var b = bigint & 255;

	return "(" + r + ", " + g + ", " + b + ")";
}
	
function randomInt(arg1, arg2)
{
	if (arg2 !== undefined) // randomInt(min, max)
		return Math.floor(Math.random() * (arg2 - arg1)) + arg1;
	else // randomInt(max)
		return Math.floor(Math.random() * arg1);
}

function checkForUpdate(silent)
{
	sys.webCall(scriptUrl, function(resp) { checkUpdate(resp, silent); });
}

function checkUpdate(resp, silent)
{
	if (resp === undefined || resp === "")
	{
		printMessage("There was a problem checking for updates. (Are you connected to the internet?)");
		return;
	}
	
	if (resp !== sys.getFileContent(sys.scriptsFolder + "scripts.js"))
	{
		printMessage("There's an update available! <a href='po:send/" + cs() + "doupdate'>(Click here to update)</a>");
	}
	else if (silent === undefined || silent === false)
	{
		printMessage("No updates available at this time. (Surprisingly!)");
	}
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
	if (sys.filesForDirectory(sys.getCurrentDir()).indexOf(settingsPath) === -1)
	{
		sys.writeToFile(settingsPath, "");
		setVal(key, def);
		return def;
	}
	
	var lines = sys.getFileContent(settingsPath).split("\n");
	
	for (var i = 0; i < lines.length; i++)
	{
		if (lines[i].split(";")[0].toString() === key.toString())
		{
			return lines[i].substr(lines[i].indexOf(";") + 1);
		}
	}
	
	setVal(key, def);
	return def;
}

function escapeHTML(str) // stole from moogle bc lazy
{
	var m = String(str);
	
	if (m.length > 0)
	{
		var amp = "&am" + "p;";
		var lt = "&l" + "t;";
		var gt = "&g" + "t;";
		return m.replace(/&/g, amp)
			.replace(/</g, lt)
			.replace(/>/g, gt);
	}
	else
	{
		return "";
	}
}

function setVal(key, val)
{
	var lines = sys.getFileContent(settingsPath).split("\n");
	var found = false;
	
	if (typeof(val) === "array")
	{
		val = val.join(sep);
	}
	
	val = val.toString();
	
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

function randomWord()
{	
	var rs = [ "Amazing!", "Fantastic!", "Whaddya know?!", "I bet your mom is proud!", "But are you truly happy?", "Or...?" ];
	var r = randomInt(rs.length);
	
	return rs[r];
}

String.prototype.insert = function (index, string)
{
  if (index > 0)
	return this.substring(0, index) + string + this.substring(index, this.length);
  else
	return string + this;
};

function botHTML(timestamp, colon, symbol)
{
	if (timestamp === undefined)
		timestamp = true;
	if (colon === undefined)
		colon = true;
	if (symbol === undefined)
		symbol = true;
		
	return "<font color='" + getVal("botColour", "red") + "'>" + (timestamp ? "<timestamp />" : "") + "<b>" + (symbol ? "±" : "") + getVal("botName", "Delibird") + (colon ? ":" : "") + "</font></b>";
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

String.prototype.withEmotes = function()
{
	return this.replace(/:\)/g, smile).replace(/☆/g, star);
};

String.prototype.enriched = function()
{
	return this.replace(/\/(.+)\//g, "<i>$1</i>").replace(/_(.+)_/g, "<u>$1</u>").replace(/\*(.+)\*/g, "<b>$1</b>");
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
	print(botHTML(true) + " " + (cmp(getVal("emotes", "on"), "on") ? message.withEmotes() : message), channel);
}

function printBorder(channel)
{
	print("<hr>", channel);
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

Array.prototype.indexOf = function(item)
{
	if (cmp(this, item))
		return 0;
		
	for (var i = 0; i < this.length; i++)
	{
		if (cmp(this[i], item))
		{
			return i;
		}
	}
	
	return -1;
};



function init()
{
	if (getVal("cmdSymbol", "::") === "::") // weird way to test if doesnt exist
	{
		sys.writeToFile(settingsPath, ""); // create file
		
		setVal("cmdSymbol", "~");
		setVal("botName", "Delibird");
		setVal("botColour", "red");
	}
	
	client.printHtml(botHTML() + " Hey, you're running cool client scripts, guy!");
	client.printHtml(botHTML() + " Your command symbol is: <b>" + cs() + "</b>");
	checkForUpdate();
}




({

beforeSendMessage: function(message, channel)
{
	var m = message.getMessage();
	
	if (m.substr(0, cs().length) === cs() && acceptCommand)
	{
		sys.stopEvent();
		handleCommand(m.split(" ")[0].substr(cs().length), ((m.indexOf(" ") !== -1 && m.replace(/ /g, "").length < m.length) ? m.substr(m.indexOf(" ") + 1).split(";") : [ undefined ]), channel);
	}
	else if (m.substr(0, cs().length) === cs() && !acceptCommand)
	{
		sys.stopEvent();
		acceptCommand = true;
		handleCommand(m.split(" ")[0].substr(cs().length), ((m.indexOf(" ") !== -1 && m.replace(/ /g, "").length < m.length) ? m.substr(m.indexOf(" ") + 1).split(";") : [ undefined ]), channel);
	
	}
	else
	{
		if (getVal("misspell", "off") === "on")
		{
			sys.stopEvent();
			sayMispelled(m, channel);
		}
	}
},
beforeChannelMessage: function(message, channel, html)
{
	if (!initCheck)
	{
		initCheck = true;
		init();
	}
	
	if (message.indexOf(": ") !== -1 && isPlayerOnline(message.getUser()))
	{
		var name = message.getUser();
		var msg = message.getMessage();
		var id = client.id(name);
		var colour = client.color(id);
		
		sys.stopEvent();
		
		// ok lets do this
		
		var cmd = "po:send/" + cs() + "lookup " + name;
	
		msg = escapeHTML(msg).replace(new RegExp("(\\b" + escapeHTML(client.ownName()) + "\\b)", "gi"), " <b><i>$1</i></b><ping />");
			
		if (getVal("emotes", "on") === "on")
			msg = msg.withEmotes();
		
		if (msg.indexOf("http") !== -1)
			msg = msg.fixLinks();
			
		var stalkwords = getVal("stalkwords", "");
		
		if (stalkwords !== "")
		{
			if (stalkwords.indexOf(sep) === -1)
			{
				stalkwords = [ stalkwords ];
			}
			else
			{
				stalkwords = stalkwords.split(sep);
			}
			
			for (var i = 0; i < stalkwords.length; i++)
			{
				msg = msg.replace(new RegExp("(\\b" + escapeHTML(stalkwords[i]) + "\\b)", "gi"), "<b><i>$1</i></b><ping />");
			}
		}
		
		if (cmp(getVal("etext", "on"), "on"))
			msg = msg.enriched();
		
		print("<a href='" + cmd + "' style='text-decoration:none;'><font color='" + colour + "'><timestamp /><b> " 
			+ (client.auth(id) > 0 ? "+<i>" + name + "</i>" : name) + ":</b></font></a> "
			+ msg, channel);
	}
}

})

function handleCommand(command, data, channel)
{
	if (!acceptCommand)
		return;
		
	if (cmp(command, "commands") || cmp(command, "commandslist") || cmp(command, "commandlist"))
	{
		printBorder();
		
		printMessage(header("Commands:"));
		
		for (var i = 0; i < commands.length; i++)
		{
			printMessage((cs() + commands[i]).parseCmdDesc());
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
		var htr = hexToRgb(client.color(id));
		
		print("<hr>");
		print(center(botHTML() + " Here's info for " + user + ":<br /><br /><img src='trainer:" + avatar + "'></img><h3><i><font color='" + client.color(id) + "'>" + user + "</font></i></h3><h4>"
			+ "ID: " + client.id(user) + "<br />"
			+ "Auth Level: " + client.auth(id) + "<br />"
			+ "Ignoring?: " + (client.isIgnored(id) ? "Yes" : "No") + "<br />"
			+ "Colour: <font color='" + client.color(id) + "'><b>" + client.color(id) + "</b></font> / " + htr + "<br />"
			+ "Tiers: " + client.tiers(id).join(", ") + "<br />"
			+ "Actions: <a href='po:pm/" + id + "'>PM</a>, <a href='po:info/" + id + "'>Challenge</a>" 
				+ (isPlayerBattling(id) ? ", <a href='po:watchplayer/" + id + "'>Watch Battle</a>" : "") + ", "
				+ "<a href='po:ignore/" + id + "'>Toggle Ignore</a>, " // dont say ignore/unignore bc after you ignore 'toggle ignore' is still relevant
				+ "<a href='po:send/" + cs() + "ranking " + user + "'>View Rank</a>"
			
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
	else if (command === "setbotname")
	{
		var name = data[0];
		
		if (name !== undefined && name.replace(/ /g, "").length > 0)
		{
			printMessage("Call me <b><font color='" + getVal("botColour", "red") + "'>" + name + "</font></b>!");
			setVal("botName", name);
		}
		else
		{
			printMessage("There was something wrong with the name you specified. Make sure it's at least one non-space character!");
		}
	}
	else if (command === "setbotcolor" || command === "setbotcolour")
	{
		var color = data[0];
		
		if (color !== undefined)
		{
			printMessage("Your colour was interpreted as: <b><font color='" + color + "'>" + getVal("botName", "Delibird") + "</font></b>");
			setVal("botColour", color);
			printMessage("Colour changed!");
		}
		else
		{
			printMessage("What colour?");
		}
	}
	else if (command === "eval")
	{
		if (data[0] !== undefined)
		{
			print(eval(data[0]));
		}
		else
		{
			printMessage("Something went wrong. <b><i>It was your fault.</i></b> (What are you trying to eval?)");
		}
	}
	else if (command === "emotes")
	{
		if (data[0] === undefined || (!cmp(data[0], "on") && !cmp(data[0], "off")))
		{
			if (cmp(getVal("emotes", "on"), "on"))
			{
				print(botHTML() + " Emotes: <a href='po:setmsg/:)' style='text-decoration:none;'>" + smile
					+ "</a> <a href='po:setmsg/☆' style='text-decoration:none;'>" + star 
					+ "</a> <a href='po:send/" + cs() + "emotes off'>(Turn off)</a>");
			}
			else
			{
				printMessage("Emotes are currently off. <a href='po:send/" + cs() + "emotes on'>(Turn on)</a>");
			}
		}
		else if (cmp(data[0], "off"))
		{
			setVal("emotes", "off");
			printMessage("Emotes have been disabled. :)");
		}
		else if (cmp(data[0], "on"))
		{
			setVal("emotes", "on");
			printMessage("Emotes have been enabled. :)");
		}
	}
	else if (command === "update")
	{
		checkForUpdate();
	}
	else if (cmp(command, "doupdate"))
	{
		sys.webCall(scriptUrl, function (resp)
		{
			if (resp === undefined || resp === "")
				return;
				
			sys.writeToFile(sys.scriptsFolder + "backup.js", sys.getFileContent(sys.scriptsFolder + "scripts.js"));
			
			sys.changeScript(resp);
			sys.writeToFile(sys.scriptsFolder + "scripts.js", resp);
			
			printMessage("Updated! Backup at: " + sys.scriptsFolder + "backup.js");
		});
	}
	else if (cmp(command, "addstalkword"))
	{
		if (data[0] !== undefined)
		{
			var stalkwords = getVal("stalkwords", "");
			
			if (stalkwords !== "")
			{
				if (stalkwords.indexOf(sep) === -1 || (sep + stalkwords).indexOf(sep + data[0]) === -1)
				{
					stalkwords += sep + data[0];
					setVal("stalkwords", stalkwords);
					printMessage("\"" + data[0] + "\" was added to your stalkwords! <b>" + randomWord() + "</b>");
				}
				else
				{
					printMessage("That's already a stalkword you peporini piza! <a href='po:send/" + cs() + "stalkwords'>(View stalkwords)</a>");
				}
			}
			else
			{
				setVal("stalkwords", data[0]);
				printMessage("\"" + data[0] + "\" was added to your stalkwords! <b>" + randomWord() + "</b>");
			}
		}
		else
		{
			printMessage("Go on....");
		}
	}
	else if (cmp(command, "removestalkword"))
	{
		if (data[0] !== undefined)
		{
			var stalkwords = getVal("stalkwords", "");
			
			if (stalkwords !== "")
			{
				if (!cmp(stalkwords, data[0]) && stalkwords.split(sep).indexOf(data[0]) === -1)
				{
					printMessage("That's not one of your stalkwords!!!! <a href='po:send/" + cs() + "stalkwords'>(View stalkwords)</a>");
					return;
				}
				
				if (cmp(stalkwords, data[0]))
				{
					stalkwords = "";
				}
				else
				{
					var _stalkwords = stalkwords.split(sep);
					_stalkwords.splice(_stalkwords.indexOf(data[0]), 1);
					stalkwords = _stalkwords.join(sep);
				}
				
				setVal("stalkwords", stalkwords);
				printMessage("\"" + data[0] + "\" removed from stalkwords! <b>" + randomWord() + "</b>");
			}
		}
	}
	else if (cmp(command, "stalkwords"))
	{
		printBorder();
		printMessage(header("Stalkwords:"));
		var stalkwords = getVal("stalkwords", "");
		
		if (stalkwords === "")
		{
			printMessage("No stalkwords! <a href='po:setmsg/" + cs() + "addstalkword [stalkword]'>(Add stalkword)</a>");
			return;
		}
		
		stalkwords = stalkwords.split(sep);
		var _stalkwords = stalkwords;
		
		for (var i = 0; i < stalkwords.length; i++)
		{
			var stalkword = stalkwords[i];
			
			if (stalkword === undefined || stalkword.replace(/ /g, "") === "") // just to be safe!
			{
				_stalkwords.splice(stalkwords.indexOf(stalkword), 1);
				continue;
			}
			
			printMessage("" + stalkword + " <a href='po:send/" + cs() + "removestalkword " + stalkword + "'>(Remove)</a>");
		}
		
		setVal("stalkwords", _stalkwords.join(sep));
		printBorder();
	}
	else if (cmp(command, "enrichedtext"))
	{
		if (data[0] === undefined)
		{
			printMessage("On or off?");
			return;
		}
		
		if (cmp(data[0], "on"))
		{
			setVal("etext", "on");
			printMessage("Enriched text was enabled!");
		}
		else if (cmp(data[0], "off"))
		{
			setVal("etext", "off");
			printMessage("Enriched text was disabled!");
		}
		else
		{
			printMessage("What? On or off?");
		}
	}
	
	
	else
	{
		//printMessage("<b>" + cs() + command + "</b> is not a command! <a href='po:send/" + cs() + "commands'>View commands</a>");
		acceptCommand = false;
		say("/" + command);
	}
}











