

function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            window.location.href = `/profile`;
        } else if (this.readyState === 4) {
            document.getElementById("warning").innerHTML = this.response;
        }
    };
    if (email && password) {
        xhttp.open("POST", '/api/users/login', true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({
            email: email,
            password: password
        }));
    } else {
        alert("Required field is empty.");
    }
}

function signup() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("password2").value;
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;

    // validate password
    let password_length = password.length;
    let upper_case = /[A-Z]/;
    let lower_case = /[a-z]/;
    let numbers = /[0-9]/;
    // specialChars doesn't work with '\'
    let special_chars = "`~!@#$%^&*()_+-={}|[]\\:\";'<>?,./";

    // assume password does not contain any special characters
    let check_special_chars = false;

    // if password does contain a special character
    for (let i = 0; i < password_length; i++){
        if(special_chars.includes(password.charAt(i))){
            check_special_chars = true;
            break;
        }
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            window.location.href = `/profile`;
        } else if (this.status === 400) {
            document.getElementById("warning").innerHTML = this.response;
        }
    };

    if (password_length < 8 || !upper_case.test(password)
    || !lower_case.test(password)|| !numbers.test(password)
    || !check_special_chars){
        alert("Password must be at least 8 characters long. It must contain upper case letters, lower case letters, numbers and special characters");
        return;
    }
    if (password !== password2) {
        alert("Password is re-entered wrong!");
        return;
    }
    if (email && password && first_name && last_name) {
        xhttp.open("POST", '/api/users/signup', true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({
            email: email,
            password: password,
            first_name: first_name,
            last_name: last_name
        }));
    } else {
        alert("Required field is empty.");
    }
}

function googleLogin(response) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            window.location.href = `/profile`;
        } else if (this.status === 400) {
            document.getElementById("warning").innerHTML = this.response;
        }
    };
    xhttp.open('POST','/api/users/glogin');
    xhttp.setRequestHeader('Content-Type','application/json');
    xhttp.send(JSON.stringify(response));
}

