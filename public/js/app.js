import { ActivityTab } from "./components/Tab.js";
import ClubNav from "./components/ClubNav.js";
import Nav from "./components/Nav.js";
import Footer from "./components/Footer.js";
import { isLoggedIn } from './user.js';

var app = new Vue ({
    el: '#app',
    data() {
        return {
            isLoggedIn: false,
            isAdmin: false
        };
    },
    created() {
        this.checkIsLoggedIn();
    },
    methods: {
        checkIsLoggedIn: function() {
            isLoggedIn(this);
        }
    }
});
