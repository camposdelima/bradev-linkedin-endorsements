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
    console.log('Name: ' + member.name);
    console.log('Profile: ' + member.profileURI);
    console.log('Skills: ' + member.skills.join());
    await goTo(tab, member.profileURI);
    let result = await executeScriptAsync(tab, member, setSkills);
    resolve(result);
    console.log('New endorsements: ' + result.join());
});

var loadMembers = async () => {
    const uri = 'https://raw.githubusercontent.com/camposdelima/bradev-linkedin-endorsements/develop/members.json';
    let response = await fetch(uri);
    let members = await response.json();

    return members.sort(() => .5 - Math.random());
}

var main = async (tab) => {
    let members = await loadMembers();

    for (var i = 1; i <= members.length; i++) {
        let member = members[i - 1];
        console.log(`${i}/${members.length}`);
        await endorseProfile(tab, member);
    };

    console.log('FIM.')
};

chrome.action.onClicked.addListener(async (t) => {
    chrome.tabs.create({}, (tab) => main(tab));
});