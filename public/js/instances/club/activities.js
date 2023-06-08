import * as clubModule from "/js/club.js";
// can be use as either events or updates
var activities = new Vue({
    name: "activities",
    el: "main",
    data() {
        return {
            type: "event", // to implement updates -> type: "update"
            clubId: -1,
            club: {},
            activities: [],
            isMember: false,
            isManager: false
        };
    },
    created() {
        this.clubId = this.getParamClubId();
        this.getClubData();
        clubModule.checkIfMember(this);
        this.getActivities();
    },
    methods: {
        getParamClubId: function() {
            // /clubs/clubID/events (or updates)
            let paths = window.location.pathname.split('/');
            if (paths[paths.length-1] === "updates") this.type = "update";
            return paths[paths.length-2];
        },
        getClubData: function() {
            let instance = this;
            clubModule.getClub(this, function() {
                document.title = `${instance.club.name} ${instance.type}s`;
            });
        },
        getActivities: function() {
            clubModule.getActivities(this, 0, null, this.getAuthor);
        },
        getAuthor: function(activity) {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    activity.user = JSON.parse(this.responseText);
                    instance.activities.push(activity);
                }
            };
            xhttp.open("GET", `/api/users/${activity.user_id}`, true);
            xhttp.send();
        }
    }
});
