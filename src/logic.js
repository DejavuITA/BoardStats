function isDuplicatePlayerName( text ) {
  // returns true when new name is already in the list of player names
  const names = Array.from( playerList.el.childNodes ).map( a => a.title );
  return names.includes( text );
}

function deleteElement( title ) {
  const names = Array.from( playerList.el.childNodes ).map( a => a.title );
  const id = names.indexOf( title );
  const loggedNames = [... new Set( logs.map( a => a.player ) )];
  const tf = loggedNames.includes( title )
  if ( !tf ) {
    removeLineDataset( title );
    lineChart.update( 0 );
    removePieEntry( title );
    pieChart.update( 0 );
    //removeBoxDataset( title );
    //boxChart.update( 0 );
  }
  if ( id < state.player ) {
    state.player--;
  } else if (id == state.player) {
    let N = document.getElementById("player-list").children.length - 1;
    if (id >= N) {
      state.player = 0;
      state.turn++;
    }
  }
  playerList.el.removeChild( playerList.el.childNodes[id] );
  return tf;
}

function onColorChange( title ) {
  let id = Array.from( playerList.el.childNodes ).findIndex( it => it.title == title )
  let color = playerList.el.childNodes[id].childNodes[0].value;
  setLineColor( title, color )
  lineChart.update( 0 );
  setPieColor( title, color )
  pieChart.update( 0 );
  //setBoxColor( title, color )
  //boxChart.update( 0 );
}

function newElement() {
  const inputValue = document.getElementById("new-player-name").value;
  const playerList = document.getElementById("player-list").children[state.player];
  if (inputValue === '') {
    alert("You must enter a valid player name!");
  } else if ( isDuplicatePlayerName( inputValue ) ) {
    alert("The player name is already in use!");
  } else {
    var le = addListElement( inputValue );
    // also add element to charts  
    addLineDataset( inputValue, new Array( state.turn-1 ).fill(0), le.childNodes[0].value );
    lineChart.update( 0 );
    addPieEntry( inputValue, 0, le.childNodes[0].value );
    pieChart.update( 0 );
    //addBoxDataset( inputValue, new Array( state.turn-1 ).fill(0), le.childNodes[0].value );
    //boxChart.update( 0 );
    //
    le.childNodes[0].onchange = function() { onColorChange( inputValue ) };
    le.childNodes[2].onclick = function() { deleteElement( inputValue ) };
  }
  document.getElementById("new-player-name").value = "";
  return false;
}

function updateAllData( T1, T2 ) {
  let overwrite = !(T1 == T2);
  let name = playerList.el.childNodes[ state.player ].title;
  // update data
  updateLineChartData( overwrite, name, T2 );
  updatePieChartData( name, T2 );
  //updateBoxChartData( overwrite, name, T2 );
  return false;
}

function startStop() {
  switch (state.timer) {
    case 0:
      let player = document.getElementById("player-list").children[state.player];
      //let name = player.title;
      logStart( player.title );
      // set state and button properties
      state.timer = 1;
      document.getElementById("start-stop-icon").className = "fa fa-pause"
      return false;
    case 1:
      const T2 = logStop();
      const T1 = logFuse();
      console.log( T1, T2)
      // update data
      updateAllData( T1, T2 );
      // reset state and button properties
      state.timer = 0;
      document.getElementById("start-stop-icon").className = "fa fa-play"
      return false;
  }
}

function next() {
  switch (state.timer) {
    case 0:
      nextPlayer();
      return false;
    case 1:
      const T2 = logStop();
      updateAllData( T2, T2 );
      // select next player
      nextPlayer();
      let player = document.getElementById("player-list").children[state.player];
      logStart( player.title );
      return false;
  }
}

function reset() {
  while (logs.length) { logs.pop() }
  let plist = Array.from( document.getElementById( "player-list" ).children );
  state.player = 0;
  state.timer = 0;
  state.turn = 1;
  while (state.list.length) { state.list.pop() }
  // reset line chart
  resetLineChart();
  lineChart.update();
  // reset pie chart
  resetPieChart();
  pieChart.update();
  // reset box chart
  //resetBoxChart();
  //boxChart.update();
  return false;
}

function updateBackgroundColor() {
  const plist = Array.from( document.getElementById( "player-list" ).children );
  const names = [...new Set( logs.map( a => a.player ) )];
  let i;
  for (i=0; i<names.length; i++) {
    plist.find( a => a.title == names[i]).child
  }
  plist.find( a => a.title == "Player 1").children[0].value
}