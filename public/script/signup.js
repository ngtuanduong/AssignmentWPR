
"use strict";
(function () {

    const API_URL = '/signup';
    window.addEventListener("load", init);


    function init() {
        let submitBtn = qs("button");
        submitBtn.addEventListener("click", login);

        let nameInput = id("fullname");
        let emailInput = id("email");
        let passwordInput = id("password");
        let confirmPassInput = id("confirmPassword");

        nameInput.addEventListener("blur", validateName);
        emailInput.addEventListener("blur", validateEmail);
        passwordInput.addEventListener("blur", validatePassword);
        confirmPassInput.addEventListener("blur", validateConfirmPassword);
    }

    async function login(e) {
        e.preventDefault();
        if (!formValidation()) {
            id('signUpSuc').innerHTML = '';
            id('signUpErr').innerHTML = 'Please check all information';
        } else {
            let name = id("fullname").value;
            let email = id("email").value;
            let password = id("password").value;
            let res = await fetch(API_URL, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: name,
                    email: email,
                    password: password
                })
            });
            res = await res.json();

            if (res.success) {
                id('signUpErr').innerHTML = '';
                id('signUpSuc').innerHTML = 'Sign up successfully!';
            } else {
                id('signUpSuc').innerHTML = '';
                id('signUpErr').innerHTML = 'Email is already used';
            }
        }
    }

    function formValidation() {
        return validateName() && validateEmail() && validatePassword() && validateConfirmPassword();
    }

    function validateName() {
        let name = id("fullname").value;
        let nErr = id("nameErr");
        let testNameRes = name.length >= 3;
        testNameRes ? nErr.innerHTML = "" : nErr.innerHTML = "Name required al least 3 character";
        return testNameRes;
    }

    function validateEmail() {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let email = id("email").value;
        let eErr = id("emailErr")
        let testResult = emailPattern.test(email);
        testResult ? eErr.innerHTML = "" : eErr.innerHTML = "Email invalid";
        return testResult;
    }

    function validatePassword() {
        const passwordPattern = /^[a-zA-Z\d!@#$%^&*]{6,}$/;
        let password = id("password").value;
        let pErr = id("passwordErr");
        let testPassRes = passwordPattern.test(password);
        testPassRes ? pErr.innerHTML = "" : pErr.innerHTML = "Password must include minimum 6 characters";
        return testPassRes;
    }

    function validateConfirmPassword() {
        let confirmPassword = id("confirmPassword").value;
        let password = id("password").value;
        let err = id("confirmPasswordErr");
        let testPassConfRes = confirmPassword == password;
        testPassConfRes ? err.innerHTML = "" : err.innerHTML = "Password must match";
        return testPassConfRes;
    }

    function id(id) {
        return document.getElementById(id);
    }

    function qs(selector) {
        return document.querySelector(selector);
    }
})();
