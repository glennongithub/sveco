# Sveco

## Getting started

### Install
##### 1. Install virtualbox, Vagrant and node.js
##### 2. Make sure you have ionic installed globally
(npm install -g cordova ionic)
##### 3. cd into repository
##### 4. cd into webapp
##### 5. Run npm install
(make sure your host machine is handling that ionic app)
##### 6. Run ionic serve  
(will build the www map needed for the symlink created on first vagrant up)
##### 7. Run vagrant up in repository mapp


### Create data to begin using the app

##### 8. Go to sveco.test/createuser 
(for now use andi:password is created)
##### 9. Then got sveco.test/login ->login
##### 10. go to sveco.test/en/admin/areas  ->create an area
##### 11. go to sveco.test/en/admin/locations -> create a dummy location.


### Finished

##### Got to sveco.test/app and try to use the app.

Some note to be moved to other doc on how to get simple apache on aws-server with certs and stuff working 


sudo apt-get -y install acl apache2 libapache2-mod-php libapache2-mod-security2 git unzip libwww-perl libdatetime-perl python mc htop mysql-client

sudo a2enmod ssl
sudo a2ensite default-ssl.conf

open https in security group on aws

Install certboot
$ sudo apt-get update
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository universe
// need userinput .. se what can be done to outo-answer.. 
$ sudo add-apt-repository ppa:certbot/certbot
$ sudo apt-get update
$ sudo apt-get install python-certbot-apache 

// auto get cert and conf apache
//  we need http open for this script to be able to do it's thing
sudo certbot --apache
