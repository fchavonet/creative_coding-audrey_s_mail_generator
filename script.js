/*******************
* EMAIL GENERATION *
*******************/

function generateEmails() {
	// Retrieve and clean input values.
	const firstNameInput = document.getElementById("first-name-input");
	const lastNameInput = document.getElementById("last-name-input");
	const companyNameInput = document.getElementById("company-name-input");
	const placeholder = document.getElementById("placeholder");
	const output = document.getElementById("output");

	const firstName = firstNameInput.value.trim().toLowerCase();
	const lastName = lastNameInput.value.trim().toLowerCase();
	const company = companyNameInput.value.trim().toLowerCase();

	// If any field is empty, display error placeholder and hide result.
	if (firstName === "" || lastName === "" || company === "") {
		output.classList.add("hidden");
		placeholder.textContent = "⚠️ Merci de remplir prénom, nom et entreprise.";
		placeholder.classList.remove("hidden");
		return;
	}

	// Break company name into words, ignoring punctuation.
	const companyWords = company.replace(/[^\w\s]/g, "").split(/\s+/);
	const domainVariants = buildDomainVariants(companyWords);
	const nameVariants = buildNameVariants(firstName, lastName);

	let emailsOutput = "";

	// Loop through each domain variant and generate complete email addresses.
	for (let i = 0; i < domainVariants.length; i++) {
		const domain = domainVariants[i];

		emailsOutput += "\n<span> → " + domain + "</span>\n\n";

		for (let j = 0; j < nameVariants.length; j++) {
			emailsOutput += nameVariants[j] + "@" + domain + "\n";
		}
	}

	// Hide placeholder and display the generated email list with a fade-in effect.
	placeholder.classList.add("hidden");
	output.innerHTML = emailsOutput.trim();
	output.classList.remove("hidden");
}


/**************************
* DOMAIN VARIANTS BUILDER *
**************************/

function buildDomainVariants(words) {
	const domainVariants = [];

	// List of TLDs to test.
	const tlds = [".com", ".eu", ".fr"];

	if (words.length >= 1) {
		// Create various combinations based on the company name words.
		const joinedWords = words.join("");
		const dashedWords = words.join("-");
		const underscoreWords = words.join("_");

		// Build initials from each word (e.g., "holberton school" -> "hs")
		let initials = "";
		for (let i = 0; i < words.length; i++) {
			initials += words[i].charAt(0);
		}

		// If there is only one word, test the base domain with all TLDs.
		if (words.length === 1) {
			const baseDomain = words[0];

			for (let i = 0; i < tlds.length; i++) {
				domainVariants.push(baseDomain + tlds[i]);
			}
		} else {
			// For multi-word company names, create a list of candidate domain base names.
			var candidateDomains = [];
			candidateDomains.push(joinedWords);
			candidateDomains.push(dashedWords);
			candidateDomains.push(underscoreWords);
			candidateDomains.push(words[0]);
			candidateDomains.push(words[1]);
			candidateDomains.push(initials);

			// Loop through each candidate and test with each TLD.
			for (let i = 0; i < candidateDomains.length; i++) {
				for (let j = 0; j < tlds.length; j++) {
					domainVariants.push(candidateDomains[i] + tlds[j]);
				}
			}
		}
	}

	return domainVariants;
}


/************************
* NAME VARIANTS BUILDER *
************************/

function buildNameVariants(firstName, lastName) {
	const nameVariants = [];

	// Basic names, reversed orders, and concatenations.
	nameVariants.push(firstName);
	nameVariants.push(lastName);
	nameVariants.push(firstName + lastName);
	nameVariants.push(lastName + firstName);
	nameVariants.push(firstName + "." + lastName);
	nameVariants.push(lastName + "." + firstName);
	nameVariants.push(firstName + "_" + lastName);
	nameVariants.push(lastName + "_" + firstName);

	// Variants that use initials.
	nameVariants.push(firstName.charAt(0) + lastName);
	nameVariants.push(firstName + lastName.charAt(0));
	nameVariants.push(firstName.charAt(0) + "." + lastName);
	nameVariants.push(firstName.charAt(0) + "_" + lastName);
	nameVariants.push(firstName.charAt(0) + lastName.charAt(0));

	// Hyphenated variations.
	nameVariants.push(firstName + "-" + lastName);
	nameVariants.push(lastName + "-" + firstName);

	return nameVariants;
}


/***********************
* COPY EMAILS FUNCTION *
***********************/
function copyEmails() {
	const output = document.getElementById("output");
	const rawResultText = output.innerText;
	const textLines = rawResultText.split("\n");
	const emailLines = [];

	// Filter lines that contain "@" and exclude lines with "→".
	for (let i = 0; i < textLines.length; i++) {
		const currentLine = textLines[i];

		if (currentLine.indexOf("@") !== -1 && currentLine.indexOf("→") === -1) { emailLines.push(currentLine); }
	}

	const emailsToCopy = emailLines.join(" ");

	// Use the Clipboard API only.
	navigator.clipboard.writeText(emailsToCopy)
		.then(function () {
			alert("Email addresses have been copied!");
		})
		.catch(function (error) {
			console.error("Copy failed: ", error);
			alert("Error copying to clipboard.");
		});
}
