//================================================================
// CCurrentWeapon
//================================================================

function CWeapons() {
	this.weapon;
	this.weapons = [];
	
	this.select = function(weapon) {
		for ( var i = 0; i < this.weapons.length; i++ ) {
			$("#" + this.weapons[i].name).css("font-weight",      "normal");
			$("#" + this.weapons[i].name).css("background-color", this.weapons[i].color);		
		}
		for ( var i = 0; i < this.weapons.length; i++ ) {
			if ( this.weapons[i].name == weapon ) {
				if ( this.weapons[i].onSelect != undefined ) {
					this.weapons[i].onSelect(); 
				} else {
					this.weapon = this.weapons[i];
				}
				$("#" + this.weapon.name).css("font-weight",      "bold");
				$("#" + this.weapon.name).css("background-color", "#75c9e3");
			}
		}
	}

	this.fire = function(cell) {
		if ( this.weapon != undefined ) {
			this.weapon.fire(cell);
		}
	}
	
	this.addWeapon = function(newWeapon) {
		this.weapons.push(newWeapon);
		var span = document.createElement("span");
		span.setAttribute("id", newWeapon.name);
		span.setAttribute("class", "weapon");
		span.setAttribute("style", "background-color: " + newWeapon.color);
		span.innerHTML = newWeapon.title + " (" + newWeapon.cost + ")";
		span.onclick = function() {
			game.getWeapon().select(newWeapon.name);
			game.show();
		}
		$("#weaponsBar").append(span);
	}
}
//================================================================
// Common
//================================================================

function click(cell) {
	if ( ! cell.isBlocked() && cell.isInGame() ) {
		var result = tryPercent( cell.getPercent() );
		if ( result ) {
			game.getScore().plus();
			cell.open();
		} else {
			cell.block();
		}
	}
}

//================================================================
// CClicker
//================================================================

function CClicker() {
	this.cost   = 0;
	this.amount = 5;
	this.name   = "clicker";
	this.title  = "Кликер";
	this.color  = "#ffffff";
	
	this.fire = function(cell) {
		click(cell);
	}
}

//================================================================
// COneOfThree
//================================================================

function COneOfThree() {
	this.cost   = 4;
	this.amount = 5;
	this.name   = "oneOfThree";
	this.title  = "Триплет";
	this.color  = "#ffffff";
	
	this.fire = function(cell) {
		if ( ! cell.isBlocked() && cell.isInGame() && pay(this.cost) ) {
			var result = tryPercent( cell.getPercent() ) || tryPercent( cell.getPercent() ) || tryPercent( cell.getPercent() );
			if ( result ) {
				game.getScore().plus();
				cell.open();
			} else {
				cell.block();
			}
		}
	}
}

//================================================================
// CBestOf
//================================================================

function CBestOf() {
	this.val    = 5;
	
	this.cost   = 2;
	this.amount = 5;
	this.name   = "bestOf" + this.val;
	this.title  = "Триспяти";
	this.color  = "#ffffff";
	
	this.fire = function(cell) {
		if ( ! cell.isBlocked() && cell.isInGame() && pay(this.cost) ) {
			var win  = 0;
			var lose = 0;
			for ( var i = 0; i < this.val; i++ ) {
				if ( tryPercent( cell.getPercent() ) ) {
					win++;
				} else {
					lose++;
				}
			}
			
			if ( win > lose ) {
				game.getScore().plus();
				cell.open();
			} else {
				cell.block();
			}
		}
	}
}

//================================================================
// CSafeClick
//================================================================

function CSafeClick() {
	this.cost   = 2;
	this.amount = 5;
	this.name   = "safeClick";
	this.title  = "Тестер";
	this.color  = "#ffffff";
	
	this.fire = function(cell) {
		if ( ! cell.isBlocked() && cell.isInGame() && pay(this.cost) ) {
			var result = tryPercent( cell.getPercent() );
			if ( result ) {
				game.getScore().plus();
				cell.open();
			}
		}
	}
}

//================================================================
// CUnblocker
//================================================================

function CUnblocker() {
	this.cost   = 4;
	this.amount = 5;
	this.name   = "unblocker";
	this.title  = "Анблокер";
	this.color  = "#ffffff";
	
	this.fire = function(cell) {
		if ( cell.isBlocked() && cell.isInGame() && pay(this.cost) ) {
			cell.unblock();
		}
	}
}

//================================================================
// CChanceUnblocker
//================================================================

function CChanceUnblocker() {
	this.cost   = 2;
	this.amount = 5;
	this.name   = "chanceUnblocker";
	this.title  = "Шансовый анблокер";
	this.color  = "#ffffff";
	
	this.fire = function(cell) {
		if ( cell.isBlocked() && cell.isInGame() && pay(this.cost) ) {			
			var result = tryPercent( cell.getPercent() );
			if ( result ) {
				cell.unblock();
			}
		}
	}
}

//================================================================
// CPlusCell
//================================================================

function CPlusCell() {
	this.val    = 10;
	
	this.cost   = 2;
	this.amount = 5;
	this.name   = "plus" + this.val;
	this.title  = "Плюсатор";
	this.color  = "#ffffff";
	
	this.fire = function(cell) {
		if ( ! cell.isBlocked() && cell.isInGame() && pay(this.cost) ) {
			cell.setPlusPercent(this.val);
		}
	}
}

//================================================================
// CMulCell
//================================================================

function CMulCell() {
	this.val    = 2;
	
	this.cost   = 8;
	this.amount = 5;
	this.name   = "mul" + this.val;
	this.title  = "Умножатор";
	this.color  = "#ffffff";
	
	this.fire = function(cell) {
		if ( ! cell.isBlocked() && cell.isInGame() && pay(this.cost) ) {
			cell.setMulPercent(this.val);
		}
	}
}

//================================================================
// CSumAll
//================================================================

function CSumAll() {
	this.cost   = 8;
	this.amount = 5;
	this.name   = "sumAll";
	this.title  = "Сумматор";
	this.color  = "#ffffff";
	
	this.fire = function(cell) {
		if ( ! cell.isBlocked() && cell.isInGame() && pay(this.cost) ) {
			cell.setPercent( game.getField().getStartSum() );
		}		
	}
}

//================================================================
// CInvert
//================================================================

function CInvert() {
	this.cost   = 3;
	this.amount = 5;
	this.name   = "invert";
	this.title  = "Инверт";
	this.color  = "#ffffff";
	
	this.fire = function(cell) {
		if ( ! cell.isBlocked() && cell.isInGame() && pay(this.cost) ) {
			var percent = 100 - cell.getPercent();
			cell.setPercent(percent);
		}
	}
}

//================================================================
// CNewChance
//================================================================

function CNewChance() {
	this.cost   = 1;
	this.amount = 5;
	this.name   = "newChance";
	this.title  = "Заменятор";
	this.color  = "#ffffff";
	
	this.fire = function(cell) {
		if ( ! cell.isBlocked() && cell.isInGame() && pay(this.cost) ) {
			cell.setPercent(getRandomInt(1, difficulty));
		}
	}
}

//================================================================
// CNewChance
//================================================================

function CNewChance100() {
	this.cost   = 2;
	this.amount = 5;
	this.name   = "newChance100";
	this.title  = "Заменятор100";
	this.color  = "#ffffff";
	
	this.fire = function(cell) {
		if ( ! cell.isBlocked() && cell.isInGame() && pay(this.cost) ) {
			cell.setPercent(getRandomInt(1, 100));
		}
	}
}

//================================================================
// CAllUnblocker
//================================================================

function CAllUnblocker() {
	this.cost   = 20;
	this.amount = 5;
	this.name   = "allUnblocker";
	this.title  = "Полный анблок";	
	this.color  = "#ffb629";
	
	this.onSelect = function() {
		if ( pay(this.cost) ) {		
			game.getField().cycle(function(cell) {
				cell.unblock();
			});
		}
	}
}

//================================================================
// CBalance
//================================================================

function CBalance() {
	this.cost   = 2;
	this.amount = 5;
	this.name   = "balance";
	this.title  = "Балансировка";	
	this.color  = "#ffb629";
	
	this.onSelect = function() {
		if ( pay(this.cost) ) {
			percent = game.getField().getAvgPercent();
			game.getField().cycle(function(cell) {
				cell.setPercent(percent);
			});
		}
	}
}

//================================================================
// CInvertAll
//================================================================

function CInvertAll() {
	this.cost   = 16;
	this.amount = 5;
	this.name   = "invertAll";
	this.title  = "Инвертор";
	this.color  = "#ffb629";
	
	this.onSelect = function() {
		if ( pay(this.cost) ) {
			game.getField().cycle(function(cell) {
				var percent = 100 - cell.getPercent();
				cell.setPercent(percent);
			});
		}
	}
}

//================================================================
// CMassClick
//================================================================
/*
function CMassClick() {
	this.cost   = 0;
	this.amount = 5;
	this.name   = "massClick";
	
	this.onSelect = function() {
		game.getField().cycle(function(cell) {
			click(cell);
		});		
	}
}
*/
