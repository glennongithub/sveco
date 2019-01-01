
A few commands and things done as my aws ec nistance that I do not want to forgett
I will probbably try to make some kind of step by step instruction of this.. to make it quicker to get going next time

Installed ubuntu 16.04 instance.

Recieved ssh keys for it and installed localy. 

Created zone for edgeweb.se in route53. 
Added A record for public ipv4 and mx records copied from current found on fsdata 

Pointed ns to ns servers listed for zone

Then I installed the following to get basic webservices up and running

```
sudo apt-get -y install acl apache2 libapache2-mod-php libapache2-mod-security2 git unzip libwww-perl libdatetime-perl python mc htop mysql-client

sudo a2enmod ssl
sudo a2ensite default-ssl.conf
```
open https and http in security group on aws

To get certs that chrome does not warn about .. 
Install certboot
```
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

```
