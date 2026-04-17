1. Create a folder (backend-api).
2. Open this folder in VS Code.
3. Initialise the project by opening the terminal and typing: npm init -y
4. Then, in the same terminal, install: npm install express sqlite3 cors body-parser
5. Install: npm install --save-dev nodemon
6. Create a file named server.js and paste the code.
7. Open package.json file and the "scripts" section and add a start script: "scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"},
8. In terminal run: npm run dev
9. Install Ngrok.
10. While server is running, open a new terminal window and run: ngrok http 3000
11. Copy the URL it generates.
12. Send this URL to the frontend code to fetch data fromt this database.
