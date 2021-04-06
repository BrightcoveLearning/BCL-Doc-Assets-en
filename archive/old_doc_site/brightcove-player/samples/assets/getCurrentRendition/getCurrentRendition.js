/**
 * get properties for the current rendition
 * in each player on a page
 * as an in-page script, this would need to be inside
 * a metadataloaded event handler
 */
players = videojs.players;
for (player in players) {
    console.log('Player: ', player);
    console.log('Current Rendition: ', players[player].tech.currentSource_);
}

/**
 * this version gives a slightly better display
 * but works only in Chrome or Firefox
 */
players = videojs.players;
for (player in players) {
    console.log('Player: ', player);
    console.dir(players[player].tech.currentSource_);
}
