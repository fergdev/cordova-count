function dbConnect(){
	console.log("HELLO WORLD");
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(populateDB, errorCB, successCB);
}

function populateDB(tx){
//	tx.executeSql('DROP TABLE counters');
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
	        
		var html= '<div id="count-'+row['id']+'" class="counter-li">'; 
		html+='<div class="column-a"><i class="fa fa-minus fa-4x inc-btn" onclick="decrementCounter('+row['id']+','+row['increment']+');"></i></div>';		

		html+='<div class="column-c"><i class="fa fa-plus fa-4x inc-btn" onclick="incrementCounter('+row['id']+','+row['increment']+');"></i></div>';		
			
		html+='<div class="column-b">';
		html+='<h4 class="counter-name">'+row['name']+'</h4>';
		html+='<h4 id="cv-'+row['id']+'" class="counter-value">'+row['value']+'</h4>';
		html+='</div>';
	
		html += '</div>';
		//console.log(html);	
		counterList.append(html);
		$("#count-"+row['id']).swiperight(function(){
		//	console.log("SWIPE R" + row['id'] );
			removeCounter(row['id']);
		});
		$("#count-"+row['id']).swipeleft(function(){
			console.log("SWIPE L" + row['id'] );
			removeCounter(row['id']);
		});
	});
//	$('#counterList').listview('refresh');
	//$(".counterLi").removeClass('counterLi').addClass('counterLi');
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
	
	//Change page
	$.mobile.changePage("#index-page",{transition:"slide"});

	//redraw counters
	getCounters();
	console.log('END ADD COUNTER');
}

function removeCounter(id){
	console.log('REMOVE COUNTER ' + id)
	
	// Fade out li
	$("#count-"+id).stop(true,true).fadeOut("slow",function(){}); 
	
	
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	db.transaction(function(tx){
		tx.executeSql("DELETE FROM counters WHERE id= "+id,[],successCB,errorCB)	
	});
	navigator.vibrate(500);
	//redraw counters
	//getCounters();
}
function decrementCounter(id, diff){
	console.log('Decrement Counter');
	var db = window.openDatabase("counters", "1.0", "counters", 200000);
	
	// Get and update value in html
	elem = $("#cv-"+id);
	var val = parseInt(elem.text());
	val = val - diff;
	elem.text(val);
	// Update db
	db.transaction(function(tx){
		tx.executeSql("UPDATE counters SET value = "+val+" WHERE id = "+id,[],successCB,errorCB);	
	});

	// wiggle dec btn
	doBounce($("#dec-btn-"+id), 3, '10px', 50);
	animateUpdate(id);
	navigator.vibrate(500);
	playClick();
}
function incrementCounter(id, diff){
	console.log('Increment Counter');
	var db = window.openDatabase("counters", "1.0", "counters", 200000);

	elem = $("#cv-"+id);
	var val = parseInt(elem.text());
	val = val + diff;
	elem.text(val);
	
	db.transaction(function(tx){
		tx.executeSql("UPDATE counters SET value = "+val+" WHERE id = "+id,[],successCB,errorCB);
	});
	
	// wiggle inc btn
	//$("#inc-btn-"+id).stop(true,true).effect('shake',{times:3,distance:5,direction:"up"},250);
	doBounce($("#inc-btn-"+id), 3, '10px', 50);
	
	animateUpdate(id);
	navigator.vibrate(500);
	playClick();
}
function updateSettings(){
	//Change page
	$.mobile.changePage("#index-page",{transition:"slide"});
}
function animateUpdate(id){
	console.log('AnimateUpdate')
	$('#cv-'+id).stop(true,true).animate({opacity:0},250);
	$('#cv-'+id).stop(true,true).animate({opacity:1},250);
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

function doBounce(element, times, distance, speed) {
	element.finish();
	for(i = 0; i < times; i++) {
        	element.animate({marginTop: '-='+distance},speed)
            	.animate({marginTop: '+='+distance},speed);
    	}        
}
