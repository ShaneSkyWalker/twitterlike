const azure = require('azure-storage');

const tableService = azure.createTableService('twitterlikestorage', '3ApdznssqQjjmOz07RtKH+55nhMWVj6fvvNEFXN19vD4Ym+P+R8N85PcHVDDxmt8yeRVwTMma4cr8euQLo08GQ==');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const outputTable = context.bindings.outputTable;
    var username, password, email
    if (req.body && req.body.username && req.body.password && req.body.email) {
        username = req.body.username
        password = req.body.password
        email = req.body.email

    } else if (req.query.username && req.query.password && req.query.email) {
        username = req.query.username
        password = req.query.password
        email = req.query.email
    } else {
        context.log.error("At least one parameter not input!")
        context.res = {
            status: 400,
            body: "Please pass all the parameters to complete the register."
        }
        context.done()
        return;
    }

    const inputTable = context.bindings.inputTable;     // table according to username
    const inputTable2 = context.bindings.inputTable2;   // table according to email

    if (inputTable || inputTable2) {
        context.log.error("Username or email is already taken!")
        context.res = {
            status: 401,
            body: "Username or email is already taken."
        }
    } else {    // Successfully registered
        var tableData = {
            PartitionKey: "user",
            RowKey: username,
            email: email,
            password: password,
            username: username
        }

        context.bindings.outputTable = tableData;

        var followsomeone = {
            PartitionKey: 'relations',
            RowKey: '[' + username + ',' + username + ']',
            Username: username,
            Following: username
        };

        // Use { echoContent: true } if you want to return the created item including the Timestamp & etag
        tableService.insertEntity('Relations', followsomeone, { echoContent: true }, function (error, result, response) {
            if (error) {
                context.res.status(500).json({ error: "Something wrong with the following!" });
            }
        });

        context.log.info("Successfully Registered.")
        context.res = {
            status: 200,
            body: { url: "main-page.html?username=" + username }
        }
    }

};