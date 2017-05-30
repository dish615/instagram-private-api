var Resource = require('./resource');
var util = require("util");
var _ = require("underscore");
var crypto = require('crypto');


function Comment(session, params) {
    Resource.apply(this, arguments);
}

util.inherits(Comment, Resource);
module.exports = Comment;

var Request = require('./request');
var Account = require('./account');
var Media = require('./media');


Comment.prototype.parseParams = function (json) {
  var hash = {};
  hash.created = json.created_at;
  hash.status = (json.status || "unknown").toLowerCase();
  hash.text = json.text;
  hash.mediaId = json.media_id;
  hash.id = json.pk || json.id;
  this.account = new Account(this.session, json.user);
  return hash;
};


Comment.prototype.account = function () {
  return this.account;
};


Comment.prototype.getParams = function () {
    return _.defaults({
        account: this.account.params
    }, this._params);
};


Comment.create = function(session, mediaId, text) {
    return new Request(session)
        .setMethod('POST')
        .setResource('comment', {id: mediaId})
        .generateUUID()
        .setData({
            media_id: mediaId,
            src: "profile",
            comment_text: text,
            idempotence_token: crypto.createHash('md5').update(text).digest('hex')
        })
        .signPayload()
        .send()
        .then(function(data) {
            return new Comment(session, data.comment)
        })
}