var ClubNav = Vue.component(
    'club-nav', {
    props: ['id', 'member'],
    template: `<div>
        <ul id="clubNav">
            <li><a v-bind:href="'/clubs/'+ id">Dashboard</a></li>
            <li><a v-bind:href="'/clubs/'+ id + '/members'">Members</a></li>
            <li><a v-bind:href="'/clubs/'+ id + '/events'">Events</a></li>
            <li><a v-bind:href="'/clubs/'+ id + '/updates'">Updates</a></li>
            <li><a v-bind:href="'/clubs/'+ id + '/settings'" v-if="member">Settings</a></li>
        </ul>
    </div>`
});

export default ClubNav;
