const azure = require('azure-storage');
const uuid = require('uuid/v1');

const tableService = azure.createTableService('twitterlikestorage', '3ApdznssqQjjmOz07RtKH+55nhMWVj6fvvNEFXN19vD4Ym+P+R8N85PcHVDDxmt8yeRVwTMma4cr8euQLo08GQ==');

module.exports = function (context, req) {
    context.log('Start TweetCreate');

    if (req.body && req.body.username != undefined) {

        if (!req.body.content) {
            context.res.status(400).json({ error: 'The tweet has no content!' })
            return;
        }
        var tweet = {
            PartitionKey: 'tweet' + new Date().getFullYear(),
            RowKey: uuid(),
            Content: req.query.content || req.body.content,
            Sender: req.query.sender || req.body.sender
        };

        // Use { echoContent: true } if you want to return the created item including the Timestamp & etag
        tableService.insertEntity('Tweets', tweet, { echoContent: true }, function (error, result, response) {
            if (!error) {
                context.res.status(201).json({ error: 'Tweet has been processed ' });
            } else {
                context.res.status(500).json({ error: 'System inner error.' });
            }
        });

    }
    else {
        context.res = {
            status: 400,
            body: "Please pass an item in the request body"
        };
        context.done();
    }
};