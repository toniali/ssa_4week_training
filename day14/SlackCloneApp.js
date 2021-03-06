/**
 * Module dependencies.
 */
//var db = require('./tweets.js')
var express = require('express'),
    // , routes = require('./routes')
    // , user = require('./routes/user')
    http = require('http'),
    path = require('path'),
    slackdb = require('./SlackDB.js'),
    searchMsgUser = require('./searchMsgUser.js');


var cookieParser = require('cookie-parser');
var sqlite3 = require('sqlite3').verbose();

var filename = 'slack_app.db';
var db = new sqlite3.Database(filename);
var multer = require('multer');

var app = express();
app.use(express.static('html'));

//app.use('/Uploads/', express.static('Uploads'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// all environments
app.set('port', process.env.PORT || 8080);


var storage = multer.diskStorage({ //multers disk storage settings
	destination: function (req, file,cb) {
		console.log("1");
		
		cb(null, 'html/Uploads/');
	},
	filename: function (req, file,cb) {
		console.log("2");
		var datetimestamp = Date.now();
		
		console.log(file);
		console.log( file.originalname);
		cb(null, file.originalname);
		
	}
});

var upload = multer({ //multer settings
				storage: storage
			}).single('file');

/** API path that will upload the files */
var storage = multer.diskStorage({ //multers disk storage settings
	destination: function (req, file,cb) {
		console.log("1");
		
		cb(null, 'html/Uploads/');
	},
	filename: function (req, file,cb) {
		console.log("2");
		var datetimestamp = Date.now();
		
		console.log(file);
		console.log( file.originalname);
		cb(null, file.originalname);
		
	}
});

var upload = multer({ //multer settings
				storage: storage
			}).single('file');

/** API path that will upload the files */
app.post('/Cupload/', function(req, res) {
	upload(req,res,function(err){
        console.log(req.body.users);
        console.log(req.body.msg);
		console.log(req.body.receiver);
		console.log(req.file.filename);
		var message = req.body.msg;
		var channel =req.body.receiver;
		var user = req.body.users
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!

		var yyyy = today.getFullYear();

		if (dd < 10) { //-- ensure 2-digit day
			dd = '0' + dd
		}
		if (mm < 10) { //-- ensure 2-digit month
			mm = '0' + mm
		}

		var time = today.getTime();
		var hour = today.getHours();
		var minute = today.getMinutes();
		var second = today.getSeconds();
		if (hour < 10) { //-- ensure 2-digit hour
			hour = '0' + hour
		}
		if (minute < 10) { //-- ensure 2-digit minute
			minute = '0' + minute
		}
		if (second < 10) { //-- ensure 2-digit second
			second = '0' + second
		}

		//-- string the timestamp together
		var today = yyyy + '-' + mm + '-' + dd + ' ' + hour + ':' + minute + ':' + second;
		var filename = req.file.filename;
		var chattext = req.body.chatvalue;
		console.log(chattext);
		if (chattext ==='channel')
		{
		slackdb.insertUploadChannelChat(db, message, channel, user, today,filename).then( //done);
			function(val) {
				console.log('****/message/, val ' + val + '*');
				//json
				res.json({error_code:0,err_desc:null});

			},
			function(err) {
				res.status(500);
				res.json({error_code:1,err_desc:err});
					 return;
			}
		);
		} else if(chattext ==='direct')
		{
			
			slackdb.insertUploadDirectChat(db, user,channel,message, today,filename).then( //done);
			function(val) {
				console.log('****/message/, val ' + val + '*');
				//json
				res.json({error_code:0,err_desc:null});

			},
			function(err) {
				res.status(500);
				res.json({error_code:1,err_desc:err});
					 return;
			}
		);
		}
			// if(err){
				 // res.json({error_code:1,err_desc:err});
				 // return;
			// }
		   // res.json({error_code:0,err_desc:null});
	});
});

app.post('/Dupload/', function(req, res) {
	upload(req,res,function(err){
         console.log(req.body.users);
        console.log(req.body.msg);
		console.log(req.body.receiver);
		console.log(req.file.filename);
		var message = req.body.msg;
		var channel =req.body.receiver;
		var user = req.body.users
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!

		var yyyy = today.getFullYear();

		if (dd < 10) { //-- ensure 2-digit day
			dd = '0' + dd
		}
		if (mm < 10) { //-- ensure 2-digit month
			mm = '0' + mm
		}

		var time = today.getTime();
		var hour = today.getHours();
		var minute = today.getMinutes();
		var second = today.getSeconds();
		if (hour < 10) { //-- ensure 2-digit hour
			hour = '0' + hour
		}
		if (minute < 10) { //-- ensure 2-digit minute
			minute = '0' + minute
		}
		if (second < 10) { //-- ensure 2-digit second
			second = '0' + second
		}

		//-- string the timestamp together
		var today = yyyy + '-' + mm + '-' + dd + ' ' + hour + ':' + minute + ':' + second;
		var filename = req.file.filename;
		slackdb.insertUploadDirectChat(db, user,channel,message, today,filename).then( //done);
			function(val) {
				console.log('****/message/, val ' + val + '*');
				//json
				res.json({error_code:0,err_desc:null});

			},
			function(err) {
				res.status(500);
				res.json({error_code:1,err_desc:err});
					 return;
			}
		);
			
		if(err){
			 res.json({error_code:1,err_desc:err});
			 return;
		}
		 res.json({error_code:0,err_desc:null});
	});
});
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
//app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));

// development only
//if ('development' == app.get('env')) {
// // app.use(express.errorHandler());
//}
//
//app.get('/', routes.index);
//app.get('/users', user.list);


//app.get('/', getDefaultIndex);
app.get('/login/:userName', getSlackUserID);

app.get('/channel/:userName', getChannelByUser);
app.get('/channelChats/:channelName', getChannelChatByChannelName);
app.get('/direct/:userName', getPrivateChannelsByUserName);
app.get('/message/:channelName/:userName', getDirectMessages);
//search
//app.get('/searchMsg/:searchKeyword', getSearchMsgResults);
app.get('/searchMsg/:searchKeyword/userName/:userName', getSearchMsgResults);

//-- user id sending a message
app.post('/message/', function(req, res) {
    var message = req.body.message;
    var channel = req.body.channel;
    var user = req.body.user;

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();

    if (dd < 10) { //-- ensure 2-digit day
        dd = '0' + dd
    }
    if (mm < 10) { //-- ensure 2-digit month
        mm = '0' + mm
    }

    var time = today.getTime();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();
    if (hour < 10) { //-- ensure 2-digit hour
        hour = '0' + hour
    }
    if (minute < 10) { //-- ensure 2-digit minute
        minute = '0' + minute
    }
    if (second < 10) { //-- ensure 2-digit second
        second = '0' + second
    }

    //-- string the timestamp together
    var today = yyyy + '-' + mm + '-' + dd + ' ' + hour + ':' + minute + ':' + second;


    //console.log('in /message/, message=' + message);
    slackdb.insertChannelChat(db, message, channel, user, today).then( //done);
        function(val) {
            console.log('****/message/, val ' + val + '*');
            //json
            res.send('inserted new message: ' + message);

        },
        function(err) {
            res.status(500);
            res.send('Could not insert message: ' + message);
        }


    )

});

app.post('/saveDirectMessage/', function(req, res) {
   
    var sender = req.body.sender;
    var receiver = req.body.receiver;
    var message = req.body.message;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();

    if (dd < 10) { //-- ensure 2-digit day
        dd = '0' + dd
    }
    if (mm < 10) { //-- ensure 2-digit month
        mm = '0' + mm
    }

    var time = today.getTime();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();
    if (hour < 10) { //-- ensure 2-digit hour
        hour = '0' + hour
    }
    if (minute < 10) { //-- ensure 2-digit minute
        minute = '0' + minute
    }
    if (second < 10) { //-- ensure 2-digit second
        second = '0' + second
    }

    //-- string the timestamp together
    var today = yyyy + '-' + mm + '-' + dd + ' ' + hour + ':' + minute + ':' + second;


    //console.log('in /message/, message=' + message);
    slackdb.insertDirectChat(db,sender, receiver,message, today).then( 
        function(val) {
            console.log('****/saveDirectMessage/, val ' + val + '*' + ' inserted new direct message: ' + message);
            //json
            res.send('inserted new direct message: ' + message);

        },
        function(err) {
            res.status(500);
            res.send('Could not insert direct message: ' + err);
        }


    )

});

app.post('/createTeam/', function(req, res) {
    var name = req.body.name;
    var desc = req.body.desc;
    var user = req.body.user;
	console.log('****/createTeam/, name=' + name + '*' + ', desc=' + desc);

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();

    if (dd < 10) { //-- ensure 2-digit day
        dd = '0' + dd
    }
    if (mm < 10) { //-- ensure 2-digit month
        mm = '0' + mm
    }

    var time = today.getTime();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();
    if (hour < 10) { //-- ensure 2-digit hour
        hour = '0' + hour
    }
    if (minute < 10) { //-- ensure 2-digit minute
        minute = '0' + minute
    }
    if (second < 10) { //-- ensure 2-digit second
        second = '0' + second
    }

    //-- string the timestamp together
    var today = yyyy + '-' + mm + '-' + dd + ' ' + hour + ':' + minute + ':' + second;

    var p = slackdb.createTeam(db, name, desc, user, today);
    p.then( 
        function(val) {
            console.log('****/createTeam/, val ' + val + '*' + ' inserted new team: ' + name);
            //json
            res.send('Successfully created a team: ' + name);

        },
        function(err) {
            res.status(500);
            res.send(err);
			//console.log("err="+err);
			//res.send(JSON.stringify(err));
        }


    )

});

//app.get('/tweet/:userid', followedTweet.tweet);

//app.get('/followedtweet', getFollowedTweets('abu'));


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});


function getSlackUserID(req, res) {
    var str = '<B>***getSlackUserID**</B>';

    console.log(req.params.userName);
    if (req.params.userName === 'favicon.ico') {
        res.send();
    }
    var UserName = req.params.userName;
    //		var tweets =  getFollowedTweets(req.params.userid );
    // res.send(str+ getFollowedTweets(req.params.userid ).toString());
    console.log('in getSlackUserID, username = ' + UserName);

    slackdb.getSlackUser(db, UserName).then( //done);
        function(val) {
            console.log('****getSlackUserID, val ' + val + '*');
            //json
            res.cookie('UserName', UserName);
            res.send(val);

        },
        function(err) {
            done(err);
        }


    )
};


function getChannelByUser(req, res) {
    var str = '<B>***getChannelByUser**</B>';
    var username = req.params.userName;
    //	var tweets =  getFollowedTweets(req.params.userid );
    // res.send(str+ getFollowedTweets(req.params.userid ).toString());
    console.log('in channelJSONPromisePublic, username=' + username);


    slackdb.channelJSONPromisePublic(db, username).then( //done);
        function(val) {
            console.log('****channelJSONPromisePublic, val=' + val + '*');

            res.send(val);

        },
        function(err) {
            done(err);
        }


    )
};




function getChannelChatByChannelName(req, res) {
    var str = '<B>***getChannelChatByChannelName**</B>';
    var channelName = req.params.channelName;
    //		var tweets =  getFollowedTweets(req.params.userid );
    // res.send(str+ getFollowedTweets(req.params.userid ).toString());
    console.log('in getChannelChatByChannelName, channelName=' + channelName);
    slackdb.channelChatJSONPromisePublic(db, channelName).then( //done);
        function(val) {
            console.log('****channelChatJSONPromisePublic, val ' + val + '*');
            //json
            res.send(val);

        },
        function(err) {
            done(err);
        }


    )
};

function getPrivateChannelsByUserName(req, res) {
    var userName = req.params.userName;

    slackdb.privateChannelsJSONPromisePublic(db, userName).then(
        function(val) {
            console.log('****privateChannelsJSONPromisePublic, val=' + val + '*');
            res.send(val);
        },
        function(err) {
            console.log('****privateChannelsJSONPromisePublic, err=' + err + '*');
            done(err);
        }

    )
};

function getDirectMessages(req, res) {
    var channelName = req.params.channelName;
    var userName = req.params.userName;
    slackdb.directMessagesJSONPromisePublic(db, channelName, userName).then(
        function(val) {
            console.log('****directMessagesJSONPromisePublic, val=' + val + "'");
            res.send(val);
        },
        function(err) {
            done(err);
        }
    )

};

function getDefaultIndex(req, res) {
    console.log('in default.');
    var _dirname = 'C:\\project\\ssa4_week_training\\day8\\slackclone\\html';
    res.sendFile(_dirname + '\\Welcome.html');
}





function getSearchMsgResults(req, res) {
    var str = '<B>***getSearchMsgResults**</B>';
    var searchKeyword = req.params.searchKeyword;
	var userName = req.params.userName;
    //			var tweets =  getFollowedTweets(req.params.userid );
    // res.send(str+ getFollowedTweets(req.params.userid ).toString());
    console.log('in getSearchMsgResults, searchKeyword=' + searchKeyword);
    searchMsgUser.searchChannelMsgJSONPromisePublic(db, searchKeyword, userName).then( //done);
        function(val) {
            console.log('**** in getSearchMsgResults, searchChannelMsgJSONPromisePublic, val ' + val + '*');
            //json
            res.send(val);

        },
        function(err) {
            done(err);
        }
    )
};