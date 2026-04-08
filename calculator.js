
(function () {
    function factorial(n) {
        if (!Number.isFinite(n)) throw new Error('Ugyldig tall');
        if (n < 0 || Math.floor(n) !== n) throw new Error('Fakultet krever heltall ≥ 0');
        let result = 1;
        for (let i = 2; i <= n; i += 1) result *= i;
        return result;
    }

    function nCr(n, r) {
        if (Math.floor(n) !== n || Math.floor(r) !== r) throw new Error('nCr krever heltall');
        if (n < 0 || r < 0 || r > n) throw new Error('nCr krever 0 ≤ r ≤ n');
        r = Math.min(r, n - r);
        let numerator = 1;
        let denominator = 1;
        for (let i = 1; i <= r; i += 1) {
            numerator *= (n - r + i);
            denominator *= i;
        }
        return numerator / denominator;
    }

    function nPr(n, r) {
        if (Math.floor(n) !== n || Math.floor(r) !== r) throw new Error('nPr krever heltall');
        if (n < 0 || r < 0 || r > n) throw new Error('nPr krever 0 ≤ r ≤ n');
        let result = 1;
        for (let i = 0; i < r; i += 1) result *= (n - i);
        return result;
    }

    function tokenize(input) {
        const src = input.replace(/,/g, '.').replace(/×/g, '*').replace(/÷/g, '/').trim();
        const tokens = [];
        let i = 0;

        while (i < src.length) {
            const ch = src[i];
            if (/\s/.test(ch)) {
                i += 1;
                continue;
            }
            if (/[0-9.]/.test(ch)) {
                let num = ch;
                i += 1;
                while (i < src.length && /[0-9.]/.test(src[i])) {
                    num += src[i];
                    i += 1;
                }
                if ((num.match(/\./g) || []).length > 1) throw new Error('Ugyldig tall');
                tokens.push({ type: 'number', value: parseFloat(num) });
                continue;
            }
            if (/[A-Za-z]/.test(ch)) {
                let name = ch;
                i += 1;
                while (i < src.length && /[A-Za-z]/.test(src[i])) {
                    name += src[i];
                    i += 1;
                }
                tokens.push({ type: 'name', value: name });
                continue;
            }
            if ('+-*/^(),!'.includes(ch)) {
                tokens.push({ type: ch, value: ch });
                i += 1;
                continue;
            }
            throw new Error('Ukjent tegn: ' + ch);
        }

        return tokens;
    }

    function parseExpression(tokens) {
        let index = 0;

        function peek() {
            return tokens[index];
        }

        function consume(expected) {
            const token = tokens[index];
            if (!token || (expected && token.type !== expected)) {
                throw new Error('Uventet slutt eller symbol');
            }
            index += 1;
            return token;
        }

        function parsePrimary() {
            const token = peek();
            if (!token) throw new Error('Tomt uttrykk');

            if (token.type === 'number') {
                consume();
                return token.value;
            }

            if (token.type === '(') {
                consume('(');
                const value = parseAddSub();
                consume(')');
                return value;
            }

            if (token.type === '+') {
                consume('+');
                return parsePrimary();
            }

            if (token.type === '-') {
                consume('-');
                return -parsePrimary();
            }

            if (token.type === 'name') {
                const name = consume('name').value;
                consume('(');
                const arg1 = parseAddSub();
                let arg2 = null;
                if (peek() && peek().type === ',') {
                    consume(',');
                    arg2 = parseAddSub();
                }
                consume(')');
                if (name === 'nCr') return nCr(arg1, arg2);
                if (name === 'nPr') return nPr(arg1, arg2);
                if (name === 'fact') return factorial(arg1);
                throw new Error('Ukjent funksjon: ' + name);
            }

            throw new Error('Kunne ikke lese uttrykket');
        }

        function parsePostfix() {
            let value = parsePrimary();
            while (peek() && peek().type === '!') {
                consume('!');
                value = factorial(value);
            }
            return value;
        }

        function parsePower() {
            let value = parsePostfix();
            while (peek() && peek().type === '^') {
                consume('^');
                value = Math.pow(value, parsePostfix());
            }
            return value;
        }

        function parseMulDiv() {
            let value = parsePower();
            while (peek() && (peek().type === '*' || peek().type === '/')) {
                const op = consume().type;
                const right = parsePower();
                if (op === '*') value *= right;
                else value /= right;
            }
            return value;
        }

        function parseAddSub() {
            let value = parseMulDiv();
            while (peek() && (peek().type === '+' || peek().type === '-')) {
                const op = consume().type;
                const right = parseMulDiv();
                if (op === '+') value += right;
                else value -= right;
            }
            return value;
        }

        const result = parseAddSub();
        if (index < tokens.length) throw new Error('Uttrykket stoppet for tidlig');
        return result;
    }

    function evaluateExpression(expression) {
        const tokens = tokenize(expression);
        const result = parseExpression(tokens);
        if (!Number.isFinite(result)) throw new Error('Ugyldig resultat');
        return result;
    }

    window.cheapCalcEvaluate = evaluateExpression;
    window.cheapCalcHelpers = { factorial, nCr, nPr };

    function createCalculatorUI() {
        if (document.getElementById('calc-fab')) return;

        const fab = document.createElement('button');
        fab.className = 'calc-fab';
        fab.id = 'calc-fab';
        fab.type = 'button';
        fab.setAttribute('aria-label', 'Åpne kalkulator');
        fab.textContent = '🧮';
        document.body.appendChild(fab);

        const modal = document.createElement('div');
        modal.className = 'calc-modal';
        modal.id = 'calc-modal';
        modal.innerHTML = `
            <div class="calc-panel" role="dialog" aria-modal="true" aria-labelledby="calc-title">
                <div class="calc-head">
                    <strong id="calc-title">Kalkulator</strong>
                    <button type="button" class="btn btn-light" id="calc-close">Lukk</button>
                </div>
                <div class="calc-display">
                    <div class="calc-expression" id="calc-expression"></div>
                    <div class="calc-result" id="calc-result">0</div>
                </div>
                <div class="calc-keypad">
                    <button class="calc-key action" data-calc="clear">AC</button>
                    <button class="calc-key action" data-calc="back">⌫</button>
                    <button class="calc-key action" data-calc="(">(</button>
                    <button class="calc-key action" data-calc=")">)</button>

                    <button class="calc-key" data-calc="7">7</button>
                    <button class="calc-key" data-calc="8">8</button>
                    <button class="calc-key" data-calc="9">9</button>
                    <button class="calc-key action" data-calc="/">÷</button>

                    <button class="calc-key" data-calc="4">4</button>
                    <button class="calc-key" data-calc="5">5</button>
                    <button class="calc-key" data-calc="6">6</button>
                    <button class="calc-key action" data-calc="*">×</button>

                    <button class="calc-key" data-calc="1">1</button>
                    <button class="calc-key" data-calc="2">2</button>
                    <button class="calc-key" data-calc="3">3</button>
                    <button class="calc-key action" data-calc="-">−</button>

                    <button class="calc-key" data-calc="0">0</button>
                    <button class="calc-key" data-calc=".">.</button>
                    <button class="calc-key action" data-calc="!">x!</button>
                    <button class="calc-key action" data-calc="+">+</button>

                    <button class="calc-key action" data-calc="nCr(">nCr</button>
                    <button class="calc-key action" data-calc="nPr(">nPr</button>
                    <button class="calc-key action" data-calc="^">x^y</button>
                    <button class="calc-key equals" data-calc="equals">=</button>
                </div>
                <div class="calc-error hide" id="calc-error"></div>
            </div>
        `;
        document.body.appendChild(modal);

        const expressionEl = modal.querySelector('#calc-expression');
        const resultEl = modal.querySelector('#calc-result');
        const errorEl = modal.querySelector('#calc-error');
        let expression = '';

        function updateDisplay(resultText) {
            expressionEl.textContent = expression || 'Skriv et uttrykk';
            if (typeof resultText === 'string') {
                resultEl.textContent = resultText;
            } else if (!expression) {
                resultEl.textContent = '0';
            }
        }

        function showError(message) {
            errorEl.textContent = message;
            errorEl.classList.remove('hide');
        }

        function clearError() {
            errorEl.textContent = '';
            errorEl.classList.add('hide');
        }

        function evaluateAndShow() {
            if (!expression.trim()) return;
            clearError();
            try {
                const value = evaluateExpression(expression);
                resultEl.textContent = Number.isInteger(value) ? String(value) : Number(value.toFixed(8)).toString();
            } catch (err) {
                showError(err.message || 'Kunne ikke regne ut uttrykket');
            }
        }

        function appendValue(value) {
            clearError();
            expression += value;
            updateDisplay();
        }

        fab.addEventListener('click', () => {
            modal.classList.add('open');
            updateDisplay();
        });

        modal.addEventListener('click', (event) => {
            if (event.target === modal) modal.classList.remove('open');
        });

        modal.querySelector('#calc-close').addEventListener('click', () => {
            modal.classList.remove('open');
        });

        modal.querySelectorAll('[data-calc]').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.getAttribute('data-calc');
                if (value === 'clear') {
                    expression = '';
                    clearError();
                    updateDisplay('0');
                    return;
                }
                if (value === 'back') {
                    expression = expression.slice(0, -1);
                    clearError();
                    updateDisplay();
                    return;
                }
                if (value === 'equals') {
                    evaluateAndShow();
                    return;
                }
                appendValue(value);
            });
        });

        document.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                modal.classList.add('open');
                updateDisplay();
            }
            if (!modal.classList.contains('open')) return;
            if (event.key === 'Escape') {
                modal.classList.remove('open');
                return;
            }
            if (/^[0-9]$/.test(event.key) || ['+', '-', '*', '/', '(', ')', '.', '^', '!', ','].includes(event.key)) {
                appendValue(event.key);
            } else if (event.key === 'Enter') {
                event.preventDefault();
                evaluateAndShow();
            } else if (event.key === 'Backspace') {
                expression = expression.slice(0, -1);
                updateDisplay();
            }
        });

        updateDisplay();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createCalculatorUI);
    } else {
        createCalculatorUI();
    }
})();
