function isFormValid(): boolean {
	var password : HTMLInputElement = document.getElementById("capassword") as HTMLInputElement;
	var cpassword : HTMLInputElement = document.getElementById("cacpassword") as HTMLInputElement;
	if(password.value != cpassword.value) {
		var msg = document.getElementById("inc_pass") as HTMLParagraphElement;
		msg.style.visibility = "visible";
		msg.textContent = "Passwords must match";
		return false;
	} else {
		return true;
	}
}

function setText(): void {
	var urlParams = new URLSearchParams(window.location.search);
	var incPass = (document.querySelector("#inc_pass") as HTMLParagraphElement);

	if(urlParams.has("code")) {
		if(urlParams.get("code") == "1") {
			incPass.textContent = "Username or password is incorrect";
		} else if(urlParams.get("code") == "2") {
			incPass.textContent = "An error occured, try again";
		} else if(urlParams.get("code") == "3") {
			incPass.textContent = "An account with that email already exists";
		} else if(urlParams.get("code") == "4") {
			incPass.textContent = "Password must be at least 8 characters, and have one uppercase letter, one lowercase letter, a number, and a special character (?,!,#,$)";
		} else if(urlParams.get("code") == "5") {
			incPass.textContent = "Account activation failed";
		} else if(urlParams.get("code") == "69") {
			incPass.textContent = "haha funny number";
		} else {
			incPass.textContent = "messing with the url you are";
		}
		incPass.style.visibility = "visible";
	}
}