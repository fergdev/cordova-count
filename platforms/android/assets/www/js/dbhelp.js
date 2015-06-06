

function dbConnect(){
	console.log("HELLO WORLD");
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(populateDB, errorCB, successCB);
}

function populateDB(tx){
	tx.executeSql('CREATE TABLE IF NOT EXISTS counters (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, value INTEGER NOT NULL)');
       //	tx.executeSql('INSERT INTO counters(name,value) VALUES ("swears", 1)');
       // tx.executeSql('INSERT INTO counters(name,value) VALUES ("farts", 2)');
	//tx.executeSql('INSERT INTO counters(name,value) VALUES ("pooops", 3)');
}	

function getCounters(){
	console.log('getCounters')
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM counters",[],renderCounters,errorCB)	
	});
}
function renderCounters(tx, results){
	var counterList = $('#counterList')
	counterList.empty();
	$.each(results.rows,function(index){
		var row = results.rows.item(index);
	        
		var html = '<li>'; 

		html+='<input type="button" value="+" onclick="incrementCounter(\''+row['name']+'\'")></input>';
		html+='<h3>'+row['name']+'</h3>';
		
		html+='<h4>'+row['value']+'</h4>';
		html+='<input type="button" value="-" onclick="decrementCounter(\''+row['name']+'\'")></input>';
       		html+='</li>';
		console.log(html)	
		counterList.append(html);
		/* 
	        counterList.append('<li>')
		counterList.append('<input type="button" value="+" onclick="incrementCounter(\''+row['name']+'\')></input>')
		counterList.append('<h3>'+row['name']+'</h3>')
		
		counterList.append('<h4>'+row['value']+'</h4>')
		counterList.append('<input type="button" value="-" onclick="decrementCounter(\''+row['name']+'\')"></input>');
       		counterList.append('</li>')
	*/
		}
	);
	$('#counterList').listview('refresh');
}

function addCounter(name){
	console.log("Add counter");
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(function(tx){
		tx.executeSql("INSERT INTO counters(name,value) VALUES (\'"+name+"\',0)",[],successCB,errorCB)	
	});
	//redraw counters
	getCounters();
}

function removeCounter(name){
	console.log('RMOVE COUNTER')
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(function(tx){
		tx.executeSql("REMOVE FROM counters WHERE name= \'"+name+"\'",[],successCB,errorCB)	
	});
}
function decremnetCounter(name){
	console.log('Decrement Counter')

}
function incrementCounter(name){
	console.log('Increment Counter')
}

function errorCB(err){
	console.log("Error processing SQL : " + err.code );       
}
function successCB(){
	console.log("SUCCESS");
}

