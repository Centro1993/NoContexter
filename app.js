var Snooper = require('reddit-snooper')
const config = require('./config.json')

snooper = new Snooper(
    {
        // credential information is not needed for snooper.watcher
        username: config.username,
        password: config.password,
        app_id: config.app_id,
        api_secret: config.api_secret,
        //user_agent: 'OPTIONAL user agent for your bot',

        automatic_retries: true, // automatically handles condition when reddit says 'you are doing this too much'
        api_requests_per_minute: 60 // api requests will be spread out in order to play nicely with Reddit
    })

snooper.watcher.getCommentWatcher('all') // blank argument or 'all' looks at the entire website
    .on('comment', function(comment) {

        // check if comment text contains r/nocontext
        if(comment.data.body.match(/r\/nocontext/i)) {
            // comment is a object containing all comment data
            console.log('comment was posted by: ' + comment.data.author)
            console.log(comment.data.body)

            // check if comment has parent comment
            if(comment.data.parent_id && comment.data.parent_id.split('_')[0] === 't1') {
                snooper.api.get('/api/info', { id: 't1_e40c6o3'}, function(err, responseCode, responseData) {
                    if (err) {
                        return console.error("api request failed: " + err)
                    }

                    console.log("Post this to /r/NoContext:")
                    console.log(responseData.data.children[0].data.body)
                })
            }
        }
    }).on("error", console.error)

snooper.api.post('')