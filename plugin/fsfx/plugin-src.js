const Plugin = () => {

	const selectionArray = function (container, selectors) {
		let selections = container.querySelectorAll(selectors);
		let selectionarray = Array.prototype.slice.call(selections);
		return selectionarray
	};



	const sfEnabled = function () {
		if (screenfull.enabled || screenfull.isEnabled) {
			return true
		}
		return false
	}


	const fullScreenEffects = function (deck, options) {

		let viewport = (deck.getRevealElement()).tagName == "BODY" ? document : deck.getRevealElement();
		let fsButtons = selectionArray(viewport, ".".concat(options.baseclass));
		let toggleThese = selectionArray(document, "[data-fs-toggle]");


		const hideIfNoFS = function (fsButton) {
			if (options.hideifnofs == true && !fsButton.hasAttribute("data-fs-gonext")) {
				fsButton.style.display = "none";
			} else {
				fsButton.onclick = function () {
					deck.next();
				}
			}
		}

		const buttonCheck = function (fsButtons) {

			fsButtons.filter(function (fsButton) {

				const goNext = function () {
					if (parseInt(fsButton.dataset.fsGonext) > 0 && !screenfull.isFullscreen) {
						setTimeout((function () {
							deck.next();
						}), parseInt(fsButton.dataset.fsGonext));
					} else {
						deck.next()
					}
				}

				fsButton.onclick = function () {

					if (sfEnabled() == true) {
						if (fsButton.hasAttribute("data-fs-gonext")) {

							if (screenfull.isFullscreen) {
								goNext();
							} else {
								screenfull.request(viewport).then(goNext());
							}
						} else {
							screenfull.toggle(viewport);
						}
					} else {
						deck.next()
					}
				}
			});



		}

		const toggleCheck = function (toggleThese) {

			const fullscreenchange = function () {
				if (screenfull.isFullscreen) {
					toggleThese.filter(function (toggleThis) {
						toggleThis.classList.add(toggleThis.dataset.fsToggle);
					});
				}
				if (!screenfull.isFullscreen) {
					toggleThese.filter(function (toggleThis) {
						toggleThis.classList.remove(toggleThis.dataset.fsToggle);
					});
				}
			};

			if (sfEnabled() == true) {
				document.addEventListener(screenfull.raw.fullscreenchange, fullscreenchange);
			}
		}



		if (typeof screenfull !== "undefined") {

			if (fsButtons.length > 0) {
				buttonCheck(fsButtons);
			} else {
				console.log("There are no FS buttons");
			}

			if (toggleThese.length > 0) {
				toggleCheck(toggleThese);
			} else {
				console.log("There are no elements with 'data-fs-toggle'.");
			}

		} else {

			fsButtons.filter(function (fsButton) {
				hideIfNoFS(fsButton)
			});

			console.log("Screenfull.js did not load");
		}

	}



	const init = function (deck) {

		let defaultOptions = {
			baseclass: 'fsbutton',
			hideifnofs: true
		};

		const defaults = function (options, defaultOptions) {
			for (let i in defaultOptions) {
				if (!options.hasOwnProperty(i)) {
					options[i] = defaultOptions[i];
				}
			}
		}

		let options = deck.getConfig().fsfx || {};

		defaults(options, defaultOptions);

		fullScreenEffects(deck, options);

	};

	return {
		id: 'fsfx',
		init: init
	};
};

export default Plugin;