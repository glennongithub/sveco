#!/bin/sh

# If you would like to do some extra provisioning you may
# add any commands you wish to this file and they will
# be run after the Homestead machine is provisioned.

cd /home/vagrant/code/application
# make sure everything is installed
composer install

#create database
php bin/console doctrine:migrations:diff
php bin/console doctrine:migrations:migrate

###
### nodejs for webapp ionic
###

echo "--> Installing NodeJS... "
# clean out old node_modules dirs
sudo rm -fr /home/vagrant/webapp/node_modules

# install node - http://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/#
sudo /bin/sh -c "curl -sL https://deb.nodesource.com/setup_6.x | bash -" > /dev/null 2>&1
sudo apt-get -y install nodejs libjpeg-turbo8 build-essential pkg-config libpng-dev > /dev/null 2>&1

# install ionic globaly
sudo npm install -g cordova ionic > /dev/null

echo "--> Install NPM modules in working dir: '`pwd`'..."
# install dependencies
npm update > /dev/null

# create new ionic app so we can symlink that to public
# if it is not already created
if [ ! -f /home/vagrant/code/webapp ]; then
    ionic start webapp tabs
fi

# symlink it to public to we can access app-interface via webserver
ln -sf /home/vagrant/code/webapp/www/ /home/vagrant/code/application/public/app
