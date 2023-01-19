'use strict';
///////////////////////////////////////////
///// Memory Karten Spiel//////////////////
///////////////////////////////////////////

// Legende:
// A - Karten umdrehen
// B - Karten matchen
// B.2 - Nach einer Übereinstimmung suchen
// B.2.1 -- EventListener des übereinstimmenden Paares entfernen, damit diese nicht noch einmal gespielt werden
// B.2.2 -- keine Übereinstimmung
// C - Lock Board - Spielbrett wird gesperrt

// D - Wenn zweimal auf die selbe Karte geklickt wird
// Die übereinstimmende Bedingung würde als wahr ausgewertet 
// und der Ereignis-Listener von dieser Karte entfernt.
// So muss geprüft werden, ob die aktuell angeklickte Karte gleich der ersten Karte ist
// und kehren bei einem positiven Ergebnis zurück
// First und Second Card müssen nach jeder Runde zurückgesetzt werden -- dies geschieht per resetBoard


// E -- Die Karten mischen

// A - Aufruf der ganzen Karten mit document.querySelectorAll
  const cards = document.querySelectorAll('.memory-card');
// B - Variablen anlegen
  let hasFlippedCard = false; 
  let lockBoard = false; 
  let firstCard, secondCard;  


// A - Dem Element wird eine Klasse hinzugefügt,damit die beim anklicken umgedreht werden kann
// Dies läuft dann unter der Funktion FlipCard weiter
// This stellt die Karte dar, welche angeklickt wurde
// Die Funktion greift auf die Klassenliste des Elements zu und schaltet die Flip-Klasse um

  function flipCard() {
    if (lockBoard) return; // C -- wird zurückgegeben, wenn die zweite Karte angeklickt wurde
    if (this === firstCard) return; // D -- ist die aktuell angeklickte Karte gleich der ersten Karte?

    //this.classList.toggle('flip');
    //console.log() -- als Test für A
    this.classList.add('flip');
// B -- 
// Wenn die erste Karte angeklickt wird, muss sie warten, bis eine weitere Karte umgedreht wird. 
// Die Variable hasFlippedCard und die Funktion flippedCard verwalten das Umdrehen
// Falls keine umgedrehte Karte vorhanden ist, wird hasFlippedCard auf true
// und firstCard auf die angeklickte Karte gesetzt.
    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
  
      return; // zu B.2
    }
    secondCard = this;

    // hasFlippedCard = false; // hasflippedcard wird wieder auf false gestellt -- zur Grundeinstellung zurück
    // hasflipped und lockboard werden als false in resetBoard (D) auf falsch gesetzt

    checkForMatch(); // B.2 -- eigene checkForMatch Methode welche unten
    // in einer Funktion genauer definiert wird
  }

 // B.2 --  Die Paar Logik / Match Logik wird in ihrer eignen Funktion checkForMatch() extrahiert
 // Wenn zwei Karten übereinstimmen, wird disableCards() aufgerufen und 
 // B.2.1 --die Ereignis-Listener auf beiden Karten werden getrennt, um ein weiteres Umdrehen zu verhindern.

  function checkForMatch() {
 
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
      disableCards();
      return;
    }
    unflipCards(); 

  }

  // B.2.1 Karten werden deaktiviert (disable) und nicht mehr anklickbar
  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
  
    resetBoard(); // D
  }
// B.2.2
// Stimmen die beiden Karten nicht überein, dreht unflipCards() die Karten um
// 800 ms / 0.8s zurück und entfernt die Flip-Klasse welche bei A hinzugefügt wurde

  function unflipCards() {
    lockBoard = true; // C --
    //  Wird die zweite Karte angeklickt,
    //  setzt sich lockBoard auf true und die Bedingung if (lockBoard) wird zurückgegeben;
    //  Es verhindert, dass Karten umgedreht werden, bevor die Karten versteckt sind oder übereinstimmen
  
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');

      // lockBoard = false; // C -- ist in resetBoard hinterlegt
      resetBoard(); // D
      
    }, 800);
  }

 // D - hasFlipped und lockboard werden hier gespeichert
 // firstcard und secondcard werden auf 0 gesetzt
  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

// E -- Karten mischen
// 12 Karten -- zufällige Position generieren dies wird mit card.style.order zugewiesen
  (function shuffle() {
    cards.forEach(card => {
      let randomPos = ~~(Math.random() * 12);
      card.style.order = randomPos;
    });
  })
  ();

// A - hier werden unsere karten mit forEach durchlaufen und fügen einen eventlistener hinzu
// jedes mal wenn eine karte angekklickt wird, wird die Flipcard Funktion ausgelöst
  cards.forEach(card => card.addEventListener('click', flipCard));


//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
// Timer-------------------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

const anzeige = document.getElementById("zeitanzeige");
let gestoppteZeit = 0;
let pausiert = true;
let letzterDurchlauf = new Date();

function start() {
    pausiert = false;
}

function pause() {
    pausiert = true;
}

function reset() {
    pausiert = true;
    gestoppteZeit = 0;
    aktualisiereAnzeige(); 
}

function aktualisiereZeit() {
    if(pausiert === false) {
        gestoppteZeit += new Date() - letzterDurchlauf;
        aktualisiereAnzeige();
    }

    letzterDurchlauf = new Date();
    setTimeout(aktualisiereZeit, 1);
}

function aktualisiereAnzeige() {
    let millisekunden = gestoppteZeit % 1000;
    let sekunden = Math.floor(gestoppteZeit / 1000) % 60;
    let minuten = Math.floor(gestoppteZeit / 60000) % 60;
    let stunden = Math.floor(gestoppteZeit / 3600000);

    stunden = stunden < 10 ? "0" + stunden : stunden;
    minuten = minuten < 10 ? "0" + minuten : minuten;
    sekunden = sekunden < 10 ? "0" + sekunden : sekunden;
    millisekunden = "000" + millisekunden;
    millisekunden = millisekunden.slice(millisekunden.length - 3);
 
    anzeige.innerHTML = stunden + ":" + minuten + ":" + sekunden + "." + millisekunden;
}

aktualisiereZeit();
