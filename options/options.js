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
		var version = result.passhash_options.optionsVersion || currentOptionsVersion;
		generatedSize.value = result.passhash_options.generatedSize || 8;
		atLeastOneDigit.checked = result.passhash_options.atLeastOneDigit || true;
		atLeastOnePunctuationCharacter.checked = result.passhash_options.atLeastOnePunctuationCharacter || true;
		bothUpperAndLowerCaseLetters.checked = result.passhash_options.bothUpperAndLowerCaseLetters || true;
		noSpecialCharacters.checked = result.passhash_options.noSpecialCharacters || false;
		digitsOnly.checked = result.passhash_options.digitsOnly || false;
	});
}

function storeOptions() {
	var options = {};
	options.optionsVersion = currentOptionsVersion;
	options.generatedSize = generatedSize.value;
	options.atLeastOneDigit = atLeastOneDigit.checked;
	options.atLeastOnePunctuationCharacter = atLeastOnePunctuationCharacter.checked;
	options.bothUpperAndLowerCaseLetters = bothUpperAndLowerCaseLetters.checked;
	options.noSpecialCharacters = noSpecialCharacters.checked;
	options.digitsOnly = digitsOnly.checked;
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
