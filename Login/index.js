module.exports = async function (context, req) {
    
    context.log('JavaScript HTTP trigger [login] function processed a request.');
    const inputTable=context.bindings.inputTable;

    if(inputTable){
        var username=inputTable["username"]
        if (username != null && username != undefined) {
            var thPassword=inputTable["password"]
            
        }
        

        context.res = {
            status: 200, /* Defaults to 200 */
            body: "Getting record id " + theID + ": ("+theRole+", "+theAuthor+")"
        }; 
    } else { 
        context.res = {
            status: 500,
            body: "System inner error!"
        }; 
    }
};