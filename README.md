# twitterlike

This twitter-like application basically served as a social media website. It has shrined function as twitter.

## publish

### Install dependencies

Before you can get started, you should install .NET Core 2.1. You should also install Node.JS which includes npm, which is how you will obtain the Azure Functions Core Tools. If you prefer not to install Node, see the other installation options in our Core Tools reference.

Run the following command to install the Core Tools package:

```shell
npm install -g azure-functions-core-tools
```

### Create an Azure Functions project

In the terminal window or from a command prompt, navigate to an empty folder for your project, and run the following command:

```shell
func init
```

You will also be prompted to choose a runtime for the project. Select node.

### Create a function

To create a function, run the following command:

```shell
func new
```

This will prompt you to choose a template for your function. We recommend HTTP trigger for getting started.

### Run your function project locally

Run the following command to start your function app:

```shell
func  start
```

The runtime will output a URL for any HTTP functions, which can be copied and run in your browser's address bar.

To stop debugging, use Ctrl-C in the terminal.

### Deploy your code to Azure

To publish your Functions project into Azure, enter the following command:

```shell
func azure functionapp publish twitterlike
```

You may be prompted to sign into Azure. Follow the onscreen instructions.

### Upload file to a container

```shell
az storage blob upload-batch -s template/ -d \$web --account-name twitterlikestorage
```

### References

#### Code Rerefences

* https://medium.com/medialesson/azure-functions-crud-with-table-storage-javascript-nodejs-9ce694dfcf76

learn to use the azure-storage packages

#### Package or framework used

* "https://cdn.staticfile.org/jquery/3.2.1/jquery.min.js"
* "https://cdn.staticfile.org/popper.js/1.12.5/umd/popper.min.js"
* "https://cdn.staticfile.org/twitter-bootstrap/4.1.0/js/bootstrap.min.js"
* "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css"

for the view and style in the front end.
