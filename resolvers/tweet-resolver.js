module.exports.resolveModularContent = function(tweet){
    const tweetLink = tweet.tweet_link.value;

    return `<a href="${tweetLink}">${tweetLink}</a>`;
}