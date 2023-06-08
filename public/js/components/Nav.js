var Nav = Vue.component(
    'page-nav', {
    props: ['isuser', 'isadmin'],
    // props: ['url'],
    // data: function(){},
    template: `<nav>
        <a href="/" id="pageTitle"><h1>Clubs</h1></a>
        <div id="navTabs">
            <div class="nav-link"><a href="/clubs">All clubs</a></div>
            <div class="nav-link"><a href="/admin" v-if="isadmin">Admin</a></div>
            <div class="nav-link"><a href="/signup" v-if="!isuser">Signup</a></div>
            <div class="nav-link"><a href="/login" v-if="!isuser">Login</a></div>
            <div class="dropdown nav-link" v-if="isuser">
                <a class="dropbtn">Account</a>
                <div class="dropdown-content">
                    <a href="/profile" class="dropbtn">Profile</a>
                    <a href="/settings" class="dropbtn">Settings</a>
                    <a href="/logout" class="dropbtn">Log out</a>
                </div>
            </div>
        </div>
    </nav>`
    }
);
export default Nav;