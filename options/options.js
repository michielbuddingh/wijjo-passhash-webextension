/* This Source Code Form is subject to the terms of the Mozilla Public
/* License, v. 2.0. If a copy of the MPL was not distributed with this
/* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// optionsVersion is not the same as the plugin version, it changes only when the
// options structure changes.
const currentOptionsVersion = 1.0;
const generatedSize = document.querySelector("#generated-size");
const atLeastOneDigit = document.querySelector("#at-least-one-digit");
const atLeastOnePunctuationCharacter = document.querySelector("#at-least-one-punctuation-character");
const bothUpperAndLowerCaseLetters = document.querySelector("#both-upper-and-lower-case-letters");
const noSpecialCharacters = document.querySelector("#no-special-characters");
const digitsOnly = document.querySelector("#digits-only");


function restoreOptions() {
	var loadOptions = browser.storage.local.get("passhash_options");
	loadOptions.then((result) => {
		console.log(result);
		var version = result.passhash_options.optionsVersion || currentOptionsVersion;
		generatedSize.value = result.passhash_options.generatedSize || 8;
		atLeastOneDigit.value = result.passhash_options.atLeastOneDigit || false;
		atLeastOnePunctuationCharacter.value = result.passhash_options.atLeastOnePunctuationCharacter || false;
		bothUpperAndLowerCaseLetters.value = result.passhash_options.bothUpperAndLowerCaseLetters || false;
		noSpecialCharacters.value = result.passhash_options.noSpecialCharacters || false;
		digitsOnly.value = result.passhash_options.digitsOnly || false;
	});
}

function storeOptions() {
	var options = {};
	options.optionsVersion = currentOptionsVersion;
	options.generatedSize = generatedSize.value;
	options.atLeastOneDigit = atLeastOneDigit.value;
	options.atLeastOnePunctuationCharacter = atLeastOnePunctuationCharacter.value;
	options.bothUpperAndLowerCaseLetters = bothUpperAndLowerCaseLetters.value;
	options.noSpecialCharacters = noSpecialCharacters.value;
	options.digitsOnly = digitsOnly.value;
	console.log(options);
	browser.storage.local.set({
		"passhash_options" : options
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
generatedSize.onchange = storeOptions;
atLeastOneDigit.onchange = storeOptions;
atLeastOnePunctuationCharacter.onchange = storeOptions;
bothUpperAndLowerCaseLetters.onchange = storeOptions;
noSpecialCharacters.onchange = storeOptions;
digitsOnly.onchange = storeOptions;
