var secret = require('../client.secret');
var tracker  = require("pivotaltracker"),
    projectID = secret.pivotaltracker.pivotaltracker_project,
    projectStartDate = secret.project_startdate,
    token = secret.pivotaltracker.pivotaltracker_api_token;

var async = require('async');
var jQuery = require('jquery-deferred');

module.exports = {
    createMilestone: function (milestone) {
        var client = new tracker.Client({trackerToken:token});

        var startDate = new Date(projectStartDate);
        startDate.setTime( startDate.getTime() + parseInt(milestone.replace('#','')) * 604800000 );

        var data = {
            name: 'Sprint ' + milestone,
            description: '',
            storyType: 'release',
            deadline: startDate,
            // currentState: 'unscheduled',
            // requestedById: REQUESTED_BY_ID,
            // ownerIds: [OWNER_ID],
            // estimate: 2,
            // comments: [{
            //     personId: REQUESTED_BY_ID,
            //     text: 'whoa, auto new story comment!'
            // }],
            // tasks: [{
            //     description: 'wow, auto new story task!!'
            // }],
        };
        // return client.project(projectID).stories.create(data).promise();
        var df = jQuery.Deferred();
        // console.log('milestone:', data);
        client.project(projectID).stories.create(data, function(error, story) {
            if (error) {
                console.log(error);
                df.reject();
            } else {
                console.log('sprint:', story);
                df.resolve(story ? story.id : null);                
            };
        }); 
        return df.promise();
        
    },
    createStory: function (milestone, newStory, done) {
        var client = new tracker.Client({trackerToken:token});
        
        var data = {
            name: newStory.title,
            description: '',
            storyType: 'feature',
            currentState: 'unscheduled',
            labels: newStory.labels,
            // requestedById: REQUESTED_BY_ID,
            // ownerIds: [OWNER_ID],
            // estimate: 2,
            // comments: [{
            //     personId: REQUESTED_BY_ID,
            //     text: 'whoa, auto new story comment!'
            // }],
            // tasks: [{
            //     description: 'wow, auto new story task!!'
            // }],
        };
        
        client.project(projectID).stories.create(data, function(error, story) {
            console.log('story:', story? story.name : null);
            if (error) {
                done(error);
            }
            else {
                done();
            }
        });
    }
}