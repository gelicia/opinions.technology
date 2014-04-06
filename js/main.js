function opinionate(){
	var adj = new Miso.Dataset({
		url : "data/adjectives.csv",
		delimiter : ","
	});

	var tech = new Miso.Dataset({
		url : "data/technology.csv",
		delimiter : ","
	});

	adj.fetch({
		success: function(){
			var adjChoice = this.rowByPosition(Math.floor(Math.random() * this.length));
			document.getElementById("adj").innerHTML = adjChoice.adjective;
		}
	});

	tech.fetch({
		success: function(){
			var techChoice = this.rowByPosition(Math.floor(Math.random() * this.length));
			document.getElementById("tech").innerHTML = techChoice.technology;
		}
	});
}