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

Meteor.methods({
  gamesInsert: function(teamOneId, teamTwoId){

    var userId = Meteor.userId();

    check(userId, String);
    check(teamOneId, String);
    check(teamTwoId, String);

    var teamOne = Teams.findOne({_id: teamOneId, ownerId: userId});
    var teamTwo = Teams.findOne({_id: teamTwoId, ownerId: userId});

    if (!teamOne || !teamTwo){
      throw new Meteor.Error('invalid-parameters', 'One of the team doesn\'t exist in the database');
    }

    var teamOneData = {
      _id: teamOne._id,
      name: teamOne.name,
      score: 0
    };

    var teamTwoData = {
      _id: teamTwo._id,
      name: teamTwo.name,
      score: 0
    };

    var game = {
      ownerId: Meteor.userId(),
      createdAt: new Date(),
      teams: [teamOneData, teamTwoData],
      completed: false
    };

    var gameId = Games.insert(game);

    Teams.update({_id: teamOneId}, {$addToSet: {gameIds: gameId}});
    Teams.update({_id: teamOneId}, {$addToSet: {gameIds: gameId}});

    return gameId;
  }
});
