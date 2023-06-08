var isLoggedIn = function(instance) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            instance.isLoggedIn = JSON.parse(this.responseText).isLoggedIn;
            instance.isAdmin = JSON.parse(this.responseText).isAdmin;
        }
    };
    xhttp.open("GET", `/api/users/auth`, true);
    xhttp.send();
};

var deleteUser = function(user_id) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            window.location.reload();
        } else if (this.readyState===4) {
            alert(this.responseText);
        }
    };
    xhttp.open("POST", `/api/users/delete`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
        user_id: user_id
    }));
}

export {
    isLoggedIn,
    deleteUser
};
