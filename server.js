const http = require('http');
const url = require('url');
const party = require('./count-lead/service');

const server = http.createServer(function(req, res) {
    if(req.method === 'POST' && req.url === '/create') {
        // Post information about a party, i.e candidate's name, party name and vote counts
        let body = '';
        req.on('data', function(data) {
            body += data.toString();
        });
        req.on('end', function(data) {
            if(body === "") {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("No data, Input a valid party data with keys: 'candidate_name' and 'party_name'");
                return
            }

            const resultObject = JSON.parse(body);
            if((!resultObject.candidate_name || !resultObject.party_name ) && (resultObject.candidate_name === "" || resultObject.party_name === "")) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("Invalid Input");
                return
            }
            resultObject.vote_count = 0;
            // console.log(resultObject);
            let partyName = resultObject.party_name.toLowerCase();
            const fileParty = `${partyName}.json`;
           
            const resultJson = JSON.stringify(resultObject, null, 2);
            const partyCreated = party.createParty(fileParty, resultJson);

            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify(partyCreated));
            return;
        });
    }


    else if(req.method === 'GET' && req.url === '/') {
        // Reads or gets all parties
        let getAllParty = party.readAllParties();
        let getAllPartyJson = JSON.stringify(getAllParty);

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(`${getAllPartyJson}`);
    }


    else if (req.method === 'GET' && req.url.includes('/read-one-party')) {
        // Reads or gets one party
        // /read-one-party?party=LP

        const {query} = url.parse(req.url, true);
        const party_query = query.party;
        let party_name = party_query.toLowerCase();

        const result = party.readoneParty(party_name);
        
        if (Array.isArray(result)) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
        }
        else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end(result);
        }
        
    }

    else if(req.method === 'DELETE' && req.url.includes('/delete')) {
        // Delete a party data
        const {query} = url.parse(req.url, true);
        const party_query = query.party;
        let party_name = party_query.toLowerCase();

        const result = party.deleteoneParty(party_name);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(result);
    }

    else if(req.method === 'PUT' && req.url === '/vote') {
        // updates the vote count for the voted party
        let body = '';
        req.on('data', function(data) {
            body += data.toString();
        });

        req.on('end', function(data) {
            if(body === "") {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("No data, Input a valid data with 'party_name' as key");
                return
            }
            const resultObject = JSON.parse(body);
            if (resultObject.party_name === "") {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("Invalid Input");
                return
            }
            let partyName = resultObject.party_name.toLowerCase();
            // const fileParty = `${partyName}.json`;
            const result = party.updateVoteCount(partyName);
        
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(result);

        });
    }
    else if(req.method === 'GET' && req.url === '/leaderboard') {
        // Reads or Gets all party elements in a sorted order according to the leading party in vote counted.
        const result = party.leaderboard();
        
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
    }
    else {
        res.statusCode = 404;
        res.end("Page Not Found");
    }

});
server.listen(8000, () => {
    console.log("Listening on port 8000");
})