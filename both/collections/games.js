Games = new Mongo.Collection('games');

Games.allow({

  insert: function(userId, doc){
    var result = userId && doc.ownerId === userId;

    return (result === null ? false : true);
  },

  update: function(userId, doc, fields, modifier){
    var result = doc.ownerId === userId;
    return (result === null ? false : true);
  },

  remove: function(userId, doc){
    var result = userId === doc.ownerId;
    return (result === null ? false : true);
  },

  fetch: ['ownerId']
});
