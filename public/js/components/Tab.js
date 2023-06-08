var ActivityTab = Vue.component(
    'activity-tab', {
    props: ['obj', 'type', 'id'],
    // data: function(){},
    template: `<div class="tab activityTab" v-bind:value="id">
    <a v-bind:href="'/clubs/' + obj.club_id + '/' + type + 's/' + id " class="a-tab" v-bind:title="obj.title">
        <h5>{{ obj.title }}</h5>
        <div v-if="type=='event'">Time: {{ new Date(obj.time).toLocaleString('en-GB', {timeStyle: "short", dateStyle: "full"}) }}<br>
        Location: {{ obj.location }}</div>
        <p class="grey">By {{ obj.user.first_name }} {{ obj.user.last_name }} | {{ new Date(obj.published_timestamp).toLocaleString('en-GB', {timeStyle: "short", dateStyle: "full"}) }}</p>
    </a>
    </div>`
    }
);

var ClubTab = Vue.component(
    'club-tab', {
        props: ['obj'],
        template: `<div class="clubTab">
        <a class="a-tab" v-bind:href="obj.url">
            <h3>{{ obj.name }}</h3>
            <p>{{ obj.description }}</p>
        </a>
    </div>`
    }
);

export {ActivityTab};