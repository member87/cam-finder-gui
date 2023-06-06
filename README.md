# Cam Finder GUI


This is a tool made in electron to view ACTI NVR cameras containing the default username / password (admin / 1233456). It generates a list of servers using shodan and censys then attemempts to login to each one. Any server that has a successful login is them stored in a sqlite database. You can then view all servers and any information related to them including  registered users, connected drivers, location, camera list etc. 


## Get Started
```
git clone https://github.com/member87/cam-finder-gui
cp .env.example .env

# enter details in .env
npm i
npm run dev
```
