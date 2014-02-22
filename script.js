	/* ***************************************************** */
	/* ********* YOU'LL NEVER AMOUNT TO ANYTHING *********** */
	/* ***************************************************** */

	var settingsPath = "CSSettings.txt";


	// commands format: command [param1] [param2] - desc
	// params not required obv

	var commands = [ "lookup [name] - Displays information about a user" ];


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
		var params = "<i>" + this.substr(this.split(" ")[0].length).split(" - ")[0] + "</i>";
		var desc = this.substr(this.indexOf(" - "));
			
		return cmd + " " + params + desc;
	};


	function isPlayerBattling(id)
	{
		if (client.player == null)
		{
		  return false;
		}
		
		return (client.player(id).flags & (1 << 2)) > 0;
	  };

	function printMessage(message, channel)
	{
		if (channel === undefined)
		{
			channel = client.currentChannel();
		}
		
		client.printChannelMessage("<font color='" + getVal("botColour") + "'><timestamp /><b>±" + getVal("botName") + ":</font></b> " + message, channel, true);
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
	}

	})

	function handleCommand(command, data, channel)
	{
		if (command === "commands")
		{
			printMessage("<b><u>Commands:</u></b>");
			var cs = getVal("cmdSymbol");
			
			for (var i = 0; i < commands.length; i++)
			{
				printMessage((cs + commands[i]).parseCmdDesc());
			}
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
			
			printMessage("<b><u>" + user + "'s info</u></b>");
			printMessage("ID: " + client.id(user));
			printMessage("Auth Level: " + client.auth(id));
			printMessage("Ignoring?: " + (client.isIgnored(id) ? "Yes" : "No"));
			printMessage("Colour: <font color='" + client.color(id) + "'><b>" + client.color(id));
			printMessage("Tiers: " + client.tiers(id).join(", "));
			printMessage("Actions: <a href='po:pm/" + id + "'>PM</a>, <a href='po:info/" + id + "'>Challenge</a>" 
				+ (isPlayerBattling(id) ? ", <a href='po:watchplayer/" + id + "'>Watch Battle</a>" : ""));
			// actions: startpm, see ranking, see info
		}
	}












