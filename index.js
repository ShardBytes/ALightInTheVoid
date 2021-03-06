// by Plasmoxy
const DEVELOPMENT_MODE = true;

$(function (){

  /* setup buttons and launch */

  let start = (name, team) => {
    window.location.href = (DEVELOPMENT_MODE ? '/game/game.html?' : '/game?')
      + 'name='+name
      + '&team='+team
      + ( $('#musicOff').prop('checked') ? '&nomusic' : '')
  };

  let getName = () => {
    return $('#nameInput').val();
  };

  $('#bteam1').click(() => {
    let n = getName();
    if (n != '') {
      start(n, '1');
    } else {
      $('#errorText').css('display', 'block');
    }
  });

  $('#bteam2').click(() => {
    let n = getName();
    if (n != '') {
      start(n, '2');
    } else {
      $('#errorText').css('display', 'block');
    }
  });

});
