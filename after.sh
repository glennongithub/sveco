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
