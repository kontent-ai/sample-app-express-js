export function resolveModularContent (tweet) {
    const tweetLink = tweet.tweetLink.value;

    return `<a href="${tweetLink}">${tweetLink}</a>`;
}