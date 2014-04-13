var techID;
var adjID;

function opinionate(){
	var randomPairPromise = getRandomPair();
	randomPairPromise.done(
		function(result){
			var dbStr = 'https://opinionstechnology.firebaseio.com/' + result.tech.id + '/' + result.adj.id;
			var dataRef = new Firebase(dbStr);
			dataRef.on('value', function(snapshot) {
				var posVotes = snapshot.val() === null || snapshot.val()["1"] === null ? 0 : Number(snapshot.val()["1"]);				
				var negVotes = snapshot.val() === null || snapshot.val()["0"] === undefined ? 0 : Number(snapshot.val()["0"]);
				document.getElementById("agree").innerHTML = posVotes;
				document.getElementById("disagree").innerHTML = negVotes;
			});
		}
	);
}

function getRandomPair(){
	var def = $.Deferred();
	var techChoice;
	var adjChoice;

	var adj = new Miso.Dataset({
		url : "data/adjectives.csv",
		delimiter : ","
	});

	var tech = new Miso.Dataset({
		url : "data/technology.csv",
		delimiter : ","
	});

		tech.fetch({
		success: function(){
			techChoice = this.rowByPosition(Math.floor(Math.random() * this.length));
			techID = techChoice.id;
			document.getElementById("tech").innerHTML = techChoice.technology;
		}
	}).then(function(){
		adj.fetch({
		success: function(){
				adjChoice = this.rowByPosition(Math.floor(Math.random() * this.length));
				adjID = adjChoice.id;
				document.getElementById("adj").innerHTML = adjChoice.adjective;

				def.resolve({"tech":techChoice, "adj": adjChoice});
			}
		});
	});
	return def.promise();
}

function addOpinion(vote){
	var opinionRef = new Firebase('https://opinionstechnology.firebaseio.com/' + techID + '/' + adjID);
	var votesCnt = 0;
	//it displays the new value on the page after a vote. If theres no opposite vote, it shows NaN, so we'll initialize that to 0 if it doesn't exist
	var oppVoteCount = null;

	//it will skip this if a value does not exist
	opinionRef.on('value', function(snapshot) {
		votesCnt = snapshot.child(vote).val();
		oppVoteCount = snapshot.child(vote == "0" ? "1" : "0").val();
	});

	votesCnt = votesCnt + 1;

	var obj = {};
	obj[vote] = votesCnt;
	obj[vote == "0" ? "1" : "0"] = oppVoteCount === null ? 0 : oppVoteCount;
	opinionRef.update(obj);
	location.reload();
}