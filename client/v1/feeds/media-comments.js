var _ = require('underscore');
var Promise= require('bluebird');

function MediaCommentsFeed(session, mediaId) {
    this.lastMaxId = null;
    this.moreAvailable = true;
    this.mediaId = mediaId;
    this.session = session; 
}

module.exports = MediaCommentsFeed;
var Request = require('../request');
var Comment = require('../comment');

MediaCommentsFeed.prototype.setMaxId = function (maxId) {
    this.lastMaxId = maxId;
};

MediaCommentsFeed.prototype.getMaxId = function () {
    return this.lastMaxId;
};

MediaCommentsFeed.prototype.isMoreAvailable = function() {
    return this.moreAvailable;
};

MediaCommentsFeed.prototype.setIsMoreAvailable = function(bool) {
    this.moreAvailable= bool;
};








MediaCommentsFeed.prototype.get = function () {
    var that = this;
    //console.log(that);
    return new Request(that.session)
        .setMethod('GET')
        .setResource('mediaComments', {
            mediaId: that.mediaId,
            maxId: that.lastMaxId
        })
        .send()
        .then(function(data) {
           // console.log(data);
           return data;
          
        })
};

MediaCommentsFeed.prototype.getAllPlease = function (cb) {
    var that= this;
    
    
    function outer() {
       //var allComments=[];
       return new Promise(function(resolve, reject){
           function inner(allCom) {
               var allCom= allCom || [];
               that.get().then(function(data){
                    //console.log("OMG IM DYING");
                   //console.log("---------------DATA---------------");
                    //console.log(data);
                    if(data.has_more_comments) {
                         that.setMaxId(data.next_max_id);
                        //console.log("---------------HAS MORE, RECURSING!---------------");
                        //console.log(data.comments);
                        //console.log("-------------------------------------");
                        var temp= allCom.concat(data.comments);
                        allCom= temp;
                        inner(allCom);
                    } else {
                        //console.log("---------------all done!---------------");
                        //console.log(data.comments);
                        //console.log("------------------------------");
                        var temp= allCom.concat(data.comments);
                        allCom= temp;
                        resolve(allCom);
                    }
                });
               
           }
          inner();  
           
       }) 
        
     }
    
    outer().then(function(results){
        //console.log("---------------RETURNING RESULTS---------------");
        //console.log(results);
        cb(results);
    })
    
   
    
    
}


