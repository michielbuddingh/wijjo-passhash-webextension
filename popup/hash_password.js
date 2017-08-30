/* This Source Code Form is subject to the terms of the Mozilla Public
/* License, v. 2.0. If a copy of the MPL was not distributed with this
/* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const masterKeyInput = document.querySelector("#masterkey");
const siteTag = document.querySelector("#sitetag");
const generated = document.querySelector("#generated");
const optionsButton = document.querySelector("#options");
const wipeAndClose = document.querySelector("#wipe-and-close");
const copyToClipboard = document.querySelector("#copy-to-clipboard");
const bumpButton = document.querySelector("#bump");

var get_active = browser.tabs.query({ active : true, currentWindow : true });
get_active.then(function(tabs) {
    siteTag.value = getDomain(tabs[0].url);
});

masterKeyInput.oninput = function() {
	generated.value = generateHashWord(
		siteTag.value,
		masterKeyInput.value,
		8,
		true,
		true,
		true);
};


optionsButton.onclick = function() {
	browser.runtime.openOptionsPage();
};

wipeAndClose.onclick = function() {
	masterKeyInput.value = "";
	generated.value = " ";
	generated.select();
	document.execCommand("Copy");
	window.close();
};

copyToClipboard.onclick = function() {
	console.log(generated.value);
	generated.select();
	document.execCommand("Copy");
};

bumpButton.onclick = function() {

};
