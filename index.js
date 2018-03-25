// by Plasmoxy

(function (){

  let start = (name, team) => {
    window.location.href = '/game/game.html?' + 'name='+name + '&team='+team;
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

})();
