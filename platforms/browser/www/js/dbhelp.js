

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
	        
		var html = '<li id="count-'+row['id']+'" class="counter-li">'; 
//		html+='<div class="column-a"><input type="submit" class="delete-btn fa-input fa-3x" value="&#xf068;" onclick="decrementCounter('+row['id']+')"></input></div>';
 		html+='<div class="column-a"><i class="fa fa-minus fa-3x d-btn" onclick="decrementCounter('+row['id']+')"></i></div>'		
		html+='<div class="column-b">';
		html+='<h4 class="counter-name">'+row['name']+'</h4>';
		
		html+='<h4 class="counter-value">'+row['value']+'</h4>';
		html+='</div>'
		//html+='<div class="column-c"><input type="submit" class="btn fa-input fa-3x" value="&#xf067;" onclick="incrementCounter('+row['id']+')"></input></div>';
		html+='<div class="column-c"><i href="" class="fa fa-3x fa-plus d-btn" onclick="incrementCounter('+row['id']+')"></i></div>'		
	
		//html+='<div class="column-d"><input type="submit" class="btn fa-input fa-3x" value="&#xf1f8;" onclick="removeCounter('+row['id']+')"></input></div>';
		html+='<div class="column-d"><i href="" class="fa fa-3x fa-trash d-btn" onclick="removeCounter('+row['id']+')"></i></div>'		
	
//		html='<input type="submit" class="btn fa-input" value="&#xf1f8;">'

		html+='</li>';
//		console.log(html)	
		counterList.append(html);
		$( "#count-"+row['id'] ).on( "swipe", swipeHandler );		
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
function swipeHandler(event){
	console.log('SWIPE "' + event.target+'"')

}
function addCounter(){
	console.log("Add counter");
	
	name = document.getElementById('counter-name').value;
	console.log('NAME ' + name)
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(function(tx){
		tx.executeSql("INSERT INTO counters(name,value) VALUES (\'"+name+"\',0)",[],successCB,errorCB)	
	});
	//redraw counters
	getCounters();
}

function removeCounter(id){
	console.log('REMOVE COUNTER ' + id)
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(function(tx){
		tx.executeSql("DELETE FROM counters WHERE id= "+id,[],successCB,errorCB)	
	});
	//redraw counters
	getCounters();
}
function decrementCounter(id){
	console.log('Decrement Counter');
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(function(tx){
		tx.executeSql("UPDATE counters SET value = value - 1 WHERE id = "+id,[],successCB,errorCB);	
	});

	//redraw counters
	getCounters();
}
function incrementCounter(id){
	console.log('Increment Counter');
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(function(tx){
		tx.executeSql("UPDATE counters SET value = value + 1 WHERE id = "+id,[],successCB,errorCB);
	});

	//redraw counters
	getCounters();
}

function errorCB(err){
	console.log("Error processing SQL : " + err.code );       
}
function successCB(){
	console.log("SUCCESS");
}
function inputFocus(i){
    if(i.value==i.defaultValue){ i.value=""; i.style.color="#000"; }
}
function inputBlur(i){
    if(i.value==""){ i.value=i.defaultValue; i.style.color="#888"; }
}
