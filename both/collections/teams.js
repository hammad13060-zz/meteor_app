Teams = new Mongo.Collection('teams');

Teams.allow({

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
  teamUpdate: function(teamId,teamName){
    var userId = Meteor.userId();

    check(userId, String);
    check(teamName, String);
    check(teamId, String);

    var team = Teams.findOne({_id: teamId, ownerId: userId});
    if (team){
      Teams.update(teamId, {$set: {name: teamName}}, function(error){
        if (!error){
          if(team.gameIds){
            var games = Games.find({_id: {$in: team.gameIds}});

            games.fetch().forEach(function(game){
              game.teams.map(function(team){
                if(team._id == teamId){
                  team.name = newName;
                }

                Games.update({_id: game._id}, {$set: {teams: game.teams}});
              })
            });
          }

          return teamId;
        }
      });
    }
    else {
      throw new Metero.Error("team doesn't exist", "This team doesn't exist int the database");
    }
  }
});
