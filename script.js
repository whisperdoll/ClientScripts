// New <b><font color='blue'>setauthsymbol</font></b> <code>[symbol]</code>;<code>[level]</code> - Can change symbols for different levels of auth! (Thanks Bamarah!)<br><b>Also:</b> I fixed the stupid enriched text bug with links (hopefully), but right now, combining isn't supported. I'll work on that later.<br>Both of these features need testing, if you find bugs be sure to tell me either on the forum or the client! Thanks! //

/* ***************************************************** */
/* ********* BUY ME A BIG BOTTLE OF JOGURT!! *********** */
/* ***************************************************** */
var settingsPath = "CSSettings.txt";
var emotesPath = "emotes.txt";
var network = client.network();

var defaults = [

	"cmdSymbol;~",
	"botColour;red",
	"botName;Delibird",
	"emotes;on",
	"flashColour;gold",
	"etext;on",
	"stalkwords;",
	"ignorechals;off",
	"auth0;",
	"auth1;+",
	"auth2;+",
	"auth3;+",
	"auth4;"

];

var initCheck = false;

var sep = "⁄";

var scriptUrl = "https://raw.githubusercontent.com/SongSing/ClientScripts/master/script.js";
var emoteUrl = "https://raw.githubusercontent.com/SongSing/ClientScripts/master/Emotes";
var emotesCheck = false;

var authSymbols = [];

var emotesData;
var emotesList;

var acceptCommand = true;

// commands format: command [param1];[param2] - desc
// params not required obv

var commands = [
	"commands - Shows commands",
	"lookup [name] - Displays information about [name]",
	"pm [name] - Opens PM window with [name] selected",
	"pm [name];[message] - PMs user [name] with [message]",
	"ranking [name] - Opens ranking window and selects [name]",
	"changename [name] - Attempts to change your name to [name]",
	"setcommandsymbol [symbol] - Changes your command symbol to [symbol]",
	"setbotname [name] - Changes my name to [name]",
	"setbotcolour [colour] - Changes my colour to [colour]",
	"eval [string] - Runs [string] through a JavaScript evaluator. Can be used for math and things!",
	"emotes - Shows available emotes",
	"emotes [on/off] - Enables/disables emotes",
	"update - Checks for updates",
	"stalkwords - Shows a list of your stalkwords",
	"addstalkword [stalkword] - Adds [stalkword] to your stalkwords",
	"removestalkword [stalkword] - Removes [stalkword] from your stalkwords",
	"enrichedtext [on/off] - Enables or disables enriched text",
	"setauthsymbol [symbol] - Changes symbol used to denote auth",
	"setflashcolour [colour] - Changes the highlight colour of your name and stalkwords",
	"updateemotes - Downloads the emotes file",
	"ignorechallenges [on/off] - Enables or disables auto-ignored challenges"
];


function cs()
{
	return getVal("cmdSymbol");
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
	sys.webCall(scriptUrl, function (resp)
	{
		checkUpdate(resp, silent);
	});
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

function getVal(key, setanyway, def)
{
	if (setanyway === undefined)
		setanyway = true;
		
	if (def === undefined)
	{
		for (var i = 0; i < defaults.length; i++)
		{
			var s = defaults[i].split(";");
			
			if (cmp(key, s[0]))
			{
				def = s[1];
				break;
			}
		}
	}
	
	if (def === undefined) // still
		def = "";
		
	if (sys.filesForDirectory(sys.getCurrentDir()).indexOf(settingsPath) === -1)
	{
		sys.writeToFile(settingsPath, "");
		
		if (setanyway)
			setVal(key, def);
			
		return def;
	}

	var lines = sys.getFileContent(settingsPath).split("\n");

	for (var i = 0; i < lines.length; i++)
	{
		if (cmp(lines[i].split(";")[0].toString(), key.toString()))
		{
			return lines[i].substr(lines[i].indexOf(";") + 1);
		}
	}

	if (setanyway)
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

	if (typeof (val) === "array")
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
	var rs = ["Amazing!", "Fantastic!", "Whaddya know?!", "I bet your mom is proud!", "But are you truly happy?", "Or...?"];
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

	return "<font color='" + getVal("botColour", "red") + "'>" + (timestamp ? "<timestamp />" : "") + "<b>" + (symbol ? "±" : "")
		+ (getVal("emotes", "on") === "on" ? getVal("botName", "Delibird").withEmotes() : getVal("botName", "Delibird")) + (colon ? ":" : "") + "</font></b>";
}

String.prototype.getMessage = function ()
{
	if (this.indexOf(":") !== -1)
		return this.substr(this.indexOf(":") + 2);

	return this;
};

String.prototype.getUser = function ()
{
	return this.split(':')[0]; // users can't have colons in names
};

String.prototype.parseCmdDesc = function ()
{
	var cmd = "<b>" + this.split(" ")[0] + "</b>";
	var params = this.substr(this.split(" ")[0].length).split(" - ")[0];
	var desc = this.substr(this.indexOf(" - "));

	params = params.replace(/\[/g, "<code>[").replace(/]/g, "]</code>");
	desc = desc.replace(/\[/g, "<code>[").replace(/]/g, "]</code>");

	var ret = "<a href='po:setmsg/" + this.substr(0, this.indexOf(" - ")) + "' style='text-decoration:none;'>" + cmd + "</a> " + params + desc;

	return ret;
};

function getEmotes(force)
{
	if (force === undefined)
		force = false;
		
	if (sys.filesForDirectory(sys.getCurrentDir()).indexOf(emotesPath) === -1 || force)
	{
		if (emotesCheck)
			return;

		emotesCheck = true;
		setVal("emotes", "off");
		printMessage("Downloading emotes...");
		sys.webCall(emoteUrl, function (resp)
		{
			if (resp === "")
			{
				printMessage("Couldn't download emotes. Turning emotes off.");
				setVal("emotes", "off");
				return;
			}

			sys.writeToFile(emotesPath, resp);
			emotesData = resp;
			
			emotesList = "";
			
			var e = emotesData.replace(/\r/g, "").split("\n");

			for (var i = 0; i < e.length; i++)
			{
				emotesList += "<a href='po:appendmsg/:" + e[i].split("\\")[0] + ":'><img src='" + e[i].split("\\")[1] + "'></a> ";
			}
			
			printMessage("Emotes downloaded!");
			setVal("emotes", "on");
			emotesCheck = false;
		});
	}
}

String.prototype.withEmotes = function ()
{
	if (sys.filesForDirectory(sys.getCurrentDir()).indexOf(emotesPath) === -1)
	{
		getEmotes();
	}
	else
	{
		var e = emotesData.replace(/\r/g, "").split("\n");
		var ret = this;
		for (var i = 0; i < e.length; i++)
		{
			ret = ret.replace(new RegExp("\:" + e[i].split("\\")[0] + "\:", "gi"), "<img src='" + e[i].split("\\")[1] + "'>");
		}

		return ret;
	}
};

String.prototype.enriched = function ()
{
	var ret = this.replace(/(^|\s)\/(.+)\/($|\s)/g, "$1<i>$2</i>$3").replace(/(^|\s)_(.+)_($|\s)/g, "$1<u>$2</u>$3").replace(/(^|\s)\*(.+)\*($|\s)/g, "$1<b>$2</b>$3");
	return ret;
};

String.prototype.fixLinks = function ()
{
	var text = this;
	
	var words = text.split("  ");
	
	for (var w = 0; w < words.length; w++)
	{
		var word = words[w];
		if (word.length < 7)
		{
			continue;
		}
		
		var ind = word.indexOf(".");
		
		if (((cmp(word.substr(0, 7), "http://") && ind > 7) || (cmp(word.substr(0, 8), "https://")) && ind > 8)
			&& ind !== -1 && word.length > ind + 1)
		{
			words[w] = "<a href='" + word + "'>" + word + "</a>";
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
	print((cmp(getVal("emotes", "on"), "on") ? botHTML().withEmotes() : botHTML()) + " " + (cmp(getVal("emotes", "on"), "on") ? message.withEmotes() : message), channel);
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

Array.prototype.shuffle = function ()
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

Array.prototype.removeAt = function (ind)
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

Array.prototype.indexOf = function (item)
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

String.prototype.indexOf = function (str)
{
	if (str.length > this.length)
		return -1;
	if (cmp(str, this))
		return 0;

	for (var i = 0; i < this.length; i++)
	{
		if (cmp(this.substr(i, str.length), str))
			return i;
	}

	return -1;
};

function flashStyle(text)
{
	return "<i><span style='background:" + getVal("flashColour", "gold") + ";'>" + text + "</span></i><ping />";
}




function init()
{
	if (getVal("cmdSymbol", "::") === "::") // weird way to test if doesnt exist
	{
		sys.writeToFile(settingsPath, ""); // create file

		setVal("cmdSymbol", "~");
		setVal("botName", "Delibird");
		setVal("botColour", "red");
		
		setVal("auth0", "");
		setVal("auth1", "+");
		setVal("auth2", "+");
		setVal("auth3", "+");
		setVal("auth4", "");
	}

	if (sys.filesForDirectory(sys.getCurrentDir()).indexOf(emotesPath) === -1)
	{
		getEmotes();
	}
	else
	{
		emotesData = sys.getFileContent(emotesPath);

		emotesList = "";
		var e = emotesData.replace(/\r/g, "").split("\n");
	
		for (var i = 0; i < e.length; i++)
		{
			emotesList += "<a href='po:appendmsg/:" + e[i].split("\\")[0] + ":'><img src='" + e[i].split("\\")[1] + "'></a> ";
		}
	}

	client.printHtml(botHTML() + " Hey, you're running cool client scripts, guy!");
	client.printHtml(botHTML() + " Your command symbol is: <b>" + cs() + "</b>");
	checkForUpdate();
}




({

beforeSendMessage: function (message, channel)
{
	var m = message;

	if (m === "/~?")
	{
		printMessage("Your command symbol is: <b>" + cs() + "</b>");
	}
	else if (m.substr(0, cs().length) === cs() && acceptCommand)
	{
		sys.stopEvent();
		handleCommand(m.split(" ")[0].substr(cs().length), ((m.indexOf(" ") !== -1 && m.replace(/ /g, "").length < m.length) ? m.substr(m.indexOf(" ") + 1).split(";") : [undefined]), channel);
	}
	else if (m.substr(0, cs().length) === cs() && !acceptCommand)
	{
		sys.stopEvent();
		acceptCommand = true;
		handleCommand(m.split(" ")[0].substr(cs().length), ((m.indexOf(" ") !== -1 && m.replace(/ /g, "").length < m.length) ? m.substr(m.indexOf(" ") + 1).split(";") : [undefined]), channel);

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
beforeChannelMessage: function (message, channel, html)
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
		
		msg = msg.replace(/ /g, "  ");

		if (cmp(getVal("etext", "on"), "on"))
			msg = escapeHTML(msg).enriched();

		var cmd = "po:send/" + cs() + "lookup " + name;

		msg = msg.replace(/\//g, sep);
		
		msg = msg.replace(new RegExp("(^|\\s)(" + escapeHTML(client.ownName()) + ")($|\\s)", "gi"), flashStyle("$1$2$3"));

		var stalkwords = getVal("stalkwords", "");

		if (stalkwords !== "")
		{
			if (stalkwords.indexOf(sep) === -1)
			{
				stalkwords = [stalkwords];
			}
			else
			{
				stalkwords = stalkwords.split(sep);
			}

			for (var i = 0; i < stalkwords.length; i++)
			{
				msg = msg.replace(new RegExp("(^|\\s)(" + escapeHTML(stalkwords[i]) + ")($|\\s)", "gi"), flashStyle("$1$2$3"));
			}
		}

		if (getVal("emotes", "on") === "on")
			msg = msg.withEmotes();

		msg = msg.replace(new RegExp(sep, "g"), "/");

		if (msg.indexOf("http") !== -1)
			msg = msg.fixLinks();

		msg = msg.replace(/\<i\>\/(.+)\/\<\/i\>/g, "//$1//");

		print("<a href='" + cmd + "' style='text-decoration:none;'><font color='" + colour + "'><timestamp /> " + (client.auth(id) > 0 ? (getVal("emotes", "on") === "on" ? getVal("auth" + client.auth(id)).withEmotes() : getVal("auth" + client.auth(id))) + "<b><i>" + name + ":</i>" : getVal("auth0") + "<b>" + name + ":") + "</b></font></a> " + msg, channel);
	}

},
beforeChallengeReceived: function(challengeId, opponentId, tier, clauses)
{
	if (getVal("ignoreChals", "off") === "on")
	{
		sys.stopEvent();
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
		print(center(botHTML() + " Here's info for " + user + ":<br /><br /><img src='trainer:" + avatar + "'></img><h3><i><font color='" + client.color(id) + "'>" + user + "</font></i></h3><h4>" + "ID: " + client.id(user) + "<br />" + "Auth Level: " + client.auth(id) + "<br />" + "Ignoring?: " + (client.isIgnored(id) ? "Yes" : "No") + "<br />" + "Colour: <font color='" + client.color(id) + "'><b>" + client.color(id) + "</b></font> / " + htr + "<br />" + "Tiers: " + client.tiers(id).join(", ") + "<br />" + "Actions: <a href='po:pm/" + id + "'>PM</a>, <a href='po:info/" + id + "'>Challenge</a>" + (isPlayerBattling(id) ? ", <a href='po:watchplayer/" + id + "'>Watch Battle</a>" : "") + ", " + "<a href='po:ignore/" + id + "'>Toggle Ignore</a>, " // dont say ignore/unignore bc after you ignore 'toggle ignore' is still relevant
			+ "<a href='po:send/" + cs() + "ranking " + user + "'>View Rank</a>"

			+ "</h4>"));
		print("<hr>");
	}
	else if (command === "ranking")
	{
		if (data[0] === undefined)
		{
			acceptCommand = false;
			say("/ranking");
			return;
		}

		var id = client.id(data[0]);

		if (client.getTierList().indexOf(data[0]) !== -1)
		{
			acceptCommand = false;
			say("/ranking " + data[0]);
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
	else if (cmp(command, "setcommandsymbol") || cmp(command, "setcs"))
	{
		var symbol = data[0];

		if (symbol !== undefined && symbol.length === 1)
		{
			setVal("cmdSymbol", symbol);
			printMessage("Changed command symbol to: <b>" + symbol + "</b>");
		}
		else
		{
			printMessage("There was something wrong with the command symbol specified. Command symbols must be one character in length! <b>You've got more sense than that, " + client.ownName() + "!</b>");
		}
	}
	else if (command === "setbotname")
	{
		var name = data[0];

		if (name !== undefined && name.replace(/ /g, "").length > 0)
		{
			setVal("botName", name);
			printMessage("Call me " + botHTML(false, false, false) + "!");
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
			setVal("botColour", color);
			printMessage("Your colour was interpreted as: " + botHTML(false, false, false));
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
				print("<hr><br>" + botHTML() + " Here's all of the emotes:<br><br>" + emotesList + "<br><hr>");
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
			if (sys.filesForDirectory(sys.getCurrentDir()).indexOf(emotesPath) === -1)
			{
				getEmotes();
				return;
			}

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
		printMessage("Updating...");
		sys.webCall(scriptUrl, function (resp)
		{
			if (resp === undefined || resp === "")
			{
				printMessage("Couldn't update! Are you connected to the internet?");
				return;
			}

			printMessage("Updated! Backup at: " + sys.scriptsFolder + "backup.js");
			print("<hr><br>" + center("<h1><u>What's new?</u></h1><br>" + resp.substr(3, resp.substr(3).indexOf("//"))) + "<br><hr>");
			
			sys.writeToFile(sys.scriptsFolder + "backup.js", sys.getFileContent(sys.scriptsFolder + "scripts.js"));

			sys.changeScript(resp);
			sys.writeToFile(sys.scriptsFolder + "scripts.js", resp);

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
	else if (cmp(command, "setas") || cmp(command, "setauthsymbol"))
	{
		if (data[0] !== undefined && data[0].replace(/ /g, "").length > 0)
		{
			if (data.length === 1)
			{
				setVal("auth1", data[0]);
				setVal("auth2", data[0]);
				setVal("auth3", data[0]);
				printMessage("Auth 1-3 symbol changed to: " + data[0]);
			}
			else if (data[1].length > 0)
			{
				var p = parseInt(data[1]);
				
				if (p < 0 || p > 4 || p.toString() === "NaN")
				{
					printMessage("Auth levels are 0-4.");
					return;
				}
				
				setVal("auth" + p, data[0].toString());
				printMessage(data[1].toString() + "-level auth is now denoted by: " + data[0]);
			}
		}
		else
		{
			printMessage("<b>???</b>");
		}
	}
	else if (cmp(command, "clearas") || cmp(command, "clearauthsymbol"))
	{
		if (data[0] !== undefined)
		{
			var p = parseInt(data[0]);
				
				if (p < 0 || p > 4 || p.toString() === "NaN")
				{
					printMessage("Auth levels are 0-4.");
					return;
				}
				
			setVal("auth" + p, "");
			printMessage("Auth symbol for level-" + p + " auth was cleared!");
		}
	}
	else if (cmp(command, "setflashcolour") || cmp(command, "setflashcolor") || cmp(command, "setfc"))
	{
		if (data[0] === undefined)
		{
			printMessage("Set it to what?!?!? <b>COME ON!</b>");
			return;
		}

		setVal("flashColour", data[0]);
		printMessage("Flash colour changed, " + flashStyle(client.ownName()) + "!");
	}
	else if (cmp(command, "updateemotes"))
	{
		getEmotes(true);
	}
	else if (cmp(command, "ignorechals") || cmp(command, "ignorechallenges"))
	{
		if (data[0] === undefined || (!cmp(data[0], "off") && !cmp(data[0], "on")))
		{
			printMessage("What? <a href='po:send/" + cs() + "ignorechallenges on'>On</a> or <a href='po:/send/" + cs() + "ignorechallenges off'>off</a>?");
			return;
		}
		
		setVal("ignoreChals", data[0].toLowerCase());
		printMessage("Auto-ignore challenges was turned " + data[0].toLowerCase() + "!");
	}
	
	
	
	else
	{
		//printMessage("<b>" + cs() + command + "</b> is not a command! <a href='po:send/" + cs() + "commands'>View commands</a>");
		acceptCommand = false;
		say("/" + command);
	}
}
