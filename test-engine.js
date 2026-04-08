
(function () {
    const state = {
        selectedTopics: [],
        mode: 'practice',
        count: 5,
        questions: [],
        answers: [],
        index: 0,
        score: 0
    };

    function byId(id) {
        return document.getElementById(id);
    }

    function renderTopicOptions() {
        const container = byId('topic-options');
        const entries = Object.entries(window.TOPIC_INFO || {});
        container.innerHTML = entries.map(([key, info], index) => `
            <label class="topic-option">
                <input type="checkbox" value="${key}" ${index < 3 ? 'checked' : ''}>
                <div>
                    <strong>${info.emoji} ${info.label}</strong>
                    <div class="small">Ta med oppgaver fra dette temaet i testen.</div>
                </div>
            </label>
        `).join('');
    }

    function getSelectedTopics() {
        return Array.from(document.querySelectorAll('#topic-options input:checked')).map(input => input.value);
    }

    function sampleQuestions(topics, count) {
        const questions = [];
        let generators = [];

        topics.forEach(topic => {
            const topicGenerators = (window.QUESTION_BANK && window.QUESTION_BANK[topic]) || [];
            topicGenerators.forEach(fn => generators.push({ topic, fn }));
        });

        if (generators.length === 0) return [];

        generators = window.QuestionBankUtils.shuffle(generators);

        while (questions.length < count) {
            const index = questions.length % generators.length;
            if (index === 0 && questions.length > 0) {
                generators = window.QuestionBankUtils.shuffle(generators);
            }
            questions.push(generators[index].fn());
        }

        return window.QuestionBankUtils.shuffle(questions);
    }

    function setCount(count) {
        state.count = count;
        document.querySelectorAll('[data-count]').forEach(btn => {
            btn.classList.toggle('btn-dark', Number(btn.dataset.count) === count);
            btn.classList.toggle('btn-light', Number(btn.dataset.count) !== count);
        });
    }

    function setMode(mode) {
        state.mode = mode;
        document.querySelectorAll('[data-mode]').forEach(btn => {
            btn.classList.toggle('btn-dark', btn.dataset.mode === mode);
            btn.classList.toggle('btn-light', btn.dataset.mode !== mode);
        });
        byId('mode-note').innerHTML = mode === 'practice'
            ? 'I <strong>øvingsmodus</strong> får eleven fasit og forklaring med én gang.'
            : 'I <strong>prøvemodus</strong> vises fasit og forklaringer først til slutt.';
    }

    function resetState() {
        state.questions = [];
        state.answers = [];
        state.index = 0;
        state.score = 0;
    }

    function startTest() {
        const topics = getSelectedTopics();
        if (topics.length === 0) {
            alert('Velg minst ett tema.');
            return;
        }

        resetState();
        state.selectedTopics = topics;
        state.questions = sampleQuestions(topics, state.count);
        if (!state.questions.length) {
            alert('Fant ingen oppgaver for de valgte temaene.');
            return;
        }

        byId('setup-panel').classList.add('hide');
        byId('runner-panel').classList.remove('hide');
        byId('results-panel').classList.add('hide');
        renderCurrentQuestion();
    }

    function updateProgress() {
        const percent = ((state.index) / state.questions.length) * 100;
        byId('progress-fill').style.width = percent + '%';
        byId('progress-label').textContent = `Oppgave ${state.index + 1} av ${state.questions.length}`;
    }

    function renderCurrentQuestion() {
        const question = state.questions[state.index];
        if (!question) {
            showResults();
            return;
        }

        updateProgress();
        const box = byId('question-area');
        const controls = byId('question-controls');
        const feedback = byId('feedback-area');
        feedback.innerHTML = '';
        controls.innerHTML = '';

        let html = `
            <div class="question-box">
                <div class="topic-pill">${window.TOPIC_INFO[question.topic].emoji} ${window.TOPIC_INFO[question.topic].label}</div>
                <h3>Oppgave ${state.index + 1}</h3>
                <div>${question.prompt}</div>
        `;

        if (question.kind === 'mc') {
            html += `<div class="option-list" id="option-list">`;
            question.choices.forEach((choice, idx) => {
                html += `<button type="button" class="option-btn" data-choice="${idx}">${choice}</button>`;
            });
            html += `</div>`;
        } else {
            html += `
                <div class="inline-input">
                    <input id="numeric-answer" type="text" placeholder="Skriv svaret her. Du kan bruke brøk, for eksempel 3/8.">
                    <button type="button" class="btn btn-dark" id="submit-answer">Svar</button>
                </div>
                <div class="small">Du kan skrive desimaltall, brøk, fakultet og uttrykk som <code>10!/8!</code>.</div>
            `;
        }

        html += `</div>`;
        box.innerHTML = html;

        if (question.kind === 'mc') {
            const optionButtons = box.querySelectorAll('[data-choice]');
            optionButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    optionButtons.forEach(other => other.classList.remove('selected'));
                    btn.classList.add('selected');
                });
            });
            controls.innerHTML = `<button type="button" class="btn btn-dark" id="submit-answer">Svar</button>`;
        }

        byId('submit-answer').addEventListener('click', handleSubmit);
    }

    function normalizeNumericInput(value) {
        return String(value || '').trim();
    }

    function parseNumericInput(raw) {
        if (!raw) throw new Error('Skriv inn et svar først.');
        if (window.cheapCalcEvaluate) return window.cheapCalcEvaluate(raw);
        return Number(raw.replace(',', '.'));
    }

    function handleSubmit() {
        const question = state.questions[state.index];
        let isCorrect = false;
        let userAnswer = '';

        if (question.kind === 'mc') {
            const selected = document.querySelector('.option-btn.selected');
            if (!selected) {
                alert('Velg et svar først.');
                return;
            }
            userAnswer = Number(selected.dataset.choice);
            isCorrect = userAnswer === question.correctIndex;
            revealMc(question, userAnswer);
        } else {
            const raw = normalizeNumericInput(byId('numeric-answer').value);
            try {
                const numericValue = parseNumericInput(raw);
                userAnswer = raw;
                const tolerance = question.tolerance || 0.001;
                isCorrect = Math.abs(numericValue - question.answer) <= tolerance;
            } catch (err) {
                alert(err.message || 'Kunne ikke lese svaret.');
                return;
            }
        }

        state.answers.push({
            question,
            userAnswer,
            correct: isCorrect
        });

        if (isCorrect) state.score += 1;

        if (state.mode === 'practice') {
            showFeedback(isCorrect, question);
            if (question.kind === 'numeric') revealNumeric(question, isCorrect);
        } else {
            nextQuestion();
        }
    }

    function revealMc(question, userAnswer) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            const idx = Number(btn.dataset.choice);
            btn.disabled = true;
            if (idx === question.correctIndex) btn.classList.add('correct');
            if (idx === userAnswer && idx !== question.correctIndex) btn.classList.add('incorrect');
        });
    }

    function revealNumeric(question, isCorrect) {
        const input = byId('numeric-answer');
        const button = byId('submit-answer');
        input.disabled = true;
        button.disabled = true;
        input.style.borderColor = isCorrect ? 'rgba(24,121,78,0.45)' : 'rgba(180,35,24,0.45)';
    }

    function showFeedback(isCorrect, question) {
        const feedback = byId('feedback-area');
        feedback.innerHTML = `
            <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                <strong>${isCorrect ? 'Riktig!' : 'Ikke helt denne gangen.'}</strong>
                <div style="margin-top: 8px;">${question.explanation}</div>
            </div>
        `;
        const controls = byId('question-controls');
        controls.innerHTML = `<button type="button" class="btn btn-accent" id="next-question">${state.index + 1 === state.questions.length ? 'Se resultat' : 'Neste oppgave'}</button>`;
        byId('next-question').addEventListener('click', nextQuestion);
    }

    function nextQuestion() {
        state.index += 1;
        renderCurrentQuestion();
    }

    function showResults() {
        byId('runner-panel').classList.add('hide');
        byId('results-panel').classList.remove('hide');

        const summary = byId('results-summary');
        const resultsList = byId('results-list');

        const total = state.questions.length;
        const percent = Math.round((state.score / total) * 100);
        const topicStats = {};

        state.answers.forEach(entry => {
            const topic = entry.question.topic;
            topicStats[topic] = topicStats[topic] || { total: 0, correct: 0 };
            topicStats[topic].total += 1;
            if (entry.correct) topicStats[topic].correct += 1;
        });

        summary.innerHTML = `
            <div class="summary-card">
                <h2>Resultat</h2>
                <div class="score-chip">Poeng: ${state.score} / ${total}</div>
                <div class="score-chip">Treffprosent: ${percent} %</div>
                <p class="small">I prøvemodus ser du først forklaringene nå. I øvingsmodus har du allerede fått dem underveis.</p>
                <div class="summary-grid">
                    ${Object.entries(topicStats).map(([topic, stats]) => `
                        <div class="result-item">
                            <strong>${window.TOPIC_INFO[topic].emoji} ${window.TOPIC_INFO[topic].label}</strong>
                            <div class="small">${stats.correct} av ${stats.total} riktige</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        resultsList.innerHTML = state.answers.map((entry, idx) => `
            <div class="result-item ${entry.correct ? 'correct' : 'incorrect'}">
                <div class="topic-pill">${window.TOPIC_INFO[entry.question.topic].emoji} ${window.TOPIC_INFO[entry.question.topic].label}</div>
                <strong>Oppgave ${idx + 1}</strong>
                <div style="margin: 8px 0 10px;">${entry.question.prompt}</div>
                <div class="small"><strong>Ditt svar:</strong> ${formatUserAnswer(entry)}</div>
                <div class="small"><strong>Forklaring:</strong> ${entry.question.explanation}</div>
            </div>
        `).join('');
    }

    function formatUserAnswer(entry) {
        if (entry.question.kind === 'mc') {
            const idx = Number(entry.userAnswer);
            return entry.question.choices[idx] || 'Ikke besvart';
        }
        return entry.userAnswer || 'Ikke besvart';
    }

    function bindSetupButtons() {
        document.querySelectorAll('[data-count]').forEach(btn => {
            btn.addEventListener('click', () => setCount(Number(btn.dataset.count)));
        });

        document.querySelectorAll('[data-mode]').forEach(btn => {
            btn.addEventListener('click', () => setMode(btn.dataset.mode));
        });

        byId('select-all-topics').addEventListener('click', () => {
            document.querySelectorAll('#topic-options input').forEach(input => { input.checked = true; });
        });

        byId('start-test').addEventListener('click', startTest);
        byId('restart-test').addEventListener('click', () => {
            byId('setup-panel').classList.remove('hide');
            byId('runner-panel').classList.add('hide');
            byId('results-panel').classList.add('hide');
            byId('progress-fill').style.width = '0';
            resetState();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (!byId('test-page')) return;
        renderTopicOptions();
        bindSetupButtons();
        setCount(5);
        setMode('practice');
    });
})();
