sudo su
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
echo '------------------------------- installing node'
apt-get install -y nodejs
echo '------------------------------- installing npm'
npm install -g npm