var showProgress = async (member, index, total) => {
    let progress = parseInt((index/total)*100);
	let text = `Nome: ${member.name}
Perfil: ${member.profileURI}
Competencias: ${member.skills.join()}.`
    
    console.log(`${index}/${total}`);
    console.log(text);
    
	if(this.notificationHandler)
        chrome.notifications.clear(this.notificationHandler);
    
    this.notificationHandler = await chrome.notifications.create('', {
        title: 'BraDev',
        message: text,
        iconUrl: '/icon128.png',  type: 'progress',
        progress: progress, silent: true
	}, (handler) => this.notificationHandler = handler);
};

var goTo = (tab, url) => new Promise(resolve => {
    chrome.tabs.update(tab.id, {
        url
    });
    chrome.tabs.onUpdated.addListener(function onUpdated(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(onUpdated);
            resolve();
        }
    });
});

var receiveMessage = () => new Promise(resolve => {
    chrome.runtime.onMessage.addListener(
        function resolver(request, sender, sendResponse) {
            // console.log(request);
            // console.log(sender);
            chrome.runtime.onMessage.removeListener(resolver);
            resolve({
                data: request,
                sendResponse: sendResponse
            });
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
        b.label = b.getAttribute("aria-label").split(':')[1];
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
        buttons.map(b => b.label)
    );
};

var executeScriptAsync = (tab, data, action) => new Promise(async resolve => {
    chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        args: [data],
        function: action
    });
    let {
        data: result,
        sendResponse
    } = await receiveMessage();
    sendResponse();
    resolve(result);
});

var endorseProfile = (tab, member) => new Promise(async resolve => {
    await goTo(tab, member.profileURI);
    let result = await executeScriptAsync(tab, member, setSkills);
    resolve(result);
    console.log(`Novas competencias: ${result.join()}.`);
});

var loadMembers = async () => {
    const uri = 'https://raw.githubusercontent.com/camposdelima/bradev-linkedin-endorsements/main/members.json';
    let response = await fetch(uri);
    let members = await response.json();

    return members.sort(() => .5 - Math.random());
}

var main = async (tab) => {
    let members = await loadMembers();

    for (var i = 1; i <= members.length; i++) {
        let member = members[i - 1];
        showProgress(member, i, members.length);
        await endorseProfile(tab, member);
    };

    console.log('FIM.')
    info("Recomendação de competências finalizada!");
};

chrome.action.onClicked.addListener(async (t) => {
	chrome.tabs.create({}, (tab) => main(tab));
});