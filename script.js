let stored,last;

const urlParams = new URLSearchParams(window.location.search);


let actualise = (name, type, time) => { 
  fetch('https://api.chess.com/pub/player/'+name+'/stats')
  .then(response => {
    return response.json()
  })
  .then(data => {
    if(typeof stored === "undefined")
    {
        stored = data;
    }
    last = data;
    render( type , time );
  })
  .catch(err => {
    console.error(err)
  })

}

let render = (game="bullet",time="all") => {
  document.querySelector('#info').innerHTML='Chess '+game+' - '+time.replace('all','All time');

  if(time=='all'){
    elo.innerHTML = stored['chess_'+game].last.rating;
    
    win.innerHTML = stored['chess_'+game].record.win;
    draw.innerHTML = stored['chess_'+game].record.draw;
    loss.innerHTML = stored['chess_'+game].record.loss;

    }
  if(time=='today'){
    let modif = last['chess_'+game].last.rating-stored['chess_'+game].last.rating
    let sign = Math.sign(modif)>=0 ? '+' : '';
    elo.innerHTML = last['chess_'+game].last.rating + " ("+sign+modif+')';
    
    win.innerHTML = last['chess_'+game].record.win-stored['chess_'+game].record.win;
    draw.innerHTML = last['chess_'+game].record.draw-stored['chess_'+game].record.draw;
    loss.innerHTML = last['chess_'+game].record.loss-stored['chess_'+game].record.loss;
  }
}
console.log(urlParams.get('name'));

if(urlParams.get('name')===null || urlParams.get('name') === ""){
  form.classList = ''
}
else{

  stats.classList = ''
  actualise(urlParams.get('name'), urlParams.get('type') , urlParams.get('time') )
  setInterval(actualise,1000*60*0.5)
}






