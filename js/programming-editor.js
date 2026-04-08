
(function () {
    let editor = null;
    let activeExampleKey = 'mynt';
    let saveTimer = null;
    const STORAGE_KEY = 'sannsynlighet_python_editor_code_v1';

    function byId(id) {
        return document.getElementById(id);
    }

    function appendText(target, text) {
        target.appendChild(document.createTextNode(text));
        target.scrollTop = target.scrollHeight;
    }

    function appendError(target, text) {
        const span = document.createElement('span');
        span.className = 'error';
        span.textContent = text;
        target.appendChild(span);
        target.scrollTop = target.scrollHeight;
    }

    function builtinRead(x) {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles['files'][x] === undefined) {
            throw new Error("Filen finnes ikke: '" + x + "'");
        }
        return Sk.builtinFiles['files'][x];
    }

    function setOutputPlaceholder() {
        const output = byId('output');
        output.textContent = 'Trykk «Kjør kode» for å se resultatet her.';
    }

    function renderExampleMeta() {
        const example = window.PROGRAMMING_EXAMPLES[activeExampleKey];
        byId('example-title').textContent = example.title;
        byId('example-short').textContent = example.short;
        byId('editable-vars').innerHTML = example.variables.map(item => `<li>${item}</li>`).join('');
        byId('challenge-list').innerHTML = example.challenges.map(item => `<li>${item}</li>`).join('');
    }

    function loadExample(key, overwriteEditor) {
        activeExampleKey = key;
        renderExampleMeta();
        document.querySelectorAll('[data-example]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.example === key);
        });
        if (overwriteEditor && editor) {
            editor.setValue(window.PROGRAMMING_EXAMPLES[key].code);
            queueSave();
        }
    }

    function queueSave() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, editor.getValue());
                localStorage.setItem(STORAGE_KEY + '_example', activeExampleKey);
            } catch (err) {
                console.warn('Kunne ikke lagre koden lokalt.', err);
            }
        }, 700);
    }

    function clearOutput() {
        setOutputPlaceholder();
        byId('turtle-canvas').innerHTML = '';
    }

    function downloadCode() {
        const code = editor.getValue();
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'program.py';
        link.click();
        URL.revokeObjectURL(url);
    }

    function toggleTurtle() {
        const container = byId('turtle-container');
        const button = byId('toggle-turtle');
        const open = container.style.display !== 'none';
        container.style.display = open ? 'none' : 'block';
        button.textContent = open ? '🐢 Vis turtle' : '🐢 Skjul turtle';
        button.classList.toggle('btn-success', !open);
        button.classList.toggle('btn-light', open);
    }

    function createInputPrompt(outputArea, promptText) {
        appendText(outputArea, promptText);

        return new Promise(resolve => {
            const wrapper = document.createElement('div');
            wrapper.className = 'inline-input';

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Skriv svaret her og trykk Enter';

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-success';
            button.textContent = 'OK';

            wrapper.appendChild(input);
            wrapper.appendChild(button);
            outputArea.appendChild(wrapper);
            input.focus();

            function submit() {
                const value = input.value;
                appendText(outputArea, value + '\n');
                wrapper.remove();
                resolve(value);
            }

            input.addEventListener('keydown', event => {
                if (event.key === 'Enter') submit();
            });
            button.addEventListener('click', submit);
        });
    }

    function runCode() {
        const outputArea = byId('output');
        outputArea.textContent = '';

        const code = editor.getValue();

        if (/import\s+pygame|from\s+pygame/.test(code)) {
            appendError(outputArea, 'Denne lette nettutgaven støtter ikke pygame. Bruk vanlige Python-programmer, random eller turtle.\n');
            return;
        }

        const usesTurtle = /import\s+turtle|from\s+turtle/.test(code);
        if (usesTurtle) {
            byId('turtle-container').style.display = 'block';
            byId('toggle-turtle').textContent = '🐢 Skjul turtle';
            byId('toggle-turtle').classList.add('btn-success');
            byId('toggle-turtle').classList.remove('btn-light');
            byId('turtle-canvas').innerHTML = '';
        }

        Sk.pre = 'output';
        Sk.configure({
            output: text => appendText(outputArea, text),
            read: builtinRead,
            inputfun: promptText => createInputPrompt(outputArea, promptText),
            inputfunTakesPrompt: true,
            execLimit: 5000000,
            killableWhile: true,
            killableFor: true
        });

        (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'turtle-canvas';
        Sk.TurtleGraphics.width = 360;
        Sk.TurtleGraphics.height = 360;

        Sk.misceval.asyncToPromise(function () {
            return Sk.importMainWithBody('<stdin>', false, code, true);
        }).catch(function (err) {
            appendError(outputArea, 'Feil: ' + err.toString() + '\n');
        });
    }

    function initEditor() {
        editor = CodeMirror.fromTextArea(byId('code'), {
            mode: 'python',
            theme: 'dracula',
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            lineWrapping: true,
            extraKeys: {
                'Ctrl-Enter': runCode,
                'Cmd-Enter': runCode,
                'Ctrl-S': function () { downloadCode(); return false; },
                'Cmd-S': function () { downloadCode(); return false; }
            }
        });

        let loadedFromStorage = false;
        try {
            const savedCode = localStorage.getItem(STORAGE_KEY);
            const savedExample = localStorage.getItem(STORAGE_KEY + '_example');
            if (savedExample && window.PROGRAMMING_EXAMPLES[savedExample]) {
                activeExampleKey = savedExample;
            }
            if (savedCode) {
                editor.setValue(savedCode);
                loadedFromStorage = true;
            }
        } catch (err) {
            console.warn('Kunne ikke lese lagret kode.', err);
        }

        if (!loadedFromStorage) {
            editor.setValue(window.PROGRAMMING_EXAMPLES[activeExampleKey].code);
        }

        editor.on('change', queueSave);
    }

    function bindButtons() {
        byId('run-code').addEventListener('click', runCode);
        byId('clear-output').addEventListener('click', clearOutput);
        byId('download-code').addEventListener('click', downloadCode);
        byId('reset-code').addEventListener('click', () => {
            editor.setValue(window.PROGRAMMING_EXAMPLES[activeExampleKey].code);
            queueSave();
        });
        byId('toggle-turtle').addEventListener('click', toggleTurtle);

        document.querySelectorAll('[data-example]').forEach(btn => {
            btn.addEventListener('click', () => loadExample(btn.dataset.example, true));
        });

        document.addEventListener('keydown', event => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
                event.preventDefault();
                downloadCode();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('programmering-page')) return;
        initEditor();
        bindButtons();
        loadExample(activeExampleKey, false);
        setOutputPlaceholder();
    });
})();
