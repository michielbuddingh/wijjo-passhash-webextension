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

get_active.then(function(tabs) {
    siteTag.value = getDomain(tabs[0].url);
});

var loadOptions = browser.storage.local.get("passhash_options");
loadOptions.then((result) => {
	var version = result.passhash_options.optionsVersion;

	generatedSize = result.passhash_options.generatedSize;
	atLeastOneDigit = result.passhash_options.atLeastOneDigit;
	atLeastOnePunctuationCharacter = result.passhash_options.atLeastOnePunctuationCharacter;
	bothUpperAndLowerCaseLetters = result.passhash_options.bothUpperAndLowerCaseLetters;
	noSpecialCharacters = result.passhash_options.noSpecialCharacters;
	digitsOnly = result.passhash_options.digitsOnly;
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
	console.log(generated.value);
	generated.select();
	document.execCommand("Copy");
};

bumpButton.onclick = function() {
	siteTag.value = bumpSiteTag(siteTag.value);
};
