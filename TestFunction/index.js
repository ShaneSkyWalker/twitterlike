const azure = require('azure-storage');
const uuid = require('uuid/v1');
const NodeRSA = require('node-rsa')
var fs = require('fs')

const tableService = azure.createTableService('twitterlikestorage', '3ApdznssqQjjmOz07RtKH+55nhMWVj6fvvNEFXN19vD4Ym+P+R8N85PcHVDDxmt8yeRVwTMma4cr8euQLo08GQ==');
const tableName = "mytable";

module.exports = function (context, req) {
    context.log('Start ItemCreate');

    if (req.body) {

        // TODO: Add some object validation logic & 
        //       make sure the object is flat

        var entGen = azure.TableUtilities.entityGenerator;

        encrypt(req.body.sender);
        decrypt(req.body.sender);
        var tweet = {
            PartitionKey: 'tweet' + new Date().getFullYear(),
            RowKey: uuid(),
            Content: req.query.content || req.body.content,
            Sender: req.query.sender || req.body.sender
        };

        // Use { echoContent: true } if you want to return the created item including the Timestamp & etag
        /* tableService.insertEntity('Tweets', tweet, { echoContent: true }, function (error, result, response) {
            if (!error) {
                context.res.status(201).json(response);
            } else {
                context.res.status(500).json({ error: error });
            }
        }); */
        /* var query = new azure.TableQuery()
            .select(['description', 'dueDate'])
            .top(5)
            .where('PartitionKey eq ?', 'hometasks');
        tableService.queryEntities(tableName, query, null, function(error, result, response) {
            if (!error) {
                context.res.status(201).json(response)
            } else {
                context.res.status(500).json({ error: error })
            }
        }) */
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass an item in the request body"
        };
        context.done();
    }
};

function encrypt(plain) {
    fs.readFile('../pem/private.pem', function (err, data) {
        console.log(data)
        var key = new NodeRSA(data);
        let cipherText = key.encryptPrivate(plain, 'base64');
        console.log(cipherText);
    });
}

function decrypt(code) {
    fs.readFile('../pem/public.pem', function (err, data) {
        var key = new NodeRSA(data);
        let rawText = key.decryptPublic(code, 'utf8');
        console.log(rawText);
    });
}
