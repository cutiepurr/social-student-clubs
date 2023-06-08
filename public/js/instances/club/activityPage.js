import * as clubModule from "/js/club.js";
var activity = new Vue({
    name: "activity",
    el: "main",
    data() {
        return {
            type: "event", // to implement updates -> type: "update"
            clubId: -1,
            activityId: -1,
            club: {},
            activity: {},
            author: {},
            rsvp: [],
            isRsvped: false,
            isMember: false,
            isManager: false
        };
    },
    created() {
        this.getParams();
        this.getClubData();
        this.getActivity();
        clubModule.checkIfMember(this);
        if (this.type==="event") this.getRsvp();
    },
    methods: {
        getParams: function() {
            // /clubs/clubID/events/eventId
            let paths = window.location.pathname.split('/');
            if (paths[paths.length-2] === "updates") this.type = "update";
            this.clubId = paths[paths.length-3];
            this.activityId = paths[paths.length-1];
        },
        getClubData: function() {
            clubModule.getClub(this, null);
        },
        getActivity: function() {
            clubModule.getActivity(this, this.getAuthor);
        },
        getAuthor: function() {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    instance.author = JSON.parse(this.responseText);
                    document.title = `${instance.activity.title} | ${instance.club.name} ${instance.type}`;
                }
            };
            xhttp.open("GET", `/api/users/${this.activity.user_id}`, true);
            xhttp.send();
        },
        archiveActivity: function() {
            clubModule.archiveActivity(this);
        },
        ifMember: function() {
            clubModule.checkIfMember(this);
        },

        // EVENT ONLY
        getRsvpUserData: function(rsvp) {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    rsvp.user = JSON.parse(this.responseText);
                    instance.rsvp.push(rsvp);
                }
            };
            xhttp.open("GET", `/api/users/${rsvp.user_id}`, true);
            xhttp.send();
        },
        rsvpEvent: function() {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    instance.getRsvp();
                }
            };
            xhttp.open("POST", `/api/events/${this.clubId}/${this.activityId}/rsvp`, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        },
        getRsvp: function() {
            this.rsvp = [];
            clubModule.getEventRsvp(this, this.getRsvpUserData);
        }
    }
});
