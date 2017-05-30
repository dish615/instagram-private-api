var _ = require('underscore');

function FollowingMediaFeed(session) {
    this.session = session;
}

module.exports = FollowingMediaFeed;
var Media = require('../media');
var Request = require('../request');
var Helpers = require('../../../helpers');
var Exceptions = require('../exceptions');



FollowingMediaFeed.prototype.get = function () {
    var that = this;
    return new Request(that.session)
        .setMethod('GET')
        .setResource('followingMediaFeed')
        .send()
        .then(function(data) {
            
            return data;
       
        })
};