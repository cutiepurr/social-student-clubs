import * as clubModule from "/js/club.js";
var adminForm = new Vue({
    name: "adminForm",
    el: "main",
    data() {
        return {
            ifEdit: true,
            type: "clubs", // clubs, users, admins
            id: -1,
            db: {},
            members: []
        };
    },
    created() {
        this.getParam();
        if (this.ifEdit) this.getDb();
        if (this.type==="clubs" && this.ifEdit) this.getMembers();
    },
    methods: {
        getParam: function() {
            // /admin/type(s)/id
            let paths = window.location.pathname.split('/');
            this.type = paths[paths.length-2];
            if (paths[paths.length-1]==='add') this.ifEdit = false;
            else this.id = paths[paths.length-1];
        },
        getDb: function() {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    instance.db = JSON.parse(this.responseText);
                    delete instance.db.password;
                    delete instance.db.pictureUrl;
                } else if (this.readyState === 4) {
                    if (this.responseText) alert(this.responseText);
                }
            };
            xhttp.open("GET", `/api/${instance.type}/${instance.id}`, true);
            xhttp.send();
        },
        addClub: function() {
            let name = document.getElementById("name").value;
            let about = document.getElementById("about").value;
            clubModule.addClub(name, about, function(res) {
                window.location.href = `/admin/clubs/${res.club_id}`;
            });
        },
        editClub: function() {
            let name = document.getElementById("name").value;
            let about = document.getElementById("about").value;
            let active = document.getElementById("active").checked;
            let hidden = document.getElementById("hidden").checked;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    window.location.reload();
                } else if (this.readyState === 4) {
                    if (this.responseText) alert(this.responseText);
                }
            };
            if (!name) {
                alert("Name is required");
                return;
            }
            xhttp.open("POST", `/api/clubs/${this.id}`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({
                name: name,
                about: about,
                active: active,
                hidden: hidden
            }));
        },
        getMembers: function() {
            clubModule.getMembers(this.id, null, null, this.getUser);
        },
        getUser: function(member) {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    member.user = JSON.parse(this.responseText);
                    instance.members.push(member);
                } else if (this.readyState === 4) {
                    if (this.responseText) alert(this.responseText);
                }
            };
            xhttp.open("GET", `/api/users/${member.user_id}`, true);
            xhttp.send();
        },
        promoteMember: function(userId, promote) {
            clubModule.promoteMember(this.id, userId, promote);
        },
        addMember: function() {
            let email = document.getElementById("memberEmail").value;
            if (email) {
                clubModule.addMember(this.id, email, false, function() {
                    window.location.reload();
                });
            } else alert("Empty input");
        },
        deleteMember: function(userId) {
            clubModule.deleteMember(this.id, userId, function() {
                window.location.reload();
            });
        },
        editUser: function() {
            let first_name = document.getElementById("first_name").value;
            let last_name = document.getElementById("last_name").value;
            let email = document.getElementById("email").value;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    window.location.reload();
                } else if (this.readyState === 4) {
                    if (this.responseText) alert(this.responseText);
                }
            };
            if (!first_name || !last_name || !email) {
                alert("Empty input");
                return;
            }
            xhttp.open("POST", `/api/users/${this.id}`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({
                first_name: first_name,
                last_name: last_name,
                email: email
            }));
        },
        changePassword: function() {
            let password = document.getElementById("password").value;
            if (!password) {
                alert("Empty input");
                return;
            }
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    window.location.reload();
                } else if (this.readyState === 4) {
                    if (this.responseText) alert(this.responseText);
                }
            };
            xhttp.open("POST", `/api/users/${this.id}/change-password`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({
                password: password
            }));

        }
    }
});

