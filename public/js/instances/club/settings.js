import * as clubModule from "/js/club.js";
var clubSettings = new Vue({
    name: "clubSettings",
    el: "main",
    data() {
        return {
            clubId: -1,
            club: {},
            notification: {},
            isMember: false,
            isManager: false
        };
    },
    created() {
        this.getParamClubId();
        this.getClubData();
        clubModule.checkIfMember(this);
        this.getNotification();
    },
    methods: {
        getParamClubId: function() {
            // /clubs/clubID/settings
            let paths = window.location.pathname.split('/');
            this.clubId = paths[paths.length-2];
        },
        getClubData: function() {
            let instance = this;
            clubModule.getClub(this, function() {
                document.title = `${instance.club.name} | Members`;
            });
        },
        getNotification: function() {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    instance.notification = JSON.parse(this.responseText);
                }
            };
            xhttp.open("GET", `/api/clubs/${instance.clubId}/notification`, true);
            xhttp.send();
        },
        editNotification: function() {
            let subscribed = document.getElementById("subscribed").checked;
            let events = document.getElementById("events").checked;
            let updates = document.getElementById("updates").checked;
            let notification = {
                subscribed: subscribed,
                events: events,
                updates: updates
            };
            clubModule.editNotification(this.clubId, notification, function() {
                window.location.reload();
            });
        }
    }
});
