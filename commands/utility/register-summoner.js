const {SlashCommandBuilder} = require('discord.js');
const puppeteer = require('puppeteer-extra');
const userAgent = require('user-agents');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

module.exports = {
	data : new SlashCommandBuilder()
		.setName('reg')
		.setDescription('Provides information about the user.')
		.addStringOption(server =>
			server.setName('server1')
				.setDescription('Your server')
				.setRequired(true))
		.addStringOption(summoner => 
			summoner.setName('summoner1')
				.setDescription('Your sn')
				.setRequired(true))
		.addStringOption(tag => 
			tag.setName('tag1')
				.setDescription('Your tag')
				.setRequired(true)),
	async execute(interaction) {
		const browser = await puppeteer.launch({
			isMobile:false
			// devtools:true
		});
		const page = await browser.newPage();
		const server = interaction.options.getString('server1');
		let summoner = interaction.options.getString('summoner1');
		let sn_format = (summoner.replace(' ','%20'));
		const tag = interaction.options.getString('tag1');
		// await page.setUserAgent(userAgent.random().toString())
		await page.goto(`https://www.op.gg/summoners/${server}/${summoner}-${tag}`);
		let elementHandle;
		let level = '';
		try {
			const scriptId = '#content-header';
			elementHandle = await page.$('#content-header');
			if (elementHandle === null){
				throw new Error('Element with specified ID not found.');
			}
			// // Operations if no error
			console.log('Retrieved with success')
			const value = await elementHandle.evaluate(el => el.textContent, elementHandle[1]);
			for (let i = 0; i < 5; i++){
				// console.log(value[i]);
				if (value[i] >= '0' && value[i] <= '9'){
					// console.log('digit added');
					level = level.concat(value[i]);	
				}else break;
			}
			console.log(`${level}`)
		
			
		} catch(error){
			console.error('Error during element retieval:', error.message);
		}
		await browser.close();
		await interaction.reply(`${interaction.user.username} is level ${level} in league`);
		
	},
};
