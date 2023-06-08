// for Club/clubDashboard.html only
import * as clubModule from "/js/club.js";
var clubDashboard = new Vue({
    name: "clubDashboard",
    el: "main",
    data() {
        return {
            type: "event",
            clubId: -1,
            club: {},
            events: [], // 3 recent events
            updates: [], // 3 recent updates,
            isMember: false,
            isManager: false
        };
    },
    created() {
        this.clubId = this.getParamClubId();
        this.getClubData();
        clubModule.checkIfMember(this);
        this.getRecentActivities();
    },
    methods: {
        getParamClubId: function() {
            let paths = window.location.pathname.split('/');
            return paths[paths.length-1];
        },
        getClubData: function() {
            let instance = this;
            clubModule.getClub(this, function() {
                document.title = `${instance.club.name} | Dashboard`;
            });
        },
        getRecentActivities: function() {
            this.getRecentEvents();
            this.getRecentUpdates();
        },
        getRecentEvents: function() {
            this.type = "event";
            clubModule.getActivities(this, 0, 3, this.getAuthor);
        },
        getRecentUpdates: function() {
            this.type = "update";
            clubModule.getActivities(this, 0, 3, this.getAuthor);
        },
        getAuthor: function(activity) {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    activity.user = JSON.parse(this.responseText);
                    if (activity.event_id) instance.events.push(activity);
                    else instance.updates.push(activity);
                }
            };
            xhttp.open("GET", `/api/users/${activity.user_id}`, true);
            xhttp.send();
        },
        editAboutSection: function() {
            let text = document.getElementById("aboutText");
            let form = document.getElementById("aboutForm");
            if (text.style.display == "none") {
                text.style.display = "block";
                form.style.display = "none";
            } else if (form.style.display == "none") {
                text.style.display = "none";
                form.style.display = "block";
            }
        },
        editAbout: function() {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    window.location.reload();
                }
            };
            xhttp.open("POST", `/api/clubs/${instance.clubId}`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({
                about: document.getElementById("about").value
            }));
        }
    }
});

