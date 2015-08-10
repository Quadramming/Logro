/* var colors = [
	"#FFFFFF",
	
	"#702000",
	"#803010",
	"#904020",
	"#A05030",
	"#B06040",
	
	"#C07050",
	"#D08060",
	"#E09070",
	"#F0A080",
	"#FFB090"
]; */

var colors = [
	"#FFFFFF",
	"#ffb629",
	"#288990",
	"#a5c5c2",
	"#45769e",
	"#75c9e3",
];

var openScore  = 3;
var difficulty = 100;
var cellDeep   = 5;

//================================================================
// CCell
//================================================================

function CCell() {
	//this.percents     = shuffle( [5, 15, 25, 35, 45, 55, 65, 75, 85, 95] );
	//this.percents     = shuffle( [5, 25, 45, 65, 85] );
	this.percents     = [];
	for ( var i = 0; i < cellDeep; i++ ) {
		this.percents.push(getRandomInt(1, difficulty));
	}
	
	this.level        = this.percents.length;
	this.startPercent = this.percents[this.level - 1];
	this.percent      = this.percents[this.level - 1];
	this.blocked      = false;
	this.color        = colors[this.level];
	this.maxPercent   = 1000;
	
	this.getPercents = function() {
		return this.percents;
	}
	
	this.open = function() {
		if ( this.level != 0 ) {
			this.level--;
			this.color = colors[this.level];
			if ( this.level == 0 ) {
				this.startPercent = 0;
				this.percent      = 0;
			} else {
				this.startPercent = this.percents[this.level - 1];
				this.percent      = this.startPercent;
			}
		}
	}
	
	this.block = function() {
		this.color   = "gray";
		this.blocked = true;
		this.percent = this.startPercent;
	}
	
	this.unblock = function() {
		this.color   = colors[this.level];
		this.blocked = false;
	}	
	
	this.isBlocked = function() {
		return this.blocked;
	}
	
	this.isInGame = function() {
		return this.level != 0;
	}
	
	this.getStartPercent = function() {
		return this.startPercent;
	}
	
	this.setPercent = function(percent) {
		this.percent = percent;
	}
	
	this.setPlusPercent = function(percent) {
		this.percent += percent;
	}
	
	this.setMulPercent = function(mul) {
		this.percent *= mul;
	}	
	
	this.getPercent = function() {
		return this.percent;
	}
	
	this.getPercentHtml = function() {
		var html = this.percent + " %";
		if ( this.percent != this.startPercent ) {
			html = "<b>" + html + "</b>";
		}
		return html
	}
	
	this.getColor = function() {
		return this.color;
	}
	
	this.checkCorrect = function() {
		if ( this.percent > this.maxPercent ) {
			this.percent = this.maxPercent;
		}
		if ( this.percent < 0 ) {
			this.percent = 1;
		}		
	}
	
};

//================================================================
// CScore
//================================================================

function CScore() {
	this.score = 0;
	
	this.get = function() {
		return this.score;
	}
	
	this.plus = function(val) {
		if ( val === undefined ) {
			val = openScore;
		}
		this.score += val;
	}
	
	this.minus = function(minus) {
		if ( this.score - minus < 0 ) {
			return false;
		} else {
			this.score -= minus;
			return true;
		}
	}
	
	this.show = function() {
		$("#score").html(this.score);
	}
	
}

//================================================================
// Field
//================================================================

function CField(height, width) {
	this.height = height;
	this.width  = width;
	this.field  = [];

	//================================
	// Init
	//================================
	
	for ( var i = 0; i < height; i++ ) {
		this.field[i] = [];
		for ( var j = 0; j < width; j++ ) {
			this.field[i][j] = new CCell();
		}
	}

	//================================
	// Methods
	//================================
	
	this.cycle = function(func) {
		for ( var i = 0; i < height; i++ ) {
			for ( var j = 0; j < width; j++ ) {
				if ( this.field[i][j].isInGame() ) {
					func( this.field[i][j] );
				}
			}
		}
	}
	
	this.getAvgPercent = function() {
		var result = 0;
		var count  = 0;
		for ( var i = 0; i < this.height; i++ ) {
			for ( var j = 0; j < this.width; j++ ) {
				if ( this.field[i][j].isInGame() ) {
					result += this.field[i][j].getPercent();
					count++;
				}
			}
		}
		if ( count == 0 ) {
			count = 1;
		}
		return Math.floor( result/count );
	}
	
	this.getOverallAvg = function() {
		var arr = [];
		for ( var i = 0; i < this.height; i++ ) {
			for ( var j = 0; j < this.width; j++ ) {
				arr = arr.concat( this.field[i][j].getPercents() );
			}
		}
		
		var sum = 0;
		for ( var i = 0; i < arr.length; i++ ) {
			sum += arr[i];
		}
		return Math.floor( sum/arr.length );
	}
	
	this.getSum = function() {
		var result = 0;
		for ( var i = 0; i < this.height; i++ ) {
			for ( var j = 0; j < this.width; j++ ) {
				if ( this.field[i][j].isInGame() ) {
					result += this.field[i][j].getPercent();
				}
			}
		}
		return result;
	}	
	
	this.getStartSum = function() {
		var result = 0;
		for ( var i = 0; i < this.height; i++ ) {
			for ( var j = 0; j < this.width; j++ ) {
				if ( this.field[i][j].isInGame() ) {
					result += this.field[i][j].getStartPercent();
				}
			}
		}
		return result;
	}		
	
	this.get = function(y, x) {
		return this.field[y][x];
	}
	
	this.checkCorrect = function() {
		this.cycle(function(cell) {
			cell.checkCorrect();
		});
	}
	
	this.getFieldTbody = function() {
		var tbody = document.createElement("TBODY");
		for ( var i = 0; i < this.height; i++ ) {
			var tr = document.createElement("TR");
			for ( var j = 0; j < this.width; j++ ) {
				var td = document.createElement("TD");
				var bgColor = this.field[i][j].getColor();
				td.setAttribute("style", "background-color:" + bgColor);
				td.innerHTML = this.field[i][j].getPercentHtml();
				
				function setOnclick(i, j) {
					td.onclick = function() {
						game.getWeapon().fire(game.getField().get(i, j));
						game.show();
					}				
				}
				setOnclick(i, j);
				
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}		
		return tbody;
	}
}

//================================================================
// Functions
//================================================================

function shuffle(o) {
    for ( var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x );
    return o;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function tryPercent(percent) {
	return getRandomInt(0,99) < percent;
}

function restartWithDifficulty(diff) {
	difficulty = diff;
	game.restart();
}

function pay(val) {
	return game.getScore().minus(val);
}

//================================================================
// CGame
//================================================================

function CGame() {
	this.field;
	this.score;
	this.weapon;
	this.isActive;
	
	this.getField = function() {
		return this.field;
	}
	
	this.getScore = function() {
		return this.score;
	}	
	
	this.getWeapon = function() {
		return this.weapon;
	}
	
	this.start = function() {
		this.isActive = true;
		
		this.score   = new CScore();
		this.field   = new CField(3, 3);
		this.showOverallAvg();
		this.showDifficulty();
			
		this.weapon  = new CWeapons();
		
		this.weapon.addWeapon(new CClicker());
		this.weapon.addWeapon(new CSafeClick());
		
		this.weapon.addWeapon(new COneOfThree());
		this.weapon.addWeapon(new CBestOf());
		this.weapon.addWeapon(new CPlusCell());
		this.weapon.addWeapon(new CMulCell());
		this.weapon.addWeapon(new CSumAll());
		this.weapon.addWeapon(new CInvert());
		this.weapon.addWeapon(new CNewChance());
		this.weapon.addWeapon(new CNewChance100());
		
		this.weapon.addWeapon(new CBalance());
		this.weapon.addWeapon(new CInvertAll());
		
		this.weapon.addWeapon(new CUnblocker());
		this.weapon.addWeapon(new CChanceUnblocker());
		this.weapon.addWeapon(new CAllUnblocker());

		this.weapon.select("clicker");
		
		this.show();
	}
	
	this.restart = function() {
		this.clear();
		this.start();
	}
	
	this.clear = function() {
		$("#field").empty();
		$("#weaponsBar").empty();
		$("#h1Fail").html("");
		$("#h1Success").html("");
	}
	
	this.showWin = function() {
		$("#h1Success").html("You win");
	}

	this.showLose = function() {
		$("#h1Fail").html("You lose");
	}
	
	this.showField = function() {
		$("#field").empty();
		$("#field").append(game.getField().getFieldTbody());
	}

	this.showSum = function() {
		$("#sum").html(game.getField().getStartSum() + "%");
	}
	
	this.showAvg = function() {
		$("#avg").html(game.getField().getAvgPercent() + "%");
	}

	this.showOverallAvg = function() {
		$("#overallAvg").html(game.getField().getOverallAvg() + "%");
	}
	
	this.showDifficulty = function() {
		$("#difficulty").html(difficulty);
	}	
	
	this.lose = function() {
		this.isActive = false;
		this.clear();
		this.score.show();
		this.showLose();
	}
	
	this.show = function () {
		if ( this.isActive ) {
			this.field.checkCorrect();
			this.showField();
			this.showAvg();
			this.showSum();
			this.score.show();
		}
		if ( this.field.getSum() == 0 ) {
			this.isActive = false;
			this.clear();
			this.showWin();
		}		
	}	
	
}

//================================================================
// Main
//================================================================
var game;

$(function() {
	game = new CGame();
	game.start();
});