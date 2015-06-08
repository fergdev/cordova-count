

function dbConnect(){
	console.log("HELLO WORLD");
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(populateDB, errorCB, successCB);
}

function populateDB(tx){
	tx.executeSql('DROP TABLE counters');
	tx.executeSql('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS counters (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, value INTEGER NOT NULL, increment INTEGER NOT NULL)');
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
	console.log('RENDER COUNTERS');
	var counterList = $('#counterList');
	counterList.empty();
	console.log('TODO cleanup event handlers on li');
	
	$.each(results.rows,function(index){
		var row = results.rows.item(index);
	        
		var html = '<li id="count-'+row['id']+'" class="counter-li">'; 
 		html+='<div class="column-a"><i class="fa fa-minus fa-3x inc-btn" onclick="decrementCounter('+row['id']+','+row['increment']+')"></i></div>'		
		html+='<div class="column-b">';
		html+='<h4 class="counter-name">'+row['name']+'</h4>';
		
		html+='<h4 class="counter-value">'+row['value']+'</h4>';
		html+='</div>'
		html+='<div class="column-c"><i href="" class="fa fa-3x fa-plus inc-btn" onclick="incrementCounter('+row['id']+','+row['increment']+')"></i></div>'		
	
		html+='</li>';

//		console.log(html)	
		counterList.append(html);
		
		$("#count-"+row['id']).swiperight(function(){
		//	console.log("SWIPE R" + row['id'] );
			removeCounter(row['id']);
		});
		$("#count-"+row['id']).swipeleft(function(){
			console.log("SWIPE L" + row['id'] );
			removeCounter(row['id']);
		});
	
	}
	);
	$('#counterList').listview('refresh');
}
function addCounter(){
	console.log("Add counter");

	counter_name_tb = $('#counter-name');
	value_tb = $('#counter-value');
	increment_tb = $('#counter-increment');

	name = counter_name_tb.prop('value');
	value = value_tb.prop('value');
	increment = increment_tb.prop('value');

	if(value == ""){
		value = 0;
	}
	if(increment == ""){
		increment = 1;
	}

	counter_name_tb.val(counter_name_tb.prop("defaultValue"));
	value_tb.val(value_tb.prop("defaultValue"));
	increment_tb.val(increment_tb.prop("defaultValue"));

	console.log('NAME ' + name + " " + value + " " + increment )
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(function(tx){
		tx.executeSql("INSERT INTO counters(name,value,increment) VALUES (\'"+name+"\',"+value+","+increment+")",[],successCB,errorCB)	
	});
	//redraw counters
	getCounters();
	console.log('END ADD COUNTER');
}

function removeCounter(id){
	console.log('REMOVE COUNTER ' + id)
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(function(tx){
		tx.executeSql("DELETE FROM counters WHERE id= "+id,[],successCB,errorCB)	
	});
	navigator.vibrate(500);
	//redraw counters
	getCounters();
}
function decrementCounter(id, diff){
	console.log('Decrement Counter');
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(function(tx){
		tx.executeSql("UPDATE counters SET value = value - "+diff+" WHERE id = "+id,[],successCB,errorCB);	
	});

	//redraw counters
	getCounters();
}
function incrementCounter(id, diff){
	console.log('Increment Counter');
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(function(tx){
		tx.executeSql("UPDATE counters SET value = value + "+diff+" WHERE id = "+id,[],successCB,errorCB);
	});
	navigator.vibrate(500);
	playClick();
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

function isNumber(evt){
	console.log('isNumber');
	evt = (evt) ? evt : window.event;
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	if(charCode > 31 && (charCode < 48 || charCode >57)){
		return false;
	}
	return true;
}


function playClick(){
	console.log('Play click');
	var url = "media/click.wav";
	var url = "file:///android_asset/www/media/click.wav"
	myAudio = new Media(url,
        	// success callback
             	function () { console.log("playAudio():Audio Success"); },
            	// error callback
             	function (err) { console.log("playAudio():Audio Error: " + err); }
    	);
        // Play audio
    	myAudio.play();
}
