exports.randomBuffer = function randomBuffer(n) {
    const data = Buffer.allocUnsafe(n);
    var random = 0;
    for ( var i = 0; i < n; i++ ) {
        random = Math.round(Math.random() * 255);
        data[i] = random;
    }

    return data;
}