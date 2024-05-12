//Importing the express.js library
const express = require('express');
//Creating an instance of the express.js app
const app = express();
//Define port number for the app
const port = 3000;
//Importing node-fetch module
const fetch = require('node-fetch');

//Adding middleware which handles incoming requests
app.use((req,res,next) => {
    //Creating Date object to get current date and time
    const date = new Date().toLocaleString('pl-PL');
    const name = "Rafal Seredowski";
    //Showing information in console
    console.log(`Server is running on ${date} on port ${port} by ${name}`)
    next();
});

//Defining route handler for root path using an async function for asynchronous opeartions
app.get('/', async (req, res) => {
    try {
        //Sending request using the fetch api and (after getting) response parsing it to JSON
        const fetchResponse = await fetch('http://ip-api.com/json/').then(response => response.json());
        //Extracting 'query' property from the response which contains client's IP address
        const clientIp = fetchResponse.query;
        //Extracting 'timezone' property from the response which contains client's IP timezone
        const clientTimeZone = fetchResponse.timezone;
        //Creating Date object representing current date and time and then formating it
        const clientDate = new Date().toLocaleString('pl-PL', {timeZone: clientTimeZone});
        //Creating variable which contains simple HTML web with client's information
        const response = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Client's Information</title>
                </head>
                <body>
                    <h1>Client's Information</h1>
                    <p>Client's IP address: ${clientIp}</p>
                    <p>Date and time in client's datezone: ${clientDate}</p>
                </body>
            </html>
        `;
        //Sending response to client
        res.send(response);
    //Catching any errors that may occur
    } catch (error) {
        //Showing an error in console
        console.error('An error has occured:', error);
        //Setting HTTP status code to 500 and sending message as the body response
        res.status(500).send("An error has occurred while getting client's information");
    }
});
//Start listening for connections
app.listen(port, () => {
    //Showing information in console
    console.log(`The server is listening on port ${port}`);
});