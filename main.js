require('dotenv').config()
const Twit = require('twitter-v2')
const { Client } = require('discord.js');
const client = new Client({ intents: 2048 });


var T = new Twit({
  // consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  // consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  // access_token_key:         process.env.TWITTER_ACCESS_TOKEN,
  // access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
  // timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  // strictSSL:            true,     // optional - requires SSL certificates to be valid.
  bearer_token:  process.env.BEARER_TOKEN
})

//   //only show owner tweets
async function sendMessage (tweet, client){
  console.log(tweet)
  
  try {
    const url = "https://twitter.com/user/status/" + tweet.id;
    console.log("triggered start")
    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID)
    channel.send(`${process.env.CHANNEL_MESSAGE} ${url}`)
    console.log("I have success")
  } catch (error) {
        console.error(error);
  }
}

async function listenForever(streamFactory, dataConsumer) {
  try {
    for await (const { data } of streamFactory()) {
      dataConsumer(data);
    }
    // The stream has been closed by Twitter. It is usually safe to reconnect.
    console.log('Stream disconnected healthily. Reconnecting.');
    listenForever(streamFactory, dataConsumer);
  } catch (error) {
    // An error occurred so we reconnect to the stream. Note that we should
    // probably have retry logic here to prevent reconnection after a number of
    // closely timed failures (may indicate a problem that is not downstream).
    console.warn('Stream disconnected with error. Retrying.', error);
   // listenForever(streamFactory, dataConsumer);
  }
}

async function  setup () {
  const endpointParameters = {
      'tweet.fields': [ 'author_id', 'conversation_id' ],
      'expansions': [ 'author_id', 'referenced_tweets.id' ],
      'media.fields': [ 'url' ]
  }
  try {
    console.log('Setting up Twitter....')
    /*const add_value_body = {
      "add": [
        {"value": "from:"+ "aimi_sound", "tag": "from 愛美"},
        {"value": "from:"+ "chiharu_okr", "tag": "from 千春"},
        {"value": "from:"+ "aimistaff", "tag": "from 愛美staff"},
        {"value": "from:"+ "teamy_official", "tag": "from Team-Y"},
        {"value": "from:"+ "aikojinguji", "tag": "from 神宮寺愛子"},
      ]
    }
   const r = await T.post("tweets/search/stream/rules", add_value_body);*/
   /*const delete_value_body={
    delete: {
      //IDs of all deleted user-specified stream filtering rules.
      ids: ['1660858019725578240'],
    },
   }
   const r = await T.post("tweets/search/stream/rules", delete_value_body)*/
    const t=await T.get("tweets/search/stream/rules")
    console.log(t)
    console.log("execute line 61")
  } catch (err) {
    console.log(err)
  }

  listenForever(
    () => T.stream('tweets/search/stream'),
    (data) => sendMessage(data, client)
  );
}
// Add above rule

client.login(process.env.DISCORD_TOKEN)
 client.on('ready', () => {
   console.log('Discord ready')
   setup()

 })
