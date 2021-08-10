var members = [
	{
		"name": "Caio Almeida",
		"profileURI": "http://www.linkedin.com/in/caio-almeida-gama-77025449/",
		"skills": [
			"C",
			"Scrum",
			"Banco de dados",
			"Docker",
			"Camunda",
			"Azure",
			"AWS",
			"software",
			"DevOps",
			"Kubernetes"
		]
	},
	{
		"name": "Cristiano Campos",
		"profileURI": "http://www.linkedin.com/in/cristianocamposlima/",
		"skills": [
			"Software",
			"Desenvolvimento",
			"Dev",
			"SQL",
			"net",
			"C",
			"Java",
			"Gestão",
			"TI",
			"Service",
			"Microsoft"
		]
	},
	{
		"name": "Gabriel Moreira",
		"profileURI": "https://www.linkedin.com/in/gabriel-moreira-a43904193/",
		"skills": [
			"SQL",
			"net",
			"C",
			"Java",
			"git"
		]
	},
	{
		"name": "Luciano Carlos Jesus",
		"profileURI": "https://www.linkedin.com/in/luciano-carlos-b77b9b1a",
		"skills": [
			"SQL",
			"net",
			"C",
			"Java",
			"git"
		]
	},
	{
		"name": "Priscila Silva",
		"profileURI": "https://www.linkedin.com/in/priscilaosilva/",
		"skills": [
			"net",
			"C",
			"sql",
			"amazon",
			"apache",
			"splunk"
		]
	},
	{
		"name": "Raoni Alberto",
		"profileURI": "https://www.linkedin.com/in/raonialberto",
		"skills": [
			"F",
			"Liderança",
			"Dev",
			"SQL",
			"net",
			"C",
			"java",
			"db",
			"git",
			"python",
			"angular",
			"framework",
			"html"
		]
	},
	{
		"name": "Renã Pedroso",
		"profileURI": "https://www.linkedin.com/in/ren%C3%A3-carneiro-pedroso-711518187",
		"skills": [
			"sql",
			"db",
			"data",
			"dados",
			"python",
			"estatistica"
		]
	},
	{
		"name": "Renan Martins",
		"profileURI": "https://www.linkedin.com/in/renanmg",
		"skills": [
			"Dev",
			"SQL",
			"net",
			"C",
			"java",
			"git",
			"angular",
			"html"
		]
	},
	{
		"name": "Rodrigo Braga",
		"profileURI": "http://www.linkedin.com/in/rodrigo-luna-1459a88b/",
		"skills": [
			"SQL",
			"net",
			"C",
			"Java",
			"git"
		]
	},
	{
		"name": "Rodrigo Graf",
		"profileURI": "http://www.linkedin.com/in/rodrigo-graf-esguedelhado-15604448/",
		"skills": [
			"Estimativa",
			"Trabalho em Equipe",
			"C",
			"java",
			"sql",
			"MongoDB",
			"Azure DevOps",
			"net",
			"forms",
			"angular",
			"react",
			"team",
			"git",
			"jira",
			"confluence",
			"bitbucket"
		]
	},
	{
		"name": "Tiago Fernandes",
		"profileURI": "https://www.linkedin.com/in/tiagofcampos",
		"skills": [
			"SQL",
			"net",
			"C",
			"Java",
			"git"
		]
	},
	{
		"name": "Vinicius Aragao",
		"profileURI": "https://www.linkedin.com/in/vinicius-arag%C3%A3o-32b41973/",
		"skills": [
			"python",
			"node",
			"sql",
			"react",
			"java",
			"C",
			"software"
		]
	},
	{
		"name": "Vinicius Marchesini",
		"profileURI": "https://www.linkedin.com/in/vinicius-marchesini-de-oliveira-b418ba141",
		"skills": [
			"software",
			"azure",
			"itil",
			"SQL",
			"net",
			"C",
			"Java",
			"git",
			"projetos",
			"shell"
		]
	}
].sort( () => .5 - Math.random() );

var goTo = (tab, url) => new Promise(resolve => {
	chrome.tabs.update(tab.id, {url});
	chrome.tabs.onUpdated.addListener(function onUpdated(tabId, info) {
	  if (tabId === tab.id && info.status === 'complete') {
		chrome.tabs.onUpdated.removeListener(onUpdated);
		resolve();
	  }
	});
});
	// var goTo = (url) => {
		// let profileId = url.split('/in/')[1];
		// var app = Ember.A(Ember.Namespace.NAMESPACES)[1];
		// app.
		// __container__.lookup('router:main')
			// .transitionTo("/in/" + profileId + "?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAAouXEQBNQ9OqJ6GElaDDXVCDDDFRhOUSsA");
	// };
	
var receiveMessage = () => new Promise(resolve => {
	chrome.runtime.onMessage.addListener(
		function resolver(request, sender, sendResponse) {
			// console.log(request);
			// console.log(sender);
			chrome.runtime.onMessage.removeListener(resolver);
			resolve({data: request, sendResponse: sendResponse});
		}
	);
});
	
var setSkills = async (member) => {
	let sleep = (delay) => new Promise(resolve => {
		console.log('sleeping ' + delay + ' seconds...');
		setTimeout(() => {
			resolve();
		}, delay * 1000);
	});
	
	console.log('Scrolling to skills...');	
	for (let i = 1; i <= 4; i++) {
		await sleep(1);
		window.scrollTo(0, i * (document.body.scrollHeight / 5));
	}
	
	console.log('Showing more skills...');
	document.querySelectorAll(
		".pv-skills-section__additional-skills[aria-expanded=false]"
	).forEach(b => b.click());
	
	console.log('Analyzing buttons...');
	let allButtons = [...document.querySelectorAll(".pv-skill-entity__featured-endorse-button-shared:not(.pv-skill-entity__featured-endorse-button-shared--checked)")];
	
	console.log('Filtering buttons...');
	let buttons = allButtons.filter(b => {
		b.label = b.getAttribute("aria-label").split('skill:')[1];
		return member.skills.some(s =>
			b.label.toLowerCase().indexOf(s.toLowerCase()) > -1
		);
	});
	
	console.log('Clicking buttons...');	
	buttons.forEach(b => {
		console.log(b.getAttribute("aria-label"));
		b.click();
	});
	
	await sleep(2);
	
	chrome.runtime.sendMessage(
		buttons.map( b => b.label)
	);
};

var executeScriptAsync = (tab, data, action) => new Promise(async resolve => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		args: [data],
		function: action
	});
	let { data: result, sendResponse } = await receiveMessage();
	sendResponse();
	resolve(result);
});

var endorseProfile = (tab, member) => new Promise(async resolve => {
	console.log('Name: ' + member.name);
	console.log('Profile: ' + member.profileURI);
	console.log('Skills: ' + member.skills.join());
	await goTo(tab, member.profileURI);
	let result = await executeScriptAsync(tab, member, setSkills);
	resolve(result);
	console.log('New endorsements: ' + result.join());
});

var main = async (tab) => {
	for (var i = 1; i <= members.length; i++) {
		let member = members[i - 1];
		console.log(`${i}/${members.length}`);
		await endorseProfile(tab, member);
	};
	console.log('FIM.')
};

chrome.action.onClicked.addListener((t) => {
	chrome.tabs.create({}, (tab) => main(tab));
});