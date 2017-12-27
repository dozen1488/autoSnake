cd ./server
npm i
./server.js &
cd ../crossPlatformModels
npm i 
cd ../srcr
npm i
npm run watch &
chromium-browser "http://localhost:3002"