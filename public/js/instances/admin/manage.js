import * as userModule from '/js/user.js';
import * as clubModule from '/js/club.js';
var manage = new Vue({
    name: "manage",
    el: "main",
    data() {
        return {
            type: "clubs", // clubs, users, admins
            db: [],
            headers: []
        };
    },
    created() {
        this.getParam();
        this.getHeaders();
        this.getDb();
    },
    methods: {
        getParam: function() {
            // /admin/type(s)
            let paths = window.location.pathname.split('/');
            this.type = paths[paths.length-1];
        },
        getHeaders: function() {
            switch (this.type) {
                case "clubs":
                    this.headers = ["ID", "Name", "Active", "Hidden", "Created Timestamp"];
                    break;
                case "users":
                    this.headers = ["ID", "First name", "Last name", "Email", "Created Timestamp"];
                    break;
                case "admins":
                    this.headers = ["ID", "First name", "Last name", "Email", "Created Timestamp"];
                    break;
                default:
                    break;
            }
        },
        redirect: function(data) {
            if (this.type==='admins') return;
            let id;
            if (this.type==="clubs") id = data.club_id;
            else id = data.user_id;
            window.location.href=`/admin/${this.type}/${id}`;
        },
        getDb: function() {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    instance.db = JSON.parse(this.responseText);
                    for (let item of instance.db) {
                        delete item.password;
                        delete item.pictureUrl;
                        delete item.about;
                        delete item.admin;
                        if (item.created_timestamp) {
                            item.created_timestamp = new Date(item.created_timestamp).toLocaleString();
                        }
                    }
                }
            };
            xhttp.open("GET", `/api/${instance.type}`, true);
            xhttp.send();
        },
        removeAdmin: function(user_id) {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    window.location.reload();
                }
            };
            xhttp.open("POST", `/api/users/admin/remove`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({
                user_id: user_id
            }));
        },
        addAdmin: function() {
            let email = document.getElementById("email").value;
            if (!email) {
                alert("Empty input");
                return;
            }
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    window.location.reload();
                } else if (this.readyState===4) {
                    alert(this.responseText);
                }
            };
            xhttp.open("POST", `/api/users/admin/add`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({
                email: email
            }));
        },
        deleteUser: function(user_id) {
            userModule.deleteUser(user_id);
        },
        deleteClub: function(club_id) {
            clubModule.deleteClub(club_id, function() {
                window.location.reload();
            });
        }

    }
});

