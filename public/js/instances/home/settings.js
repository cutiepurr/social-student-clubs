var settings = new Vue({
    name: "settings",
    el: "main",
    data() {
        return {
            user: {}
        };
    },
    created() {
        this.getUserData();
    },
    methods: {
        getUserData: function() {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    instance.user = JSON.parse(this.responseText);
                }
            };
            xhttp.open("GET", `/api/users/current`, true);
            xhttp.send();
        },
        updateUserData: function() {
            let first_name = document.getElementById("first_name").value;
            let last_name = document.getElementById("last_name").value;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    alert("Changed!");
                }
            };
            if (first_name && last_name) {
                xhttp.open("POST", `/api/users/current`, true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify({
                    first_name: first_name,
                    last_name: last_name
                }));
            } else {
                alert("Required field is empty");
            }
        },
        changePassword: function() {
            let old = document.getElementById("old").value;
            let new1 = document.getElementById("new1").value;
            let new2 = document.getElementById("new2").value;
            if (new1 !== new2) {
                alert("New password is re-entered wrong.");
                return;
            }
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    window.location.reload();
                    alert("Changed!");
                }
            };
            if (new1) {
                xhttp.open("POST", `/api/users/change-password`, true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify({
                    old: old,
                    new: new1
                }));
            } else {
                alert("Required field is empty");
            }
        }
    }
});
