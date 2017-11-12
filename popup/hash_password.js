/* This Source Code Form is subject to the terms of the Mozilla Public
/* License, v. 2.0. If a copy of the MPL was not distributed with this
/* file, You can obtain one at http://mozilla.org/MPL/2.0/. */


// input elements
const masterKeyInput = document.querySelector("#masterkey");
const siteTag = document.querySelector("#sitetag");
const generated = document.querySelector("#generated");
const optionsButton = document.querySelector("#options");
const wipeAndClose = document.querySelector("#wipe-and-close");
const copyToClipboard = document.querySelector("#copy-to-clipboard");
const bumpButton = document.querySelector("#bump");

// global variables

var generatedSize = 8;
var atLeastOneDigit = true;
var atLeastOnePunctuationCharacter = true;
var bothUpperAndLowerCaseLetters = true;
var noSpecialCharacters = false;
var digitsOnly = false;

var get_active = browser.tabs.query({ active : true, currentWindow : true });

get_active.then((tabs) => {
	let domain = getDomain(tabs[0].url);
	let storageKey = "domaindata#" + domain;
	browser.storage.local.get(storageKey).then(
		(results) => {
			if (results[storageKey].siteTag) {
				siteTag.value = results[storageKey].siteTag;
			} else {
				siteTag.value = domain;
			}
		},
		(notstored) => {
			siteTag.value = domain;
		}
	);
});

var loadOptions = browser.storage.local.get("passhash_options");
loadOptions.then((results) => {
	let version = results.passhash_options.optionsVersion;
	generatedSize.value = results.passhash_options.generatedSize || 8;
	atLeastOneDigit.checked = results.passhash_options.atLeastOneDigit || true;
	atLeastOnePunctuationCharacter.checked = results.passhash_options.atLeastOnePunctuationCharacter || true;
	bothUpperAndLowerCaseLetters.checked = results.passhash_options.bothUpperAndLowerCaseLetters || true;
	noSpecialCharacters.checked = results.passhash_options.noSpecialCharacters || false;
	digitsOnly.checked = results.passhash_options.digitsOnly || false;
});



masterKeyInput.oninput = function() {
	generated.value = generateHashWord(
		siteTag.value,
		masterKeyInput.value,
		generatedSize,
		atLeastOneDigit,
		atLeastOnePunctuationCharacter,
		bothUpperAndLowerCaseLetters,
		noSpecialCharacters,
		digitsOnly
	);
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
	generated.select();
	document.execCommand("Copy");
};

var bumping = false;

bumpButton.onclick = function() {
	if (bumping) {
		return;
	}
	bumping = true;
	browser.tabs.query({ active : true, currentWindow : true }).then((tabs) => {
		let domain = getDomain(tabs[0].url);
		let storageKey = "domaindata#" + domain;
		let siteTags = {};
		let bumped = bumpSiteTag(siteTag.value);
		siteTags[storageKey] = { "siteTag" : bumped };
		browser.storage.local.set(siteTags).then((success) => {
			siteTag.value = bumped;
			bumping = false;
		});
	});
};
