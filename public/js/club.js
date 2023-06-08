// AJAX CALLS - CLUB

var addClub = (name, about, next) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (next) next(JSON.parse(this.responseText));
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    if (!name) {
        alert("Name is required");
        return;
    }
    xhttp.open("POST", `/api/clubs/add`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
        name: name,
        about: about
    }));
};

var getClub = (instance, next) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            instance.club = JSON.parse(this.responseText);
            if (next) next();
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    xhttp.open("GET", `/api/clubs/${instance.clubId}`, true);
    xhttp.send();
};

var sendNotification = (receiverEmails, title, content) => {
    let xhttp = new XMLHttpRequest();
    let path = `/api/clubs/send-notification`;
    xhttp.open("POST", path, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
        email: receiverEmails,
        title: title,
        content: content
    }));
};

var getNotifications = (instance, emailTitle, emailContent) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let notifications = JSON.parse(this.responseText);
            let emails = [];
            for (let n of notifications) {
                emails.push(n.email);
            }
            sendNotification(emails, emailTitle, emailContent);
            window.location.href=`/clubs/${instance.clubId}/${instance.type}s`;
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    let path = `/api/clubs/${instance.clubId}/notifications?type=${instance.type}`;
    xhttp.open("GET", path, true);
    xhttp.send();
};

var editNotification = (clubId, notification, next) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (next) next();
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    let path = `/api/clubs/${clubId}/notification`;
    xhttp.open("POST", path, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(notification));
};

var setNotification = (clubId, userId, next) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (next) next();
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    let path = `/api/clubs/${clubId}/notification/add`;
    xhttp.open("POST", path, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
        userId: userId
    }));
};


// MEMBER-RELATED
var checkIfMember = (instance, next) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            instance.isMember = JSON.parse(this.responseText).isMember;
            instance.isManager = JSON.parse(this.responseText).isManager;
            if (next) next();
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    xhttp.open("GET", `/api/clubs/${instance.clubId}/role`, true);
    xhttp.send();
};

var getMembers = (clubId, start, end, loadUserData) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let members = JSON.parse(this.responseText);
            for (let member of members) {
                loadUserData(member);
            }
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    let path = `/api/clubs/${clubId}/members`;
    if (!start && !end) xhttp.open("GET", path, true);
    else if (!end) xhttp.open("GET", `${path}?start=${start}`, true);
    else if (!start) xhttp.open("GET", `${path}?end=${end}`, true);
    else xhttp.open("GET", `${path}?start=${start}&end=${end}`, true);
    xhttp.send();
};


var addMember = (clubId, email, manager, next) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let userId = JSON.parse(this.responseText).user_id;
            setNotification(clubId, userId, null);
            if (next) next(JSON.parse(this.responseText));
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    let path = `/api/clubs/${clubId}/members/add`;
    if (manager) {
        path = `/api/clubs/${clubId}/members/add?manager=${manager}`;
    }
    xhttp.open("POST", path, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
        email: email
    }));
};

var deleteMember = (clubId, userId, next) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (next) next();
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    let path = `/api/clubs/${clubId}/members/delete`;
    xhttp.open("POST", path, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
        user_id: userId
    }));
};

var promoteMember = (clubId, userId, promote) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            window.location.reload();
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    let path = `/api/clubs/${clubId}/manager/${userId}/${promote}`;
    xhttp.open("POST", path, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
};

var getEventRsvp = (instance, loadUserData) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let rsvp = JSON.parse(this.responseText).rsvp;
            instance.isRsvped = JSON.parse(this.responseText).isRsvped;
            for (let r of rsvp) {
                loadUserData(r);
            }
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    let path = `/api/events/${instance.clubId}/${instance.activityId}/rsvp`;
    xhttp.open("GET", path, true);
    xhttp.send();
};

// ACTIVITY - EITHER EVENT OR UPDATE

var getActivities = (instance, start, end, loadUserData) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let activities = JSON.parse(this.responseText);
            for (let activity of activities) {
                loadUserData(activity);
            }
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    let path = `/api/${instance.type}s/${instance.clubId}`;
    if (!start && !end) xhttp.open("GET", path, true);
    else if (!end) xhttp.open("GET", `${path}?start=${start}`, true);
    else if (!start) xhttp.open("GET", `${path}?end=${end}`, true);
    else xhttp.open("GET", `${path}?start=${start}&end=${end}`, true);
    xhttp.send();
};

var getActivity = (instance, loadAuthor) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            instance.activity = JSON.parse(this.responseText);
            if (loadAuthor) loadAuthor(instance.activity.user_id);
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    let path = `/api/${instance.type}s/${instance.clubId}/${instance.activityId}`;
    xhttp.open("GET", path, true);
    xhttp.send();
};

function toUTC(d, t) {
    let timestamp = new Date(`${d} ${t}`).toISOString().split("T");
    let date = timestamp[0];
    let time = timestamp[1].split(".")[0];
    return `${date} ${time}`;
}

var editActivity = (instance) => {
    let title = document.getElementById('title').value;
    let content = document.getElementById('content').value;
    let isPublic = document.getElementById('public').checked;
    let date;
    let time;
    let l;
    if (instance.type==="event") {
        date = document.getElementById('date').value;
        time = document.getElementById('time').value;
        l = document.getElementById('location').value;
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            window.location.href = `/clubs/${instance.clubId}/${instance.type}s/${instance.activityId}`;
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    if (title) {
        let path = `/api/${instance.type}s/${instance.clubId}/${instance.activityId}/edit`;
        xhttp.open("POST", path, true);
        xhttp.setRequestHeader("Content-type", "application/json");

        let result;
        if (instance.type==="event") {
            result = {
                title: title,
                time: toUTC(date, time),
                location: l,
                content: content,
                is_public: isPublic
            };
        } else {
            result = {
                title: title,
                content: content,
                is_public: isPublic
            };
        }
        xhttp.send(JSON.stringify(result));

    } else {
        alert("Required field is empty.");
    }

};

var addActivity = (instance) => {
    let title = document.getElementById('title').value;
    let content = document.getElementById('content').value;
    let isPublic = document.getElementById('public').checked;
    let date;
    let time;
    let l;
    if (instance.type==="event") {
        date = document.getElementById('date').value;
        time = document.getElementById('time').value;
        l = document.getElementById('location').value;
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let emailTitle = `${title} | ${instance.club.name}`;
            let emailContent = emailTitle + '\n\n';
            if (instance.type==="update") emailContent += `${content}\n\n`;
            else if (instance.type==="event") {
                emailContent += `Time: ${date} ${time}
Location: ${l}
Information: ${content}\n\n`;
            }
            emailContent += '(This email is auto generated. Do not reply.)';

            getNotifications(instance, emailTitle, emailContent);

        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    if (title) {
        let path = `/api/${instance.type}s/${instance.clubId}/add`;
        xhttp.open("POST", path, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        let result;
        if (instance.type==="event") {
            result = {
                title: title,
                time: toUTC(date, time),
                location: l,
                content: content,
                is_public: isPublic
            };
        } else {
            result = {
                title: title,
                content: content,
                is_public: isPublic
            };
        }
        xhttp.send(JSON.stringify(result));

    } else {
        alert("Required field is empty.");
    }
};

var archiveActivity = (instance) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            window.location.href = `/clubs/${instance.clubId}/${instance.type}s`;
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    let path = `/api/${instance.type}s/${instance.clubId}/${instance.activityId}/archive`;
    xhttp.open("POST", path, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
};

var deleteClub = (clubId, next) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (next) next();
        } else if (this.readyState === 4) {
            if (this.responseText) alert(this.responseText);
        }
    };
    let path = `/api/clubs/${clubId}/delete`;
    xhttp.open("POST", path, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
};

export {
    addClub,
    getClub,
    checkIfMember,
    getMembers,
    addMember,
    deleteMember,
    promoteMember,
    getEventRsvp,

    getActivities,
    getActivity,
    archiveActivity,
    editActivity,
    addActivity,
    deleteClub,

    editNotification,
    setNotification
};
