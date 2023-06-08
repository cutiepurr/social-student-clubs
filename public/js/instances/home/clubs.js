import { isLoggedIn } from '/js/user.js';
import * as clubModule from '/js/club.js';

var clubsPage = new Vue({
    name: "ClubsPage",
    el: "main",
    data() {
        return {
            clubs: [],
            joined: [],
            isLoggedIn: false
        };
    },
    created() {
        this.getClubs();
        this.getJoinedClubs();
        isLoggedIn(this);
    },
    methods: {
        getClubs: function() {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    instance.clubs = JSON.parse(this.responseText);
                }
            };
            xhttp.open("GET", "/api/clubs", true);
            xhttp.send();
        },
        getJoinedClubs: function() {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    instance.joined = JSON.parse(this.responseText);
                }
            };
            xhttp.open("GET", `/api/users/clubs`, true);
            xhttp.send();
        },
        joinClub: function(clubId, manager) {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    clubModule.setNotification(clubId, null, function() {
                        window.location.href = `/clubs/${clubId}`;
                    });
                } else if (this.readyState === 4) alert(this.responseText);
            };
            if (manager) xhttp.open("POST", `/api/clubs/${clubId}/join?manager=${manager}`, true);
            else xhttp.open("POST", `/api/clubs/${clubId}/join`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        isJoined: function(clubId) {
            let joinedClub = this.joined.find((c) => c.club_id == clubId);
            if (joinedClub) return true;
            return false;
        },
        newClub: function() {
            let instance = this;
            let name = document.getElementById("name").value;
            let about = document.getElementById("about").value;
            clubModule.addClub(name, about, function(res) {
                instance.joinClub(res.club_id, true);
            });
        }
    }
});
