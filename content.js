var config = document.createElement('script');
config.setAttribute('src', chrome.extension.getURL('config.js'));
document.head.appendChild(config);

var game = document.createElement('script');
game.setAttribute('src', chrome.extension.getURL('game.js'));
document.head.appendChild(game);