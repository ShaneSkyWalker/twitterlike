
const azure = require('azure-storage');
const uuid = require('uuid/v1');

const tableService = azure.createTableService('twitterlikestorage', '3ApdznssqQjjmOz07RtKH+55nhMWVj6fvvNEFXN19vD4Ym+P+R8N85PcHVDDxmt8yeRVwTMma4cr8euQLo08GQ==');

module.exports = function (context, req) {
    context.log('Start adding a following');

    if (req.body && req.body.username && req.body.following) {

        // TODO: Add some object validation logic & 
        //       make sure the object is flat

        username = req.query.username || req.body.username;
        following = req.query.following || req.body.following;
        var followsomeone = {
            PartitionKey: 'relations',
            RowKey: '[' + username + ',' + following + ']',
            Username: username,
            Following: following
        };

        // Use { echoContent: true } if you want to return the created item including the Timestamp & etag
        tableService.insertEntity('Relations', followsomeone, { echoContent: true }, function (error, result, response) {
            if (!error) {
                context.res.status(201).json({ response: "Successfully followed!" });
            } else {
                context.res.status(500).json({ error: "Something wrong with the following!" });
            }
        });
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass the username on the query string or in the request body"
        };
        context.done();
    }
};