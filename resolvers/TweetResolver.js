module.exports.ResolveModularContent = function(tweet){
    let tweetLink = tweet.tweet_link.value;
    return `<a href="${tweetLink}">${tweetLink}</a>`;
}