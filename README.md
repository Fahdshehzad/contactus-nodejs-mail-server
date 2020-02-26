# contactus-nodejs-mail-server
A quick solution to create a Node.Js based mail server to support the contact-us forms. The idea is to use this tiny mail server when there is no Java, Python, PHP etc installed at the host server. 

This mail server serves the contact-us form without exposing the email-host naked to the whole world. Also this mail-server is integrated with google reCAPTCHA to protect mail server against the spams or abuse.

  
-> See the properties.ini file to add required mail settings.

-> See the apache.conf file to add settings apache config or htaccess file.

-> Also verifies google re-captcha key against google to prevent spam or reboot attack. So Public key goes into html file, while private or secret key must be added in properties.inti file.
	
-> run using command: node mailserver.js
