const azure = require('azure-storage');
const uuid = require('uuid/v1');

const tableService = azure.createTableService('twitterlikestorage', '3ApdznssqQjjmOz07RtKH+55nhMWVj6fvvNEFXN19vD4Ym+P+R8N85PcHVDDxmt8yeRVwTMma4cr8euQLo08GQ==');


module.exports = function (context, req) {
    context.log('Start check the following relationship');

    if (req.body.username) {

        var username = req.body.username;
        var queryMyFollower = new azure.TableQuery()
            .select(['Username'])
            .where('Following eq ?', username)
            .and('Username ne ?', username);
        tableService.queryEntities('Relations', queryMyFollower, null, function(error, result, response) {
            if (!error) {
                var follower = []
                response.body.value.forEach(element => {
                    follower.push(element.Username)
                });
                context.res.status(201).json(follower)
            } else {
                context.res.status(500).json({ error: "Cannot find user's followers" })
            }
        })
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass the username on the query string or in the request body"
        };
        context.done();
    }
};