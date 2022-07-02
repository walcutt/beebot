require('dotenv').config();

const { Client, Intents } = require('discord.js');
let intents = new Intents();
intents.add(Intents.FLAGS.GUILDS);
intents.add(Intents.FLAGS.GUILD_MESSAGES);
const client = new Client({ intents: intents });

var fs = require('fs');

const on_command = 'activate order bee';

const off_command = 'kill the bee';

const interval = 2000;

const script_file = 'bee-movie.txt';

var active_channels = [];

var script = [];

let worker = (channel, line) => (
	() => {
			if(active_channels.includes(channel)) {
				channel.send(script[line]);
				//console.log(script[line]);
				if(line + 1 < script.length) {
					setTimeout(worker(channel, line + 1), interval);
				}
			}
	}
);

function enqueue(message) {
	channel = message.channel;

	if(active_channels.includes(channel)) {
		return;
	}
	active_channels.push(message.channel);

	worker(message.channel, 0)();
}

function dequeue(message) {
	active_channels = active_channels.filter((channel) => {
		channel != message.channel
	});
}

client.on('messageCreate', (message) => {

	if(message.author === client.user) {
	    return;
	}

	if(message.content.toLowerCase().includes(on_command)) {
	    //send message
			enqueue(message);
	} else if(message.content.toLowerCase().includes(off_command)){
			dequeue(message)
	}
});

//parse bee movie script here.

var script_raw = fs.readFileSync(script_file, 'utf-8');

var lines = script_raw.split('\n');

script = lines.filter((line) => line !== '');

//enqueue({channel: {}});

const bot_token = process.env.TOKEN;

client.login(bot_token);
