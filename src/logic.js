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
  // Get element id and its color
  const id = Array.from( playerList.el.childNodes ).findIndex( it => it.title == title )
  const color = playerList.el.childNodes[id].childNodes[0].childNodes[0].value;
  // change color picker wrapper background color
  playerList.el.childNodes[id].childNodes[0].style.backgroundColor = color;
  // update color in plots
  setLineColor( title, color )
  lineChart.update( 0 );
  setPieColor( title, color )
  pieChart.update( 0 );
  //setBoxColor( title, color )
  //boxChart.update( 0 );
}

function newElement() {
  const playerName = document.getElementById("new-player-name").value;
  const playerList = document.getElementById("player-list").children[state.player];
  if (playerName === '') {
    alert("You must enter a valid player name!");
  } else if ( isDuplicatePlayerName( playerName ) ) {
    alert("The player name is already in use!");
  } else if ( playerName.length > 16 ) {
    alert("Please select a name with 16 characters or fewer.");
    return false;
  } else {
    var le = addListElement( playerName );
    const color = le.childNodes[0].childNodes[0].value;
    // also add element to charts  
    addLineDataset( playerName, new Array( state.turn-1 ), color );
    lineChart.update( 0 );
    addPieEntry( playerName, 0, color );
    pieChart.update( 0 );
    //addBoxDataset( playerName, new Array( state.turn-1 ), color );
    //boxChart.update( 0 );
    //
    le.childNodes[0].childNodes[0].onchange = function() { onColorChange( playerName ) };
    le.childNodes[2].onclick = function() { deleteElement( playerName ) };
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
  const plist = Array.from( document.getElementById( "player-list" ).children );
  while (plist.length) {
    const playerName = plist.pop().title;
    deleteElement( playerName );
  }
  state.player = 0;
  state.timer = 0;
  state.turn = 1;
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

document.addEventListener('keyup', event => {
  switch ( event.key ) {
    case "Enter":
      startStop();
      break;
    case "n":
      next();
      break;
    case "Escape":
      openCloseNav();
      break;
    default:
      return;
  }
  event.preventDefault();
});
