var Resource = require('./resource');
var util = require("util");
var _ = require("underscore");


function Like(session, params) {
    Resource.apply(this, arguments);
}

module.exports = Like;
util.inherits(Like, Resource);

var Request = require('./request');


Like.prototype.parseParams = function (json) {
    return json || {};
};


Like.create = function(session, mediaId) {
    return new Request(session)
        .setMethod('POST')
        .setResource('like', {id: mediaId})
        .generateUUID()
        .setData({
            media_id: mediaId,
            src: "profile"
        })
        .signPayload()
        .send()
        .then(function(data) {
           // console.log(data);
            return new Like(session, {});
        })
}