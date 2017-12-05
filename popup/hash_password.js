/* This Source Code Form is subject to the terms of the Mozilla Public
/* License, v. 2.0. If a copy of the MPL was not distributed with this
/* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* constants sections */

const settingsDefaults = {
	optionsVersion : 1,
	generatedSize : 8,
	atLeastOneDigit : true,
	atLeastOnePunctuationCharacter : true,
	bothUpperAndLowerCaseLetters : true,
	noSpecialCharacters : false,
	digitsOnly : false
};

/* document elements section */

// generator panel
const generatorPanel = document.querySelector("#generator");

const masterKeyInput = document.querySelector("#masterkey");
const siteTag = document.querySelector("#sitetag");
const generated = document.querySelector("#generated");
const siteSettingsButton = document.querySelector("#site-settings");
const wipeAndClose = document.querySelector("#wipe-and-close");
const copyToClipboard = document.querySelector("#copy-to-clipboard");
const bumpButton = document.querySelector("#bump");

// site settings panel
const siteSettingsPanel = document.querySelector("#site_settings");
const settingsSiteTag = document.querySelector("#settings-sitetag");
const generatedSize = document.querySelector("#generated-size");
const atLeastOneDigit = document.querySelector("#at-least-one-digit");
const atLeastOnePunctuationCharacter = document.querySelector("#at-least-one-punctuation-character");
const bothUpperAndLowerCaseLetters = document.querySelector("#both-upper-and-lower-case-letters");
const noSpecialCharacters = document.querySelector("#no-special-characters");
const digitsOnly = document.querySelector("#digits-only");

const goBackButton = document.querySelector("#go-back");
const saveSiteOptionsButton = document.querySelector("#save-site-options");

/* end document elements section */

/* utility functions section */

function getSettingsFields() {
	let options = {};
	options.optionsVersion = settingsDefaults.optionsVersion;
	options.siteTag = siteTag.value;
	options.generatedSize = generatedSize.value;
	options.atLeastOneDigit = atLeastOneDigit.checked;
	options.atLeastOnePunctuationCharacter = atLeastOnePunctuationCharacter.checked;
	options.bothUpperAndLowerCaseLetters = bothUpperAndLowerCaseLetters.checked;
	options.noSpecialCharacters = noSpecialCharacters.checked;
	options.digitsOnly = digitsOnly.checked;
	return options;
};

function setSettingsFields(options) {
	if ("siteTag" in options) {
		siteTag.value = options.siteTag;
		settingsSiteTag.value = options.siteTag;
	}
	if ("generatedSize" in options) {
		generatedSize.value = options.generatedSize;
	}
	if ("atLeastOneDigit" in options) {
		atLeastOneDigit.checked = options.atLeastOneDigit;
	}
	if ("atLeastOnePunctuationCharacter" in options) {
		atLeastOnePunctuationCharacter.checked = options.atLeastOnePunctuationCharacter;
	}
	if ("bothUpperAndLowerCaseLetters" in options) {
		bothUpperAndLowerCaseLetters.checked = options.bothUpperAndLowerCaseLetters;
	}
	if ("noSpecialCharacters" in options) {
		noSpecialCharacters.checked = options.noSpecialCharacters;
	}
	if ("digitsOnly" in options) {
		digitsOnly.checked = options.digitsOnly;
	}
}

/* event handler section */

masterKeyInput.oninput = function() {
	generated.value = generateHashWord(
		siteTag.value,
		masterKeyInput.value,
		generatedSize.value,
		atLeastOneDigit.checked,
		atLeastOnePunctuationCharacter.checked,
		bothUpperAndLowerCaseLetters.checked,
		noSpecialCharacters.checked,
		digitsOnly.checked
	);
};

// keep siteTag and settingsSiteTag fields in sync
siteTag.oninput = function() {
	settingsSiteTag.value = siteTag.value;
};

settingsSiteTag.oninput = function() {
	siteTag.value = settingsSiteTag.value;
};


siteSettingsButton.onclick = function() {
	generatorPanel.classList.add("notshown");
	siteSettingsPanel.classList.remove("notshown");
};

goBackButton.onclick = function() {
	generatorPanel.classList.remove("notshown");
	siteSettingsPanel.classList.add("notshown");
};

wipeAndClose.onclick = function() {
	masterKeyInput.value = "";
	generated.value = " ";
	generated.select();
	document.execCommand("copy");
	window.close();
};

copyToClipboard.onclick = function() {
	generated.select();
	document.execCommand("copy");
};


// saveLock prevents bumping and options saving from interleaving
var saveLock = false;

saveSiteOptionsButton.onclick = function() {
	if (saveLock) {
		return;
	}
	saveLock = true;
	let settings = getSettingsFields;
	browser.tabs.query({ active : true, currentWindow : true }).then((tabs) => {
		let domain = getDomain(tabs[0].url);
		let storageKey = "domaindata#" + domain;
		let settings = {};
		settings[storageKey] = getSettingsFields();
		browser.storage.local.set(settings).then((success) => {
			saveLock = false;
			generatorPanel.classList.remove("notshown");
			siteSettingsPanel.classList.add("notshown");
		});
	});
};

bumpButton.onclick = function() {
	if (saveLock) {
		return;
	}
	saveLock = true;
	browser.tabs.query({ active : true, currentWindow : true }).then((tabs) => {
		let domain = getDomain(tabs[0].url);
		let storageKey = "domaindata#" + domain;
		let settings = {};
		let bumped = bumpSiteTag(siteTag.value);
		settings[storageKey] = getSettingsFields();
		settings[storageKey].siteTag = bumped;
		browser.storage.local.set(settings).then((success) => {
			siteTag.value = bumped;
			settingsSiteTag.value = bumped;
			saveLock = false;
		});
	});
};


/* end event handler section */

/* initialization section */

var loadOptions = browser.storage.local.get("passhash_options");

// load the general options for all sites
loadOptions.then((results) => {
	let passhash_options = Object.assign({}, settingsDefaults, results.passhash_options);
	let version = passhash_options.optionsVersion;
	setSettingsFields(passhash_options);
});

var get_active = browser.tabs.query({ active : true, currentWindow : true });

get_active.then((tabs) => {
	let domain = getDomain(tabs[0].url);
	let storageKey = "domaindata#" + domain;
	browser.storage.local.get(storageKey).then(
		(results) => {
			if (results[storageKey]) { // && results[storageKey].siteTag) {
				results[storageKey].siteTag = results[storageKey]["siteTag"] || domain;
				setSettingsFields(results[storageKey]);
			} else {
				siteTag.value = domain;
				settingsSiteTag.value = domain;
			}
		},
		(notstored) => {
			siteTag.value = domain;
			settingsSiteTag.value = siteTag.value;
		}
	);
});

/* end initialization section */
