
(function () {
    function byId(id) {
        return document.getElementById(id);
    }

    function setHtml(id, html) {
        const el = byId(id);
        if (el) el.innerHTML = html;
    }

    function getInt(id) {
        return Number(byId(id).value);
    }

    function format(value) {
        return Number.isInteger(value) ? String(value) : Number(value.toFixed(6)).toString();
    }

    function wizardResult() {
        const order = byId('wizard-order').value;
        const replacement = byId('wizard-replacement').value;
        let html = '';

        if (order === 'yes' && replacement === 'yes') {
            html = `<strong>Bruk tanken bak ordnet utvalg med tilbakelegging.</strong><div class="math">n^r</div><div class="small">Rekkefølgen teller, og du har like mange valg i hver plass.</div>`;
        } else if (order === 'yes' && replacement === 'no') {
            html = `<strong>Bruk ordnet utvalg uten tilbakelegging.</strong><div class="math">n! / (n-r)!</div><div class="small">Rekkefølgen teller, men antall valg krymper for hver plass.</div>`;
        } else if (order === 'no' && replacement === 'no') {
            html = `<strong>Bruk uordnet utvalg uten tilbakelegging.</strong><div class="math">n! / (r!(n-r)!)</div><div class="small">Du må rydde bort overtelling, derfor deler vi på r!.</div>`;
        } else {
            html = `<strong>Denne varianten er ikke hovedfokus i dette 9.-trinnsopplegget.</strong><div class="small">Hvis rekkefølgen ikke teller og noe kan velges flere ganger, er det en egen type kombinatorikk som ofte kommer senere.</div>`;
        }

        setHtml('wizard-output', html);
    }

    function probabilityHelper() {
        const favorable = getInt('prob-favorable');
        const total = getInt('prob-total');
        if (favorable < 0 || total <= 0 || favorable > total) {
            setHtml('prob-output', 'Sjekk at 0 ≤ gunstige ≤ mulige, og at antall mulige er større enn 0.');
            return;
        }
        const value = favorable / total;
        setHtml('prob-output', `P = ${favorable}/${total} = <strong>${format(value)}</strong> = <strong>${format(value * 100)} %</strong>`);
    }

    function orderedReplacementHelper() {
        const n = getInt('or-n');
        const r = getInt('or-r');
        if (n <= 0 || r < 0) {
            setHtml('or-output', 'Skriv inn tall større enn 0.');
            return;
        }
        setHtml('or-output', `${n}<sup>${r}</sup> = <strong>${format(Math.pow(n, r))}</strong>`);
    }

    function orderedNoReplacementHelper() {
        const n = getInt('onr-n');
        const r = getInt('onr-r');
        if (n <= 0 || r < 0 || r > n) {
            setHtml('onr-output', 'Skriv inn tall der 0 ≤ r ≤ n.');
            return;
        }
        const value = window.cheapCalcHelpers.nPr(n, r);
        setHtml('onr-output', `${n}! / (${n-r}!) = <strong>${format(value)}</strong>`);
    }

    function unorderedNoReplacementHelper() {
        const n = getInt('unr-n');
        const r = getInt('unr-r');
        if (n <= 0 || r < 0 || r > n) {
            setHtml('unr-output', 'Skriv inn tall der 0 ≤ r ≤ n.');
            return;
        }
        const value = window.cheapCalcHelpers.nCr(n, r);
        setHtml('unr-output', `${n}! / (${r}!(${n-r})!) = <strong>${format(value)}</strong>`);
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('formulas-page')) return;

        byId('wizard-order').addEventListener('change', wizardResult);
        byId('wizard-replacement').addEventListener('change', wizardResult);
        byId('prob-calc').addEventListener('click', probabilityHelper);
        byId('or-calc').addEventListener('click', orderedReplacementHelper);
        byId('onr-calc').addEventListener('click', orderedNoReplacementHelper);
        byId('unr-calc').addEventListener('click', unorderedNoReplacementHelper);

        wizardResult();
        probabilityHelper();
        orderedReplacementHelper();
        orderedNoReplacementHelper();
        unorderedNoReplacementHelper();
    });
})();
