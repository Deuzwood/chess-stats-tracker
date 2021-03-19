let stored, last;

const urlParams = new URLSearchParams(window.location.search);

let actualise = async (name, type = 'blitz', format = 'global') => {
    try {
        let response = await fetch(
            'https://api.chess.com/pub/player/' + name + '/stats'
        );
        let data = await response.json();
        if (typeof stored === 'undefined') {
            stored = data;
        }
        console.log(data);
        console.log(name);
        last = data;
        let s = getString(type, format);
        previsualization.innerHTML = s;
        stats.innerHTML = s;
    } catch (err) {
        console.error(err);
    }
};

btn_help.addEventListener('click', (event) => {
    help.classList = help.classList.value === 'd-none' ? 'container' : 'd-none';
});

popout.addEventListener('click', (event) => {
    event.preventDefault();
    window.open(
        document.URL +
            '/?name=' +
            document.querySelector('#name').value +
            '&type=' +
            type.value +
            '&format=' +
            format.value,
        '',
        'status=no, menubar=no, toolbar=no scrollbars=no'
    );
});

let getString = (type, format) => {
    if (format == 'global') {
        return (
            last['chess_bullet'].last.rating +
            ' : ' +
            last['chess_' + type].record.win +
            ' / ' +
            last['chess_' + type].record.draw +
            ' / ' +
            last['chess_' + type].record.loss
        );
    } else if (format == 'session') {
        let modif =
            last['chess_bullet'].last.rating -
            stored['chess_' + type].last.rating;
        let sign = Math.sign(modif) >= 0 ? '+' : '';
        elo = last['chess_' + type].last.rating + ' (' + sign + modif + ')';
        win =
            last['chess_' + type].record.win -
            stored['chess_' + type].record.win;
        draw =
            last['chess_' + type].record.draw -
            stored['chess_' + type].record.draw;
        loss =
            last['chess_' + type].record.loss -
            stored['chess_' + type].record.loss;

        return elo + ' : ' + win + ' / ' + draw + ' / ' + loss;
    }
};

function updateVizualisation() {
    actualise(
        document.querySelector('#name').value,
        document.querySelector('#type').value,
        document.querySelector('#format').value
    );
}

document.querySelector('#name').addEventListener('change', (event) => {
    updateVizualisation();
});

document.querySelector('#type').addEventListener('change', (event) => {
    updateVizualisation();
});

document.querySelector('#format').addEventListener('change', (event) => {
    updateVizualisation();
});

document.querySelector('#copy').addEventListener('click', (event) => {
    event.preventDefault();
    if (!navigator.clipboard) {
        return;
    }
    navigator.clipboard.writeText(
        document.URL +
            '?name=' +
            document.querySelector('#name').value +
            '&type=' +
            type.value +
            '&format=' +
            format.value
    );
});

if (urlParams.get('name') === null || urlParams.get('name') === '') {
    container.classList = 'container';
} else {
    stats.classList = '';
    actualise(
        urlParams.get('name'),
        urlParams.get('type'),
        urlParams.get('format')
    );
    setInterval(
        actualise,
        1000 * 60 * 0.5,
        urlParams.get('name'),
        urlParams.get('type'),
        urlParams.get('format')
    );
}
