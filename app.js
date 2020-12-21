const cards = Array.from(document.querySelectorAll('.card')),
	actionBtn = document.getElementById('action-btn'),
	resetBtn = document.getElementById('reset-btn'),
	selectedCardText = document.getElementById('selected-text'),
	selectedCardIcon = document.getElementById('selected-card-icon'),
	numOfShuffles = 20;

let counter, selectedCard, values;

resetBtn.addEventListener('click', init);

init();

function init() {
	cards.forEach((card) => {
		// remove rotate card class
		card.firstElementChild.classList.remove('rotate-card');
		// add slide animation in cards
		cards.forEach((card) => card.classList.add('slide-cards'));
	});

	// show action btn
	actionBtn.classList.remove('show-btn');
	// set initial action btn text
	actionBtn.textContent = 'Tap to start the game';
	// enable action btn
	actionBtn.classList.remove('disable');
	// set action btn event
	actionBtn.onclick = showCards;
	// remove selected card icon
	selectedCardIcon.src = '';

	// add onanimationend on 1st card
	cards[0].onanimationend = () => {
		// add transition to action btn
		actionBtn.classList.add('btn-transition');
		// show action btn
		actionBtn.classList.add('show-btn');
		// remove onanimationend event
		cards[0].onanimationend = null;
	};

	// hide play again btn
	resetBtn.classList.add('hide');
	// hide selected card info
	selectedCardText.classList.add('hide');

	// initial cards placement values
	values = [ '0%', '25%', '50%', '75%' ];
	// initial counter
	counter = 0;
	assignValues();
}

function showCards() {
	cards.forEach((card) => {
		// add transition to card content box
		card.firstElementChild.classList.add('content-transition');
		// add rotate-card class to card content box
		card.firstElementChild.classList.add('rotate-card');
	});
	// hide action btn
	actionBtn.classList.remove('show-btn');
	// remove click event from action btn
	actionBtn.classList.add('disable');

	// set ontransitionend (set it to any card since every card has same animation duration)
	cards[0].firstElementChild.ontransitionend = () => {
		// remove animation from card[0] content
		cards[0].firstElementChild.ontransitionend = null;
		// remove click event from action btn
		actionBtn.onclick = null;
		// change text  of action btn
		actionBtn.textContent = 'Choose a card';
		// show action btn
		actionBtn.classList.add('show-btn');

		cards.forEach((card) => {
			// remove disable class
			card.classList.remove('disable');
			// set click event to card
			card.onclick = showSelectedCard;
		});
	};
}

function showSelectedCard() {
	// assign card as selected card
	selectedCard = this;
	// remove rotate-card class from card content
	cards.forEach((card) => card.firstElementChild.classList.remove('rotate-card'));
	// remove action btn
	actionBtn.classList.remove('show-btn');
	cards.forEach((card) => {
		// remove click event from card
		card.onclick = null;
		// add disable class
		card.classList.add('disable');
	});
	this.ontransitionend = () => {
		// remove onanimationend event from selected card
		this.ontransitionend = null;
		// set selected card number icon
		selectedCardIcon.src = selectedCardIcon.src = document.querySelector(`#${this.id} .icon`).getAttribute('src');
		// show info of selected card
		selectedCardText.classList.remove('hide');
		// chnage action btn text
		actionBtn.textContent = 'Wait for a second';
		// add ontransitionend event to action btn
		actionBtn.ontransitionend = shuffleCards;
		// show action btn (this statement triggers the ontransitionend on action btn)
		actionBtn.classList.add('show-btn');
	};
}

function assignValues() {
	cards.forEach((card, index) => {
		// change left property of card
		card.style.left = values[index];
		// change z-index of card
		card.style.zIndex = values[index].slice(0, -1);
	});
}

// Durstenfeld's Shuffle
function shuffleValues(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[ array[i], array[j] ] = [ array[j], array[i] ];
	}
}

function shuffleCards() {
	if (counter < numOfShuffles) {
		// increment counter
		counter++;
		// shuffle left property values
		shuffleValues(values);
		// assign left property values to each card
		assignValues();
		// toggle opacity of action btn
		actionBtn.classList.toggle('show-btn');
	} else {
		// remove ontransitionend event from action btn
		actionBtn.ontransitionend = null;
		// change text content of action btn
		actionBtn.textContent = 'Guess your card';
		cards.forEach((card) => {
			// remove disable class
			card.classList.remove('disable');
			// add click event to card
			card.onclick = matchCards;
		});
	}
}

function matchCards() {
	cards.forEach((card) => {
		// rotate card to show numbers
		card.firstElementChild.classList.add('rotate-card');
		// remove click event from card
		card.onclick = null;
		// add disable class
		card.classList.add('disable');
	});
	this.ontransitionend = () => {
		// remove ontransitionend from current card
		this.ontransitionend = null;
		// change action btn text
		actionBtn.textContent = `Your guess ${this.id === selectedCard.id ? 'right' : 'wrong'}!`;
		// remove transition from action btn
		actionBtn.classList.remove('btn-transition');
		// show play again btn
		resetBtn.classList.remove('hide');
		// remove slide animation from each card
		cards.forEach((card) => {
			card.classList.remove('slide-cards');
			// remove transition from card content box
			card.firstElementChild.classList.remove('content-transition');
		});
	};
}
