const azure = require('azure-storage');

const tableService = azure.createTableService('twitterlikestorage', '3ApdznssqQjjmOz07RtKH+55nhMWVj6fvvNEFXN19vD4Ym+P+R8N85PcHVDDxmt8yeRVwTMma4cr8euQLo08GQ==');


module.exports = function (context, req) {
    context.log('Start querying user');

    if (req.body.username) {

        var username = req.body.username;
        var followname = req.body.followname;
        var queryUser = new azure.TableQuery()
            .select(['Username', 'Following'])
            .where('Following eq ?', followname);
        tableService.queryEntities('Relations', queryUser, null, function(error, result, response) {
            if (!error) {
                var follower = []
                var hasfollow = false
                response.body.value.forEach(element => {
                    follower.push(element.Following)
                    if (username == element.Username) {
                        hasfollow = true
                    }
                });
                context.res.status(201).json( {follow: follower, hasfollow: hasfollow })
            } else {
                context.res.status(500).json({ error: "Cannot find user's followers" })
            }
        })
    } else if (req.body.token) {
        var queryUser = new azure.TableQuery()
            .select(['username'])
            .where('token eq ?', req.body.token)
        tableService.queryEntities('User', queryUser, null, function(error, result, response) {
            if (!error) {
                context.res.status(201).json({ username: result.entries[0]['username']['_'] })
            } else {
                context.res.status(400).json({ error: "User not found!" })
            }
        })
    } else {
        context.res = {
            status: 400,
            body: "Please pass the username on the query string or in the request body"
        };
        context.done();
    }
};