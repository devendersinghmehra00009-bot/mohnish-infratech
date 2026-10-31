MOHNISH INFRATECH WEBSITE
=========================
Pages: index.html, about.html, projects.html, contact.html   (4 languages: EN default, HI, GU, PA)
Backend (PHP, Hostinger par chalta hai): api/lead.php, admin/index.php

--- 1) GITHUB PAGES PAR TEST (sirf look + popup) ---
GitHub Pages par PHP nahi chalta, isliye wahan lead "api/lead.php" se save nahi hogi.
Wahan test ke liye free Web3Forms use hota hai (email alert milega):
  a) web3forms.com par mohnishbawankar533@gmail.com se free Access Key len
  b) assets/config.js mein  web3formsKey: ""  ke andar key paste karein
Key na ho to form bhara jane par error + "Message on WhatsApp" button dikhta hai (jhootha success nahi dikhata).

Steps: GitHub par naya public repo -> saari files upload (folders ke saath, computer se) ->
Settings -> Pages -> Branch: main / root -> Save. Link 1-2 minute mein milta hai.

--- 2) HOSTINGER PAR LIVE (asli backend ke saath) ---
hPanel -> Websites -> domain -> File Manager -> public_html -> purani files hatayein ->
is zip ko upload + Extract karein (index.html seedha public_html mein dikhna chahiye).
PHP 8.1+ rakhein. SSL chalu hone par .htaccess mein HTTPS wali 2 line se '#' hataein.
Hostinger par assets/config.js mein web3formsKey khaali chhod dein.

Admin (leads dekhna, CSV download, WhatsApp welcome button): https://aapkadomain.com/admin/
Email alert: mohnishbawankar533@gmail.com (spam folder bhi dekhein). Domain ka email account
(info@domain) hPanel -> Emails mein bana lein, mail reliably pahunchti hai.

--- BADLAV ---
Phone/email/address/social links: assets/config.js  AUR  includes/config.php (dono mein same rakhein).
Social links abhi khaali hain, config.js mein Instagram/Facebook/YouTube ke link daalte hi footer mein dikh jayenge.
