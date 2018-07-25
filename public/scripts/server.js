module.exports.formatPrice = function(price, language) {
    return price.toLocaleString(language, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2
    });
};