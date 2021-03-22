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

let getString = (type, format) => {
    let chess_type = 'chess_' + type;
    try {
        if (format == 'global') {
            return (
                last[chess_type].last.rating +
                ' : ' +
                last[chess_type].record.win +
                ' / ' +
                last[chess_type].record.draw +
                ' / ' +
                last[chess_type].record.loss
            );
        } else if (format == 'session') {
            let modif =
                last[chess_type].last.rating - stored[chess_type].last.rating;
            let sign = Math.sign(modif) >= 0 ? '+' : '';
            elo = last[chess_type].last.rating + ' (' + sign + modif + ')';
            win = last[chess_type].record.win - stored[chess_type].record.win;
            draw =
                last[chess_type].record.draw - stored[chess_type].record.draw;
            loss =
                last[chess_type].record.loss - stored[chess_type].record.loss;
            return elo + ' : ' + win + ' / ' + draw + ' / ' + loss;
        }
    } catch (error) {
        return `<span class="text-danger">${last.message}</span>`;
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
    document.querySelector('#name').classList.remove('is-invalid');
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

document.querySelector('#popout').addEventListener('click', (event) => {
    event.preventDefault();
    if (document.querySelector('#name').value.length != 0) {
        window.open(
            document.URL +
                '?name=' +
                document.querySelector('#name').value +
                '&type=' +
                type.value +
                '&format=' +
                format.value,
            '',
            'status=no, menubar=no, toolbar=no scrollbars=no'
        );
    } else {
        document.querySelector('#name').classList.add('is-invalid');
    }
});

if (urlParams.get('name') === null || urlParams.get('name') === '') {
    main.classList.remove('d-none');
    console.log(urlParams.get('name'));
} else {
    stats.classList.remove('d-none');
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
