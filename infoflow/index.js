
const azure = require('azure-storage');

const tableService = azure.createTableService('twitterlikestorage', '3ApdznssqQjjmOz07RtKH+55nhMWVj6fvvNEFXN19vD4Ym+P+R8N85PcHVDDxmt8yeRVwTMma4cr8euQLo08GQ==');

module.exports = function (context, req) {
    context.log('Start loading infoflow');

    if (req.body.username) {

        var username = req.body.username;
        var queryFollowing = new azure.TableQuery()
            .select(['Following'])
            .where('Username eq ?', username);

        tableService.queryEntities('Relations', queryFollowing, null, function (error, result, response) {
            if (!error) {

                var entries = result.entries;
                var followlist = new Array();
                entries.forEach(entry => {
                    followlist.push(entry['Following']['_']);
                });
                if (followlist.length > 0) {
                    var queryTweet = new azure.TableQuery().top(20)
                        .select(['Sender', 'Content', 'Timestamp'])
                        .where('Sender eq ?', followlist[0])

                    for (let index = 1; index < followlist.length; index++) {
                        const element = followlist[index];
                        queryTweet.or('Sender eq ?', element)
                    }
                    tableService.queryEntities('Tweets', queryTweet, null, function (error, result, response) {
                        if (!error) {
                            var restweets = [];
                            var tweets = result.entries;
                            tweets.forEach(entry => {
                                let timestamp = entry['Timestamp']['_']
                                let content = entry['Content']['_']
                                let sender = entry['Sender']['_']
                                restweets.push({ 'Timestamp': timestamp, 'Content': content, 'Sender': sender })
                            });
                            restweets = selectionSort(restweets)
                            context.res.status(201).json(restweets)
                        } else {
                            context.res.status(500).json({ error: error })
                        }
                    });
                }
                
            } else {
                context.res.status(500).json({ error: error })
            }
        })
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass an item in the request body"
        };
        context.done();
    }
};

function selectionSort(arr) {
    var len = arr.length;
    var minIndex, temp;
    for (var i = 0; i < len - 1; i++) {
        minIndex = i;
        for (var j = i + 1; j < len; j++) {
            if (arr[j].Timestamp > arr[minIndex].Timestamp) {
                minIndex = j;
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    return arr;
}