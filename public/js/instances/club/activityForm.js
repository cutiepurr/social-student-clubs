import * as clubModule from "/js/club.js";
var activityForm = new Vue({
    name: "activityForm",
    el: "main",
    data() {
        return {
            type: "event", // to implement updates -> type: "update"
            ifEdit: true,
            clubId: -1,
            activityId: -1,
            club: {},
            activity: { is_public: true, time: Date.now() },
            isMember: false,
            isManager: false
        };
    },
    created() {
        this.getParams();
        clubModule.checkIfMember(this);
        this.getClubData();
        if (this.ifEdit) {
            this.getActivity();
        }
    },
    methods: {
        getParams: function() {
            let paths = window.location.pathname.split('/');
            // /clubs/clubID/events/eventId/edit
            if (paths.includes("edit")) {
                if (paths[paths.length-3] === "updates") this.type = "update";
                this.clubId = paths[paths.length-4];
                this.activityId = paths[paths.length-2];
            } else { // add
                if (paths[paths.length-2] === "updates") this.type = "update";
                this.clubId = paths[paths.length-3];
                this.ifEdit = false;
            }
        },
        getClubData: function() {
            let instance = this;
            clubModule.getClub(this, function() {
                if (instance.ifEdit) document.title = "Edit";
                else document.title = "Create";
                document.title += ` ${instance.type} | ${instance.club.name}`;
            });
        },
        getActivity: function() {
            clubModule.getActivity(this, this.checkboxPublic);
        },
        editActivity: function() {
            clubModule.editActivity(this);
        },
        addActivity: function() {
            clubModule.addActivity(this);
        },
        formatTime: function() {
            // let timestamp = new Date(this.activity.time).toISOString().split("T");
            // let date = timestamp[0];
            // let time = timestamp[1].split(".")[0];
            let cur = new Date(this.activity.time);

            let mm = String(cur.getMonth()).padStart(2, 0);
            let dd = String(cur.getDate()).padStart(2, 0);
            let date = `${cur.getFullYear()}-${mm}-${dd}`;

            let hours = String(cur.getHours()).padStart(2, 0);
            let minutes = String(cur.getMinutes()).padStart(2, 0);
            let time = `${hours}:${minutes}`;

            return {
                date: date,
                time: time
            };
        }
    }
});
