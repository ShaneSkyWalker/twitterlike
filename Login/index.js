module.exports = async function (context, req) {

    context.log('JavaScript HTTP trigger [login] function processed a request.');

    const inputTable = context.bindings.inputTable;

    if (inputTable) {

        var username = req.body == undefined ? req.query.username : req.body.username
        var password = inputTable["password"]
        var email = inputTable["email"]
        inputPsw = req.body == undefined ? req.query.password : req.body.password
        if (password != inputPsw) {
            context.log.error("Input password error!")
            context.res = {
                status: 401,
                body: "password error!"
            }
        } else {
            context.log.info("Login succeeded.")
            context.res = {
                status: 200,
                body: { url: "main-page.html?username=" + username }
            }
        }
    } else {
        // Cannot find the user
        context.log.error("Cannot find the user!")
        context.res = {
            status: 400,
            body: "User not exist!"
        }
    }


};