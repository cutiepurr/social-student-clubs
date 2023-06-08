import * as clubModule from "/js/club.js";
var clubMembers = new Vue({
    name: "clubMembers",
    el: "main",
    data() {
        return {
            clubId: -1,
            club: {},
            members: [],
            isMember: false,
            isManager: false
        };
    },
    created() {
        this.clubId = this.getParamClubId();
        this.getClubData();
        this.getMembers();
        clubModule.checkIfMember(this);
    },
    methods: {
        getParamClubId: function() {
            // /clubs/clubID/members
            let paths = window.location.pathname.split('/');
            return paths[paths.length-2];
        },
        getClubData: function() {
            let instance = this;
            clubModule.getClub(this, function() {
                document.title = `${instance.club.name} | Members`;
            });
        },
        getMembers: function() {
            clubModule.getMembers(this.clubId, null, null, this.getUser);
        },
        getUser: function(member) {
            let instance = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    member.user = JSON.parse(this.responseText);
                    instance.members.push(member);
                }
            };
            xhttp.open("GET", `/api/users/${member.user_id}`, true);
            xhttp.send();
        },
        promoteMember: function(userId, promote) {
            clubModule.promoteMember(this.clubId, userId, promote);
        },
        addMember: function() {
            let email = document.getElementById("memberEmail").value;
            if (email) {
                clubModule.addMember(this.clubId, email, false, function() {
                    window.location.reload();
                });
            }
            else alert("Empty input");
        },
        deleteMember: function(userId) {
            clubModule.deleteMember(this.clubId, userId, function() {
                window.location.reload();
            });
        }
    }
});
