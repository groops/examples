# Groops: Node + Express

## Setup

### 1. Configure the database

Before you can run the app you need to set up a Mongo database. This can be any Mongo instance (including one running locally), although if you need a simple hosted option, create a free account at [MongoLab](https://mongolab.com/) or [MongoHQ](https://www.mongohq.com/) and create an empty database (called "groops" or similar).

Once you have a database ready to go, open up `config.json` and edit the database config section as needed. When you're done, it should look something like this (example MongoLab config):

    {
      "mode": "development",
      "mongo": {
        "host": "ds12345.mongolab.com",
        "port": 12345,
        "database": "groops",
        "username": "groops",
        "password": "pa$$word"
      }
    }

**Note**: don't use "pa$$word" ;)  You'll want to keep the mode set to "development" for now (basically just enables some extra console logging).

### 2. Install Node and npm if needed

Should be obvious, but you'll need these. Nowadays it's pretty simple &mdash; Joyent publishes installation packages for all major platforms at [nodejs.org](http://nodejs.org/download/), so just grab the appropriate version and install it. Npm comes bundled with Node, so after the install you should be good to go.

### 3. Configure the application

The great thing about most Node modules and applications is that dependencies are stored in `package.json`, so all you need to do is install them. Open your favorite terminal and run:

    npm install

### 4. Run it

If all went well, the app should now "just work" &trade;:

    node index

Problems? Suggestions? Bugs? [Let us know](https://github.com/groops/examples/issues).

Pull requests always welcome.
