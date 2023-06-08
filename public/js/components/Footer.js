var Footer = Vue.component(
    'page-footer', {
    // props: ['url'],
    // data: function(){},
    template: `<footer>

    <div class="footerRow">
        <div class="footerCol">
            <h1>Clubs</h1>
        </div>
        <div class="footerCol">
            <h5>Contact us</h5>
            <div><b>Email:</b> adobe-flash-lives-on@outlook.com</div>
            <div><b>Address: </b>Level 4 Hub Central, University of Adelaide</div>
        </div>
        <div class="footerCol">
            <h5>Connect with us</h5>
            <a href="https://www.facebook.com/" class="social-media"><i class="fa-brands fa-facebook fa-2xl"></i></a>
            <a href="https://www.twitter.com/" class="social-media"><i class="fa-brands fa-twitter fa-2xl"></i></a>
            <a href="https://www.instagram.com/" class="social-media"><i class="fa-brands fa-instagram fa-2xl"></i></a>
        </div>
    </div>
    <div id="footerCopyright">
        Copyright © 2023 Adobe Flash Lives On
    </div>
</footer>`
    }
);
export default Footer;