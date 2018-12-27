module.exports.resolveModularContent = function (tweet) {
    const tweetLink = tweet.tweetLink.value;

    return `<a href="${tweetLink}">${tweetLink}</a>`;
}