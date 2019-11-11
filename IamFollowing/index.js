const azure = require('azure-storage');

const tableService = azure.createTableService('twitterlikestorage', '3ApdznssqQjjmOz07RtKH+55nhMWVj6fvvNEFXN19vD4Ym+P+R8N85PcHVDDxmt8yeRVwTMma4cr8euQLo08GQ==');

module.exports = function (context, req) {
    context.log('Start check following relationship');

    if (req.body) {

        var username = req.query.username || req.body.username;
        var querywhoIFollow = new azure.TableQuery()
            .select(['Username', 'Following'])
            .where('Username eq ?', username)
            .and('Following ne ?', username);

        tableService.queryEntities('Relations', querywhoIFollow, null, function(error, result, response) {
            if (!error) {
                // check if the user is followed already.
                var followlist = []
                response.body.value.forEach(peer => {
                    followlist.push(peer.Following);
                });
                var followee = req.query.followingname || req.body.followingname
                
                if (followee == undefined) {
                    context.res.status(200).json(followlist);
                } else if (followlist.indexOf(followee) > -1) {
                    context.res.status(201).json({ bool: true })
                } else {
                    context.res.status(202).json({ bool: false })
                }
            } else {
                context.res.status(500).json({ error: "Cannot find user's followers" })
            }
        })
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass the username on the query string or in the request body."
        };
        context.done();
    }
};