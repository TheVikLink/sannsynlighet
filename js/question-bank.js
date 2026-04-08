
(function () {
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function choice(array) {
        return array[randomInt(0, array.length - 1)];
    }

    function shuffle(array) {
        const copy = array.slice();
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function formatProbability(value) {
        return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
    }

    const TOPIC_INFO = {
        intro: { label: 'Introduksjon', emoji: '🎡' },
        combo: { label: 'Kombinasjoner og permutasjoner', emoji: '🧭' },
        ordnetTilbake: { label: 'Ordnet utvalg med tilbakelegging', emoji: '🔁' },
        ordnetUten: { label: 'Ordnet utvalg uten tilbakelegging', emoji: '🏁' },
        uordnetUten: { label: 'Uordnet utvalg uten tilbakelegging', emoji: '👥' },
        ettTrekk: { label: 'Sannsynlighet med ett trekk', emoji: '🎲' },
        toTrekk: { label: 'Sannsynlighet med to trekk', emoji: '🌿' },
        programmering: { label: 'Programmering: Mynter og terninger', emoji: '🐍' }
    };


function nCrLocal(n, r) {
    r = Math.min(r, n - r);
    let numerator = 1;
    let denominator = 1;
    for (let i = 1; i <= r; i += 1) {
        numerator *= (n - r + i);
        denominator *= i;
    }
    return numerator / denominator;
}

const bank = {
        intro: [
            function () {
                const red = randomInt(2, 6);
                const blue = randomInt(2, 6);
                const green = randomInt(1, 4);
                const total = red + blue + green;
                return {
                    topic: 'intro',
                    kind: 'numeric',
                    prompt: `I en pose ligger det <strong>${red}</strong> røde, <strong>${blue}</strong> blå og <strong>${green}</strong> grønne kuler. Hva er sannsynligheten for å trekke en blå kule? <span class="small">Svar som brøk eller desimaltall.</span>`,
                    answer: blue / total,
                    explanation: `Sannsynlighet = gunstige utfall / mulige utfall = ${blue}/${total} = ${formatProbability(blue / total)}.`
                };
            },
            function () {
                const numerator = randomInt(1, 4);
                const denominator = choice([5, 8, 10]);
                const value = numerator / denominator;
                const percent = value * 100;
                const choices = shuffle([`${percent} %`, `${numerator * 10} %`, `${denominator * 10} %`, `${Math.round(value * 10)} %`]);
                return {
                    topic: 'intro',
                    kind: 'mc',
                    prompt: `En sannsynlighet er <strong>${numerator}/${denominator}</strong>. Hvilket svar er riktig skrevet som prosent?`,
                    choices,
                    correctIndex: choices.indexOf(`${percent} %`),
                    explanation: `${numerator}/${denominator} = ${formatProbability(value)} = ${percent} %.`
                };
            },
            function () {
                const options = [
                    ['Du kaster en vanlig terning og får tallet 7.', 'umulig'],
                    ['Du trekker et kort fra en vanlig kortstokk og får enten rødt eller svart kort.', 'sikker'],
                    ['Du kaster en mynt og får kron.', 'mulig']
                ];
                const [statement, correct] = choice(options);
                const labels = ['umulig', 'mulig', 'sikker'];
                return {
                    topic: 'intro',
                    kind: 'mc',
                    prompt: `Hva slags hendelse er dette? <strong>${statement}</strong>`,
                    choices: labels,
                    correctIndex: labels.indexOf(correct),
                    explanation: `Her er riktig kategori <strong>${correct}</strong>.`
                };
            },
            function () {
                const sectors = choice([6, 8, 10]);
                const good = randomInt(1, sectors - 1);
                return {
                    topic: 'intro',
                    kind: 'numeric',
                    prompt: `Et lykkehjul er delt i ${sectors} like store felt. ${good} av feltene er gule. Hva er sannsynligheten for å lande på gult? <span class="small">Svar som brøk eller desimaltall.</span>`,
                    answer: good / sectors,
                    explanation: `${good} gunstige av ${sectors} mulige gir ${good}/${sectors} = ${formatProbability(good / sectors)}.`
                };
            },
            function () {
                const choices = ['Det med flest gunstige utfall er mest sannsynlig', 'Det med størst tall i oppgaven er mest sannsynlig', 'Det som skjer først er mest sannsynlig', 'Det som er blått er mest sannsynlig'];
                return {
                    topic: 'intro',
                    kind: 'mc',
                    prompt: 'Hva er en god tommelfingerregel når du skal sammenligne to enkle sannsynligheter?',
                    choices,
                    correctIndex: 0,
                    explanation: 'Du må sammenligne gunstige utfall opp mot alle mulige utfall. Flere gunstige utfall gir større sannsynlighet når totalen er lik.'
                };
            }
        ],
        combo: [
            function () {
                const choices = [
                    'Ordnet uten tilbakelegging',
                    'Uordnet uten tilbakelegging',
                    'Ordnet med tilbakelegging',
                    'Ingen av disse'
                ];
                return {
                    topic: 'combo',
                    kind: 'mc',
                    prompt: 'Tre elever skal få rollene leder, nestleder og sekretær. Hvilken kategori passer best?',
                    choices,
                    correctIndex: 0,
                    explanation: 'Rollene er ulike, så rekkefølgen betyr noe. Samme elev kan ikke få to roller, så dette er uten tilbakelegging.'
                };
            },
            function () {
                const choices = [
                    'Ordnet uten tilbakelegging',
                    'Uordnet uten tilbakelegging',
                    'Ordnet med tilbakelegging',
                    'Ordnet eller uordnet spiller ingen rolle'
                ];
                return {
                    topic: 'combo',
                    kind: 'mc',
                    prompt: 'Du skal velge 4 elever til en komité. Hvilken kategori passer best?',
                    choices,
                    correctIndex: 1,
                    explanation: 'Det er bare hvem som er med i gruppen som teller, ikke rekkefølgen. Ingen elev velges to ganger.'
                };
            },
            function () {
                const choices = [
                    'Er rekkefølgen viktig, og kan noe velges flere ganger?',
                    'Hvor mange farger finnes det?',
                    'Er tallene store eller små?',
                    'Er oppgaven lett eller vanskelig?'
                ];
                return {
                    topic: 'combo',
                    kind: 'mc',
                    prompt: 'Hvilke to spørsmål er smartest å stille først når du skal velge riktig formel?',
                    choices,
                    correctIndex: 0,
                    explanation: 'De to nøkkelspørsmålene er: Teller rekkefølgen, og er det med eller uten tilbakelegging?'
                };
            },
            function () {
                const choices = [
                    'Ordnet med tilbakelegging',
                    'Ordnet uten tilbakelegging',
                    'Uordnet uten tilbakelegging',
                    'Sannsynlighet med to trekk'
                ];
                return {
                    topic: 'combo',
                    kind: 'mc',
                    prompt: 'Du lager en kode på 4 sifre, og samme siffer kan brukes flere ganger. Hvilken kategori passer best?',
                    choices,
                    correctIndex: 0,
                    explanation: 'Koden 1234 er noe annet enn 4321, så rekkefølgen teller. Sifre kan brukes igjen, altså med tilbakelegging.'
                };
            },
            function () {
                return {
                    topic: 'combo',
                    kind: 'mc',
                    prompt: 'Hvorfor deler vi ofte på <code>r!</code> når vi går fra ordnet til uordnet utvalg?',
                    choices: [
                        'For å gjøre tallene mindre uten grunn',
                        'Fordi hver gruppe er telt flere ganger i ulike rekkefølger',
                        'Fordi vi alltid må dele når vi bruker fakultet',
                        'For å få prosent'
                    ],
                    correctIndex: 1,
                    explanation: 'Når rekkefølgen ikke skal telle, må vi rydde bort overtelling. En gruppe på r personer kan ordnes på r! måter.'
                };
            }
        ],
        ordnetTilbake: [
            function () {
                const length = randomInt(3, 5);
                const chars = choice([4, 5, 6, 10]);
                return {
                    topic: 'ordnetTilbake',
                    kind: 'numeric',
                    prompt: `Hvor mange koder kan du lage med <strong>${length}</strong> tegn når hvert tegn kan være ett av <strong>${chars}</strong> symboler, og symbolene kan brukes flere ganger?`,
                    answer: Math.pow(chars, length),
                    explanation: `Du har ${chars} valg for hver plass, og det er ${length} plasser. Derfor blir svaret ${chars}<sup>${length}</sup> = ${Math.pow(chars, length)}.`
                };
            },
            function () {
                const colors = randomInt(3, 7);
                const beads = randomInt(2, 4);
                return {
                    topic: 'ordnetTilbake',
                    kind: 'numeric',
                    prompt: `Du lager et mønster av ${beads} perler på rad. Du kan velge mellom ${colors} farger, og samme farge kan brukes flere ganger. Hvor mange mønstre finnes?`,
                    answer: Math.pow(colors, beads),
                    explanation: `Dette er ordnet med tilbakelegging: ${colors} valg for hver av ${beads} plasser. Svaret er ${colors}^${beads}.`
                };
            },
            function () {
                return {
                    topic: 'ordnetTilbake',
                    kind: 'mc',
                    prompt: 'Hva er hovedideen bak formelen <code>n^r</code>?',
                    choices: [
                        'Antall valg blir mindre for hver plass',
                        'Det er like mange valg i hver plass',
                        'Vi må rydde bort overtelling',
                        'Vi trekker fra 1 hver gang'
                    ],
                    correctIndex: 1,
                    explanation: 'Når vi har tilbakelegging, er det like mange valg i hver plass. Da får vi et produkt med samme faktor flere ganger, altså n^r.'
                };
            },
            function () {
                const symbols = randomInt(2, 5);
                return {
                    topic: 'ordnetTilbake',
                    kind: 'numeric',
                    prompt: `Du skal lage en kode med 2 plasser. Hver plass kan fylles med ett av ${symbols} symboler, og symbolene kan gjentas. Hvor mange koder finnes?`,
                    answer: symbols * symbols,
                    explanation: `Første plass har ${symbols} valg og andre plass har også ${symbols} valg. Derfor blir svaret ${symbols} · ${symbols} = ${symbols * symbols}.`
                };
            },
            function () {
                return {
                    topic: 'ordnetTilbake',
                    kind: 'mc',
                    prompt: 'Hvilken situasjon passer best til ordnet utvalg med tilbakelegging?',
                    choices: [
                        'Velge 3 elever til en gruppe',
                        'Fordele gull, sølv og bronse i et løp',
                        'Lage et passord der bokstaver kan brukes flere ganger',
                        'Trekke 2 kuler uten tilbakelegging'
                    ],
                    correctIndex: 2,
                    explanation: 'Et passord har rekkefølge, og tegn kan brukes flere ganger. Det er selve skoleeksemplet på ordnet med tilbakelegging.'
                };
            }
        ],
        ordnetUten: [
            function () {
                const runners = randomInt(5, 8);
                return {
                    topic: 'ordnetUten',
                    kind: 'numeric',
                    prompt: `${runners} løpere er med i en finale. Hvor mange ulike måter kan gull, sølv og bronse deles ut på?`,
                    answer: runners * (runners - 1) * (runners - 2),
                    explanation: `Det er ${runners} valg til gull, ${runners - 1} valg til sølv og ${runners - 2} valg til bronse. Produktet blir ${runners * (runners - 1) * (runners - 2)}.`
                };
            },
            function () {
                const books = randomInt(5, 8);
                const choose = randomInt(2, Math.min(4, books - 1));
                let ans = 1;
                for (let i = 0; i < choose; i += 1) ans *= (books - i);
                return {
                    topic: 'ordnetUten',
                    kind: 'numeric',
                    prompt: `Du har ${books} ulike bøker og skal sette ${choose} av dem på rad i en hylle. Hvor mange ulike oppstillinger finnes?`,
                    answer: ans,
                    explanation: `Dette er ordnet uten tilbakelegging. Antall oppstillinger er ${books}! / (${books - choose}!) = ${ans}.`
                };
            },
            function () {
                const letters = randomInt(4, 6);
                let fact = 1;
                for (let i = 2; i <= letters; i += 1) fact *= i;
                return {
                    topic: 'ordnetUten',
                    kind: 'numeric',
                    prompt: `Hvor mange ulike rekkefølger kan du lage av ${letters} forskjellige bokstaver når alle skal brukes?`,
                    answer: fact,
                    explanation: `Når alle ${letters} bokstaver skal brukes, får vi ${letters}! = ${fact}.`
                };
            },
            function () {
                return {
                    topic: 'ordnetUten',
                    kind: 'mc',
                    prompt: 'Hva skjer med antall valg fra plass til plass i ordnet utvalg uten tilbakelegging?',
                    choices: [
                        'Det øker med 1 hver gang',
                        'Det er konstant hele tiden',
                        'Det blir ett færre valg for hver plass',
                        'Det blir alltid delt på 2'
                    ],
                    correctIndex: 2,
                    explanation: 'Når et objekt er brukt, kan det ikke brukes igjen. Derfor krymper antall valg etter hvert.'
                };
            },
            function () {
                return {
                    topic: 'ordnetUten',
                    kind: 'mc',
                    prompt: 'Når passer uttrykket <code>n! / (n-r)!</code> best?',
                    choices: [
                        'Når rekkefølgen teller og vi velger r av n uten tilbakelegging',
                        'Når rekkefølgen ikke teller',
                        'Når vi trekker ett kort',
                        'Når vi vil gjøre om til prosent'
                    ],
                    correctIndex: 0,
                    explanation: 'Denne formelen teller ordnede utvalg uten tilbakelegging.'
                };
            }
        ],
        uordnetUten: [
            function () {
                const students = randomInt(6, 10);
                const choose = randomInt(2, 4);
                const ans = nCrLocal(students, choose);
                return {
                    topic: 'uordnetUten',
                    kind: 'numeric',
                    prompt: `En gruppe på ${choose} elever skal velges fra ${students} elever. Hvor mange ulike grupper finnes?`,
                    answer: ans,
                    explanation: `Når rekkefølgen ikke teller, bruker vi kombinasjoner: C(${students}, ${choose}) = ${students}! / (${choose}!(${students - choose})!) = ${ans}.`
                };
            },
            function () {
                const toppings = randomInt(5, 8);
                const choose = randomInt(2, 3);
                const ans = nCrLocal(toppings, choose);
                return {
                    topic: 'uordnetUten',
                    kind: 'numeric',
                    prompt: `Du skal velge ${choose} ulike pizzatoppinger fra ${toppings} mulige. Hvor mange valg finnes?`,
                    answer: ans,
                    explanation: `Her teller bare hvilke toppinger du velger, ikke rekkefølgen. Derfor bruker vi kombinasjoner og får ${ans}.`
                };
            },
            function () {
                return {
                    topic: 'uordnetUten',
                    kind: 'mc',
                    prompt: 'Hvorfor er gruppen AB den samme som gruppen BA i uordnet utvalg?',
                    choices: [
                        'Fordi bokstavene er like store',
                        'Fordi rekkefølgen ikke spiller noen rolle',
                        'Fordi vi alltid bytter plass på dem',
                        'Fordi det er sannsynlighet'
                    ],
                    correctIndex: 1,
                    explanation: 'I uordnet utvalg bryr vi oss bare om hvem som er med, ikke om rekkefølgen.'
                };
            },
            function () {
                return {
                    topic: 'uordnetUten',
                    kind: 'mc',
                    prompt: 'Hvilken formel passer best når du velger en gruppe uten at rekkefølgen teller?',
                    choices: [
                        'n^r',
                        'n! / (n-r)!',
                        'n! / (r!(n-r)!)',
                        'gunstige / mulige'
                    ],
                    correctIndex: 2,
                    explanation: 'Kombinasjonsformelen rydder bort overtellingen og passer når rekkefølgen ikke teller.'
                };
            },
            function () {
                const cards = randomInt(5, 9);
                const choose = 2;
                const ans = nCrLocal(cards, choose);
                return {
                    topic: 'uordnetUten',
                    kind: 'numeric',
                    prompt: `Du velger ${choose} kort fra ${cards} ulike kort, og rekkefølgen er likegyldig. Hvor mange mulige utvalg finnes?`,
                    answer: ans,
                    explanation: `Antallet er C(${cards}, 2) = ${ans}.`
                };
            }
        ],
        ettTrekk: [
            function () {
                const red = randomInt(2, 5);
                const blue = randomInt(2, 5);
                const yellow = randomInt(1, 4);
                const total = red + blue + yellow;
                return {
                    topic: 'ettTrekk',
                    kind: 'numeric',
                    prompt: `I en pose ligger ${red} røde, ${blue} blå og ${yellow} gule kuler. Hva er sannsynligheten for å trekke <strong>rød eller blå</strong>? <span class="small">Svar som brøk eller desimaltall.</span>`,
                    answer: (red + blue) / total,
                    explanation: `Rød eller blå gir ${red + blue} gunstige utfall av ${total} mulige. Svaret er ${(red + blue)}/${total}.`
                };
            },
            function () {
                return {
                    topic: 'ettTrekk',
                    kind: 'mc',
                    prompt: 'Du trekker ett kort fra en vanlig kortstokk på 52 kort. Hva er sannsynligheten for å få et hjerterkort?',
                    choices: ['1/2', '1/4', '13/52', '26/52'],
                    correctIndex: 2,
                    explanation: 'Det er 13 hjerterkort av 52 kort. 13/52 kan også forkortes til 1/4.'
                };
            },
            function () {
                const sides = choice([6, 8, 10]);
                const evens = Math.floor(sides / 2);
                return {
                    topic: 'ettTrekk',
                    kind: 'numeric',
                    prompt: `Et lykkehjul har tallene 1 til ${sides}. Hva er sannsynligheten for å få et partall hvis alle felt er like store?`,
                    answer: evens / sides,
                    explanation: `Det finnes ${evens} partall mellom 1 og ${sides}. Sannsynligheten blir ${evens}/${sides}.`
                };
            },
            function () {
                return {
                    topic: 'ettTrekk',
                    kind: 'mc',
                    prompt: 'Hva må stå i nevneren når du regner sannsynlighet for ett trekk?',
                    choices: [
                        'Antall gunstige utfall',
                        'Antall mulige utfall totalt',
                        'Antall røde utfall',
                        'Antall felt du liker'
                    ],
                    correctIndex: 1,
                    explanation: 'Nevneren skal være alle mulige utfall totalt.'
                };
            },
            function () {
                const green = randomInt(1, 4);
                const purple = randomInt(1, 4);
                const total = green + purple + 4;
                return {
                    topic: 'ettTrekk',
                    kind: 'numeric',
                    prompt: `I en boks ligger ${green} grønne, ${purple} lilla og 4 svarte kuler. Hva er sannsynligheten for å trekke en svart kule?`,
                    answer: 4 / total,
                    explanation: `Det er 4 gunstige og ${total} mulige utfall. Derfor er sannsynligheten 4/${total}.`
                };
            }
        ],
        toTrekk: [
            function () {
                const red = 2;
                const blue = 3;
                return {
                    topic: 'toTrekk',
                    kind: 'numeric',
                    prompt: `En pose har ${red} røde og ${blue} blå kuler. Du trekker to ganger <strong>med tilbakelegging</strong>. Hva er sannsynligheten for først rød og så blå?`,
                    answer: (red / (red + blue)) * (blue / (red + blue)),
                    explanation: `Med tilbakelegging er nevneren lik i begge trekk: ${red}/${red + blue} · ${blue}/${red + blue} = ${formatProbability((red / (red + blue)) * (blue / (red + blue)))}.`
                };
            },
            function () {
                const red = 2;
                const blue = 3;
                return {
                    topic: 'toTrekk',
                    kind: 'numeric',
                    prompt: `En pose har ${red} røde og ${blue} blå kuler. Du trekker to ganger <strong>uten tilbakelegging</strong>. Hva er sannsynligheten for først rød og så blå?`,
                    answer: (red / (red + blue)) * (blue / (red + blue - 1)),
                    explanation: `Uten tilbakelegging blir det én kule mindre etter første trekk: ${red}/${red + blue} · ${blue}/${red + blue - 1}.`
                };
            },
            function () {
                return {
                    topic: 'toTrekk',
                    kind: 'mc',
                    prompt: 'Når du følger én gren i et tre-diagram, hva gjør du vanligvis med sannsynlighetene på grenen?',
                    choices: ['Legger dem sammen', 'Multipliserer dem', 'Trekker dem fra hverandre', 'Runder dem av først'],
                    correctIndex: 1,
                    explanation: 'Langs én gren multipliserer vi sannsynlighetene.'
                };
            },
            function () {
                return {
                    topic: 'toTrekk',
                    kind: 'mc',
                    prompt: 'Når du skal finne sannsynligheten for <em>én rød og én blå</em> i to trekk, hva må du ofte huske?',
                    choices: [
                        'Bare se på RB',
                        'Bare se på BR',
                        'Legge sammen flere gunstige stier, for eksempel RB og BR',
                        'Gange med 100 med en gang'
                    ],
                    correctIndex: 2,
                    explanation: 'Én rød og én blå kan komme i flere rekkefølger. Hver gunstige sti må tas med.'
                };
            },
            function () {
                return {
                    topic: 'toTrekk',
                    kind: 'mc',
                    prompt: 'Hva er forskjellen mellom uavhengige og avhengige trekk?',
                    choices: [
                        'Uavhengige trekk påvirker ikke hverandre, avhengige trekk gjør det',
                        'Uavhengige trekk bruker alltid kortstokk',
                        'Avhengige trekk betyr at du er usikker',
                        'Det er ingen forskjell'
                    ],
                    correctIndex: 0,
                    explanation: 'Med tilbakelegging er trekkene ofte uavhengige. Uten tilbakelegging blir de avhengige fordi første trekk endrer neste sannsynlighet.'
                };
            },
            function () {
                return {
                    topic: 'toTrekk',
                    kind: 'numeric',
                    prompt: 'I en pose ligger 2 røde og 2 blå kuler. Du trekker to ganger uten tilbakelegging. Hva er sannsynligheten for å få én rød og én blå? <span class="small">Tips: Se på RB og BR.</span>',
                    answer: (2/4)*(2/3) + (2/4)*(2/3),
                    explanation: `RB og BR er begge gunstige: 2/4 · 2/3 + 2/4 · 2/3 = ${formatProbability((2/4)*(2/3) + (2/4)*(2/3))}.`
                };
            }
        ],
        programmering: [
            function () {
                return {
                    topic: 'programmering',
                    kind: 'mc',
                    prompt: 'I myntprogrammet står det <code>antall_kast = 100</code>. Hva skjer vanligvis hvis du øker dette tallet til 5000?',
                    choices: [
                        'Programmet slutter å virke',
                        'Resultatet pleier å ligge nærmere den teoretiske sannsynligheten',
                        'Mynten blir automatisk skjev',
                        'Det blir alltid nøyaktig 50 % kron'
                    ],
                    correctIndex: 1,
                    explanation: 'Flere forsøk gir ofte en simulering som ligger nærmere teorien, selv om den ikke trenger å bli helt perfekt.'
                };
            },
            function () {
                return {
                    topic: 'programmering',
                    kind: 'mc',
                    prompt: 'I koden står det <code>sannsynlighet_kron = 0.7</code>. Hva betyr det?',
                    choices: [
                        'Programmet gir omtrent 70 % kron i lengden',
                        'Programmet gir alltid kron',
                        'Mynten får 7 sider',
                        'Det blir 0,7 kast'
                    ],
                    correctIndex: 0,
                    explanation: 'Variabelen styrer sannsynligheten for kron. 0,7 betyr omtrent 70 % kron i mange kast.'
                };
            },
            function () {
                return {
                    topic: 'programmering',
                    kind: 'mc',
                    prompt: 'I terningprogrammet endrer du <code>antall_sider</code> fra 6 til 8. Hva blir da den teoretiske sannsynligheten for ett bestemt tall?',
                    choices: ['1/6', '1/7', '1/8', '8/1'],
                    correctIndex: 2,
                    explanation: 'På en rettferdig terning med 8 sider er sannsynligheten for ett bestemt tall 1/8.'
                };
            },
            function () {
                return {
                    topic: 'programmering',
                    kind: 'mc',
                    prompt: 'I programmet med to terninger er målsummen satt til 7. Hvorfor dukker 7 ofte opp som den vanligste summen på to vanlige terninger?',
                    choices: [
                        'Fordi 7 er det største tallet',
                        'Fordi det finnes flest utfall som gir sum 7',
                        'Fordi Python liker tallet 7',
                        'Fordi 7 alltid kommer først'
                    ],
                    correctIndex: 1,
                    explanation: 'Summen 7 kan lages på flest måter: 1+6, 2+5, 3+4, 4+3, 5+2 og 6+1.'
                };
            },
            function () {
                return {
                    topic: 'programmering',
                    kind: 'mc',
                    prompt: 'Hva er poenget med variabelen <code>vis_hvert_kast = False</code> i eksempelprogrammene?',
                    choices: [
                        'Den gjør at programmet ikke regner',
                        'Den styrer om alle kast skal skrives ut, eller bare oppsummeringen',
                        'Den endrer sannsynligheten',
                        'Den bytter ut terningen med mynt'
                    ],
                    correctIndex: 1,
                    explanation: 'Når variabelen står til False, blir outputen kortere og lettere å lese. Når den er True, vises hvert kast.'
                };
            }
        ]
    };

    window.TOPIC_INFO = TOPIC_INFO;
    window.QUESTION_BANK = bank;
    window.QuestionBankUtils = { randomInt, choice, shuffle };
})();
