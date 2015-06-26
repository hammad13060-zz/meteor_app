Template.teams.helpers({

  teams: function(){
    return Teams.find();
  },

  isCreatingTeam: function(){
    return Session.get('isCreatingTeam');
  }

});

Template.teams.events({
  'click a.create': function(e, tpl){
    e.preventDefault();
    Session.set('isCreatingTeam', true)
  },

  'click a.cancel': function(e, tpl){
    e.preventDefault();
    Session.set('isCreatingTeam', false);
  },

  'submit form.create-team': function(e, tpl){
    e.preventDefault();
    var teamName = tpl.$('input[name=name]').val();
    Teams.insert({name: teamName}, function(error, _id){
      if (error){
        alert(error);
        Session.set('isCreatingTeam', true);
        Tracker.afterFlush(function(){
          tpl.$('input[name=name]').val(teamName);
        });
      }
    });
    Session.set('isCreatingTeam', false);
  },

  'click a.remove': function(e, tpl){
    e.preventDefault();
    Teams.remove(this._id);
  }

});
