var profile = new Vue({
    name: "profile",
    el: "main",
    data() {
        return {
            user: {},
            clubs: [],
            rsvp: []
        };
    },
    created() {
        this.getJoinedClubs();
        this.getRsvp();
    },
    methods: {
        getJoinedClubs: function() {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    instance.clubs = JSON.parse(this.responseText);
                }
            };
            xhttp.open("GET", `/api/users/clubs`, true);
            xhttp.send();
        },
        getRsvp: function() {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    let rsvp = JSON.parse(this.responseText);
                    for (let r of rsvp) {
                        instance.getRsvpUserData(r);
                    }
                }
            };
            xhttp.open("GET", `/api/users/rsvp`, true);
            xhttp.send();
        },
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
        getClubName: function(clubId) {
            return this.clubs.find((c) => c.club_id == clubId).name;
        }
    }
});
