/**
 * http://usejsdoc.org/
 */
var express = require('express');
var asserts =  require('assert');
var sqlite3 = require('sqlite3').verbose();
var slackdb = require ('./SlackDB.js');

//var _ = require('lodash');

describe ('DB module', () => {
	var db1 = new sqlite3.Database('slack_test.db');
	
		
		before (() => {
			  db1.run('begin');
			
		});
		
		after (() => {
			 db1.run('rollback');  
		});

	//conn	
		
it('1. test select channel without insert', function (done) {
		
	var username = 'abu';
	
	var expectedChannelName =['A_channel'];
	console.log('****1');
	 //insert data
	 var newChannelName = "C_channel";
		var newTeamName = 'Wonder_team2';
		
		
		console.log ("expectedChannelName="+expectedChannelName);
		  
	slackdb.channelJSONPromisePublic(db1, username).then( //done);
		function (val) {
			console.log('****2 '+val +'*');	
			
	    	 console.log('length='+ val.length);

	    	 var actual = val;
				console.log ("actual="+val);
					
			try{
				asserts.deepEqual(actual, expectedChannelName);
				done();
			} catch (err){
				console.log ('in done try err, '+ err);
			}
			
		},
		function (err) {
			done(err);
		}
			
)
 
	
	console.log('****3');
	
	});
});
