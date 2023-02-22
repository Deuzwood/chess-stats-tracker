let stored, last;

const urlParams = new URLSearchParams(window.location.search);

const actualise = async (name, type = 'blitz', format = 'global', returnFormat = 'plain') => {
    try {
        let response = await fetch(
            'https://api.chess.com/pub/player/' + name + '/stats'
        );
        let data = await response.json();
        if (typeof stored === 'undefined') {
            stored = data;
        }
        last = data;
        let s = getString(type, format, returnFormat);
        previsualization.innerHTML = s;
        stats.innerHTML = s;
    } catch (err) {
        console.error(err);
    }
};

btn_help.addEventListener('click', (event) => {
    help.classList = help.classList.value === 'd-none' ? 'container' : 'd-none';
});

const getString = (type, format, returnFormat) => {
    const classFormat = (elo, win, draw, loss) =>
        ` <span class="elo">${elo}</span> :
        <span class="win">${win}</span> /
        <span class="draw">${draw}</span> /
        <span class="loss">${loss}</span>`;
    const jsonFomat = (elo, win, draw, loss, diff = null) => {
        let obj = {
            elo: elo,
            win: win,
            draw: draw,
            loss: loss,
        }
        if (diff !== null) {
            obj.diff = diff
        }

        return JSON.stringify(obj);
    }

    let chess_type = 'chess_' + type;
    try {
        if (format == 'global') {
            return returnFormat == "plain" ? classFormat(
                last[chess_type].last.rating,
                last[chess_type].record.win,
                last[chess_type].record.draw,
                last[chess_type].record.loss
            ) : jsonFomat(
                last[chess_type].last.rating,
                last[chess_type].record.win,
                last[chess_type].record.draw,
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
            return returnFormat == "plain" ? classFormat(elo, win, draw, loss) : jsonFomat(last[chess_type].last.rating, win, draw, loss, (sign + modif));
        }
    } catch (error) {
        return `<span class="text-danger">${last.message}</span>`;
    }
};

const getSelectedReturn = () => {
    return document.querySelector('input[name="return"]:checked').value;
}

const updateVizualisation = () => {
    actualise(
        document.querySelector('#name').value,
        document.querySelector('#type').value,
        document.querySelector('#format').value,
        getSelectedReturn()
    );
}

document.querySelector('#name').addEventListener('change', () => {
    document.querySelector('#name').classList.remove('is-invalid');
    updateVizualisation();
});

document.querySelector('#type').addEventListener('change', () => {
    updateVizualisation();
});

document.querySelector('#format').addEventListener('change', () => {
    updateVizualisation();
});

document.querySelectorAll('input[type="radio"]').forEach(el => {
    el.addEventListener('change', () => {
        updateVizualisation();
    }
    )
});

const getQuery = () => {
    return '?name=' +
        document.querySelector('#name').value +
        '&type=' +
        type.value +
        '&format=' +
        format.value +
        '&return=' +
        getSelectedReturn()
}

document.querySelector('#copy').addEventListener('click', (event) => {
    event.preventDefault();
    if (!navigator.clipboard) {
        return;
    }
    navigator.clipboard.writeText(
        document.URL +
        getQuery()
    );
});

document.querySelector('#popout').addEventListener('click', (event) => {
    event.preventDefault();
    if (document.querySelector('#name').value.length != 0) {
        window.open(
            document.URL +
            getQuery(),
            '',
            'status=no, menubar=no, toolbar=no scrollbars=no'
        );
    } else {
        document.querySelector('#name').classList.add('is-invalid');
    }
});

if (urlParams.get('name') === null || urlParams.get('name') === '') {
    main.classList.remove('d-none');
} else {
    stats.classList.remove('d-none');
    actualise(
        urlParams.get('name'),
        urlParams.get('type'),
        urlParams.get('format'),
        urlParams.get('return')
    );
    setInterval(
        actualise,
        1000 * 60 * 0.5,
        urlParams.get('name'),
        urlParams.get('type'),
        urlParams.get('format'),
        urlParams.get('return')
    );
}
