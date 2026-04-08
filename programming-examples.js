
(function () {
    const examples = {
        mynt: {
            title: 'Myntkast mange ganger',
            short: 'Kast en mynt mange ganger og sammenlign teori med simulering.',
            variables: [
                'antall_kast: hvor mange kast programmet skal gjøre',
                'sannsynlighet_kron: hvor stor sjanse det er for kron',
                'vis_hvert_kast: om hvert kast skal skrives ut'
            ],
            challenges: [
                'Sett antall_kast til 20, 200 og 2000. Hva legger du merke til?',
                'Endre sannsynlighet_kron til 0.7. Hva skjer med andelen kron?',
                'Skru på vis_hvert_kast og se hvordan outputen endrer seg.'
            ],
            code: `# -----------------------------------------
# SIMULERING AV MYNTKAST
# -----------------------------------------
# Dette programmet kaster en mynt mange ganger.
# Til slutt teller vi hvor mange ganger vi fikk
# "kron" og hvor mange ganger vi fikk "mynt".
#
# Tanken er at du skal kunne endre variablene
# øverst og så kjøre programmet på nytt.
# -----------------------------------------

import random

# ---------------------------
# TING DU KAN ENDRE
# ---------------------------

# Hvor mange kast skal vi gjøre?
antall_kast = 100

# Hvor stor sannsynlighet skal det være for "kron"?
# 0.5 betyr en helt vanlig mynt.
# 0.7 betyr en "skjev" mynt som gir kron oftere.
sannsynlighet_kron = 0.5

# Skal programmet skrive ut hvert kast?
# True betyr ja.
# False betyr nei.
vis_hvert_kast = False

# ---------------------------
# TELLERE
# ---------------------------

# Vi starter på 0 fordi vi ikke har kastet ennå.
antall_kron = 0
antall_mynt = 0

# ---------------------------
# SELVE SIMULERINGEN
# ---------------------------

# Vi bruker en løkke for å gjøre mange kast.
for kast_nummer in range(1, antall_kast + 1):

    # random.random() lager et tilfeldig tall
    # mellom 0 og 1.
    tilfeldig_tall = random.random()

    # Hvis det tilfeldige tallet er mindre enn
    # sannsynlighet_kron, sier vi at kastet ble kron.
    if tilfeldig_tall < sannsynlighet_kron:
        resultat = "kron"
        antall_kron += 1
    else:
        resultat = "mynt"
        antall_mynt += 1

    # Denne delen skriver ut hvert kast hvis du vil.
    if vis_hvert_kast:
        print("Kast", kast_nummer, "ble:", resultat)

# ---------------------------
# OPPSUMMERING
# ---------------------------

print()
print("OPPSUMMERING")
print("Antall kast:", antall_kast)
print("Antall kron:", antall_kron)
print("Antall mynt:", antall_mynt)

# Eksperimentell sannsynlighet er det vi faktisk
# fikk i simuleringen.
andel_kron = antall_kron / antall_kast
andel_mynt = antall_mynt / antall_kast

print("Andel kron i simuleringen:", andel_kron)
print("Andel mynt i simuleringen:", andel_mynt)

# Teoretisk sannsynlighet er den sannsynligheten
# vi startet med.
print("Teoretisk sannsynlighet for kron:", sannsynlighet_kron)
print("Teoretisk sannsynlighet for mynt:", 1 - sannsynlighet_kron)
`
        },
        juksemynt: {
            title: 'Juksemynt og sammenligning',
            short: 'Kjør flere runder og se forskjellen på en rettferdig mynt og en skjev mynt.',
            variables: [
                'antall_forsok: hvor mange ganger hver mynt skal kastes',
                'sannsynlighet_rettferdig: sannsynlighet for kron på vanlig mynt',
                'sannsynlighet_skjev: sannsynlighet for kron på skjev mynt'
            ],
            challenges: [
                'Gjør den skjeve mynten enda skjevere, for eksempel 0.85.',
                'Senk antall_forsok til 10. Blir forskjellen tydeligere eller mer urolig?',
                'Endre navn på myntene og lag din egen minirapport nederst i programmet.'
            ],
            code: `# -----------------------------------------
# TO MYNTER: EN RETTFERDIG OG EN SKEV
# -----------------------------------------
# Dette programmet sammenligner to mynter.
# Begge myntene kastes like mange ganger.
# Deretter sammenligner vi andelen kron.
# -----------------------------------------

import random

# ---------------------------
# TING DU KAN ENDRE
# ---------------------------

# Hvor mange kast skal hver mynt få?
antall_forsok = 200

# Sannsynlighet for kron på en vanlig mynt.
sannsynlighet_rettferdig = 0.5

# Sannsynlighet for kron på en skjev mynt.
sannsynlighet_skjev = 0.7

# ---------------------------
# FUNKSJON SOM SIMULERER EN MYNT
# ---------------------------

def kast_mynt(antall_kast, sannsynlighet_kron):
    # Teller hvor mange kron vi får.
    antall_kron = 0

    # Gjør mange kast i en løkke.
    for _ in range(antall_kast):
        tilfeldig_tall = random.random()

        if tilfeldig_tall < sannsynlighet_kron:
            antall_kron += 1

    # Sender tilbake antall kron.
    return antall_kron

# ---------------------------
# KJØR SIMULERINGEN
# ---------------------------

kron_rettferdig = kast_mynt(antall_forsok, sannsynlighet_rettferdig)
kron_skjev = kast_mynt(antall_forsok, sannsynlighet_skjev)

andel_rettferdig = kron_rettferdig / antall_forsok
andel_skjev = kron_skjev / antall_forsok

# ---------------------------
# SKRIV UT RESULTATENE
# ---------------------------

print("RETTFERDIG MYNT")
print("Kron:", kron_rettferdig)
print("Andel kron:", andel_rettferdig)
print("Teori:", sannsynlighet_rettferdig)

print()
print("SKEV MYNT")
print("Kron:", kron_skjev)
print("Andel kron:", andel_skjev)
print("Teori:", sannsynlighet_skjev)

print()
print("Forskjell i andel kron:", andel_skjev - andel_rettferdig)
`
        },
        terning: {
            title: 'Én terning og ett bestemt tall',
            short: 'Undersøk hvor ofte et bestemt tall dukker opp på en terning.',
            variables: [
                'antall_kast: hvor mange kast du vil gjøre',
                'antall_sider: hvor mange sider terningen har',
                'onsket_tall: tallet du vil følge med på'
            ],
            challenges: [
                'Endre onsket_tall fra 6 til 1 eller 3. Blir sannsynligheten annerledes?',
                'Endre antall_sider til 8. Hva skjer med teorien?',
                'Skru på vis_hvert_kast for å se alle kastene.'
            ],
            code: `# -----------------------------------------
# SIMULERING AV TERNINGKAST
# -----------------------------------------
# Dette programmet kaster en terning mange ganger
# og teller hvor ofte vi får et bestemt tall.
# -----------------------------------------

import random

# ---------------------------
# TING DU KAN ENDRE
# ---------------------------

# Hvor mange kast skal vi gjøre?
antall_kast = 120

# Hvor mange sider har terningen?
# En vanlig terning har 6 sider.
antall_sider = 6

# Hvilket tall vil du undersøke?
onsket_tall = 6

# Skal hvert kast skrives ut?
vis_hvert_kast = False

# ---------------------------
# TELLER
# ---------------------------

antall_treff = 0

# ---------------------------
# SIMULERING
# ---------------------------

for kast_nummer in range(1, antall_kast + 1):

    # random.randint(1, antall_sider) gir
    # et tilfeldig heltall fra 1 til og med antall_sider.
    kast = random.randint(1, antall_sider)

    # Hvis kastet er lik tallet vi undersøker,
    # øker vi telleren med 1.
    if kast == onsket_tall:
        antall_treff += 1

    if vis_hvert_kast:
        print("Kast", kast_nummer, "ble:", kast)

# ---------------------------
# RESULTAT
# ---------------------------

print()
print("OPPSUMMERING")
print("Antall kast:", antall_kast)
print("Antall sider på terningen:", antall_sider)
print("Tall vi undersøkte:", onsket_tall)
print("Antall treff:", antall_treff)

# Eksperimentell sannsynlighet er det vi så.
eksperimentell_sannsynlighet = antall_treff / antall_kast

# Teoretisk sannsynlighet for ett bestemt tall
# på en rettferdig terning er 1 delt på antall_sider.
teoretisk_sannsynlighet = 1 / antall_sider

print("Eksperimentell sannsynlighet:", eksperimentell_sannsynlighet)
print("Teoretisk sannsynlighet:", teoretisk_sannsynlighet)
`
        },
        toTerninger: {
            title: 'To terninger og en bestemt sum',
            short: 'Se hvorfor noen summer dukker opp oftere enn andre.',
            variables: [
                'antall_forsok: hvor mange forsøk du vil gjøre',
                'antall_sider: hvor mange sider hver terning har',
                'mal_sum: summen du vil undersøke'
            ],
            challenges: [
                'Sett mal_sum til 2, 7 og 12. Hvilken sum virker vanligst?',
                'Endre antall_sider til 8 og test flere summer.',
                'Skru på vis_hvert_forsok og studer de første 20 forsøkene.'
            ],
            code: `# -----------------------------------------
# TO TERNINGER OG SUM
# -----------------------------------------
# Dette programmet kaster to terninger mange ganger
# og undersøker hvor ofte vi får en bestemt sum.
#
# Programmet regner også ut den teoretiske
# sannsynligheten ved å sjekke alle mulige utfall.
# -----------------------------------------

import random

# ---------------------------
# TING DU KAN ENDRE
# ---------------------------

# Hvor mange forsøk skal vi gjøre?
antall_forsok = 200

# Hvor mange sider har hver terning?
antall_sider = 6

# Hvilken sum vil du undersøke?
mal_sum = 7

# Skal hvert forsøk skrives ut?
vis_hvert_forsok = False

# ---------------------------
# TELLER FOR SIMULERINGEN
# ---------------------------

antall_treff = 0

# ---------------------------
# SIMULERING
# ---------------------------

for forsok_nummer in range(1, antall_forsok + 1):

    # Vi kaster to terninger.
    terning_1 = random.randint(1, antall_sider)
    terning_2 = random.randint(1, antall_sider)

    # Vi finner summen.
    summen = terning_1 + terning_2

    # Hvis summen er lik målsummen vår,
    # teller vi ett treff.
    if summen == mal_sum:
        antall_treff += 1

    if vis_hvert_forsok:
        print(
            "Forsøk", forsok_nummer,
            ": terning 1 =", terning_1,
            ", terning 2 =", terning_2,
            ", sum =", summen
        )

# ---------------------------
# TEORETISK SANNSYNLIGHET
# ---------------------------
# Nå går vi gjennom alle mulige utfall
# for to terninger.

gunstige_utfall = 0
mulige_utfall = antall_sider * antall_sider

for forste_terning in range(1, antall_sider + 1):
    for andre_terning in range(1, antall_sider + 1):
        if forste_terning + andre_terning == mal_sum:
            gunstige_utfall += 1

teoretisk_sannsynlighet = gunstige_utfall / mulige_utfall
eksperimentell_sannsynlighet = antall_treff / antall_forsok

# ---------------------------
# RESULTAT
# ---------------------------

print()
print("OPPSUMMERING")
print("Antall forsøk:", antall_forsok)
print("Målsum:", mal_sum)
print("Antall treff:", antall_treff)
print("Gunstige utfall teoretisk:", gunstige_utfall)
print("Mulige utfall totalt:", mulige_utfall)
print("Eksperimentell sannsynlighet:", eksperimentell_sannsynlighet)
print("Teoretisk sannsynlighet:", teoretisk_sannsynlighet)
`
        }
    };

    window.PROGRAMMING_EXAMPLES = examples;
})();
