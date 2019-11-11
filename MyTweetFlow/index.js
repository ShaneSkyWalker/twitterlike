const azure = require('azure-storage');

const tableService = azure.createTableService('twitterlikestorage', '3ApdznssqQjjmOz07RtKH+55nhMWVj6fvvNEFXN19vD4Ym+P+R8N85PcHVDDxmt8yeRVwTMma4cr8euQLo08GQ==');

module.exports = function (context, req) {
    context.log('Start check someone\'s tweet');

    if (req.body.username) {

        var username = req.body.username

        var queryMyTweets = new azure.TableQuery()
            .select(['Sender', 'Content', 'Timestamp'])
            .where('Sender eq ?', username);
        tableService.queryEntities('Tweets', queryMyTweets, null, function (error, result, response) {
            if (!error) {
                /* var tmp1 = response.body.value[0].Timestamp
                var tmp2 = response.body.value[1].Timestamp
                console.log(tmp1 > tmp2) */
                var res = selectionSort(response.body.value);
                context.res.status(201).json(res)
            } else {
                context.res.status(500).json({ error: "Cannot find the user's tweets." })
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