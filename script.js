document.addEventListener('DOMContentLoaded', () => {
	const yearEl = document.getElementById('year');
	if (yearEl) {
		yearEl.textContent = new Date().getFullYear();
	}

	// ==========================================
	// CARROSSEL (COM SWIPE ADICIONADO)
	// ==========================================
	const slides = Array.from(document.querySelectorAll('.quote-slide'));
	const dotsWrap = document.getElementById('quoteDots');
	const prevBtn = document.getElementById('quotePrev');
	const nextBtn = document.getElementById('quoteNext');
	const quoteSlidesWrap = document.getElementById('quoteSlides');

	if (slides.length && dotsWrap) {
		let currentIndex = Math.max(0, slides.findIndex(slide => slide.classList.contains('active')));
		if (currentIndex === -1) {
			currentIndex = 0;
			slides[0].classList.add('active');
		}

		const dots = slides.map((_, index) => {
			const dot = document.createElement('button');
			dot.type = 'button';
			dot.setAttribute('aria-label', `Ir para depoimento ${index + 1}`);
			if (index === currentIndex) {
				dot.classList.add('active');
			}
			dot.addEventListener('click', () => showSlide(index));
			dotsWrap.appendChild(dot);
			return dot;
		});

		let autoTimer;

		function showSlide(index) {
			slides[currentIndex].classList.remove('active');
			dots[currentIndex].classList.remove('active');

			currentIndex = (index + slides.length) % slides.length;

			slides[currentIndex].classList.add('active');
			dots[currentIndex].classList.add('active');

			resetAutoPlay();
		}

		function resetAutoPlay() {
			clearInterval(autoTimer);
			autoTimer = setInterval(() => showSlide(currentIndex + 1), 10000);
		}

		prevBtn?.addEventListener('click', () => showSlide(currentIndex - 1));
		nextBtn?.addEventListener('click', () => showSlide(currentIndex + 1));

		let touchStartX = 0;
		let touchEndX = 0;

		if (quoteSlidesWrap) {
			quoteSlidesWrap.addEventListener('touchstart', e => {
				touchStartX = e.changedTouches[0].screenX;
			}, { passive: true });

			quoteSlidesWrap.addEventListener('touchend', e => {
				touchEndX = e.changedTouches[0].screenX;
				handleSwipe();
			}, { passive: true });
		}

		function handleSwipe() {
			const minSwipeDist = 40;
			if (touchEndX < touchStartX - minSwipeDist) {
				showSlide(currentIndex + 1);
			}
			if (touchEndX > touchStartX + minSwipeDist) {
				showSlide(currentIndex - 1);
			}
		}

		resetAutoPlay();
	}

	// ==========================================
	// ANIMAÇÃO DE SCROLL SUAVIZADA (FADE/REVEAL)
	// ==========================================
	
	const elementsToReveal = document.querySelectorAll('section:not(.hero) .container, .client-card, .service-card, .rh-item');
	
	const revealObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('active');
				observer.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.1,
		rootMargin: "0px 0px -40px 0px"
	});


	elementsToReveal.forEach(el => {
		el.classList.add('reveal');
		revealObserver.observe(el);
	});
});