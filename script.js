
document.addEventListener('DOMContentLoaded', function() {
    
    function initCarousel() {
        if (typeof $ !== 'undefined' && $.fn.slick) {
            try {
                $('.properties-carousel').slick({
                    dots: true,
                    infinite: true,
                    speed: 500,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    autoplay: true,
                    autoplaySpeed: 5000,
                    pauseOnHover: true,
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 480,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                dots: true,
                                arrows: false
                            }
                        }
                    ]
                });
                console.log('Carrossel Slick inicializado com sucesso!');
            } catch (error) {
                console.error('Erro ao inicializar o carrossel:', error);
            }
        } else {
            console.log('jQuery ou Slick não estão disponíveis ainda, tentando novamente...');
            setTimeout(initCarousel, 100);
        }
    }
    
    initCarousel();
    
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white', 'shadow');
        } else {
            navbar.classList.remove('bg-white', 'shadow');
        }
    });
    
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Ajuste para navbar fixa
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const searchForm = document.querySelector('.search-section form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const tipo = document.getElementById('tipo').value;
            const bairro = document.getElementById('bairro').value;
            const quartos = document.getElementById('quartos').value;
            
            showSearchResults(tipo, bairro, quartos);
        });
    }
    
    const contactForm = document.querySelector('#contato form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const assunto = document.getElementById('assunto').value;
            const mensagem = document.getElementById('mensagem').value;
            
            if (!nome || !email || !mensagem) {
                showAlert('Por favor, preencha todos os campos obrigatórios.', 'warning');
                return;
            }
            
            showAlert('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            this.reset();
        });
    }
    
    const actionButtons = document.querySelectorAll('.btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.textContent.includes('Ver Imóveis')) {
                e.preventDefault();
                document.querySelector('#imoveis').scrollIntoView({ behavior: 'smooth' });
            } else if (this.textContent.includes('Fale Conosco')) {
                e.preventDefault();
                document.querySelector('#contato').scrollIntoView({ behavior: 'smooth' });
            } else if (this.textContent.includes('Ver Detalhes')) {
                e.preventDefault();
                showPropertyDetails(this);
            } else if (this.textContent.includes('Ver Todos os Imóveis')) {
                e.preventDefault();
                showAllProperties();
            }
        });
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.card, .service-card, .property-card');
    animatedElements.forEach(el => observer.observe(el));
    
    const filterButtons = document.querySelectorAll('.property-features .badge');
    filterButtons.forEach(badge => {
        badge.addEventListener('click', function() {
            const filterType = this.textContent;
            filterProperties(filterType);
        });
    });
    
    function showPropertyDetails(button) {
        const card = button.closest('.property-card');
        const title = card.querySelector('.card-title').textContent;
        const location = card.querySelector('.card-text').textContent;
        const price = card.querySelector('.price').textContent;
        const features = Array.from(card.querySelectorAll('.property-features .badge'))
            .map(badge => badge.textContent)
            .join(', ');
        
        const modalHTML = `
            <div class="modal fade" id="propertyModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <img src="${card.querySelector('img').src}" class="img-fluid rounded" alt="${title}">
                                </div>
                                <div class="col-md-6">
                                    <h6>Localização</h6>
                                    <p class="text-muted">${location}</p>
                                    <h6>Características</h6>
                                    <p class="text-muted">${features}</p>
                                    <h6>Preço</h6>
                                    <p class="price">${price}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" class="btn btn-primary">Agendar Visita</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('propertyModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = new bootstrap.Modal(document.getElementById('propertyModal'));
        modal.show();
    }
    
    function showSearchResults(tipo, bairro, quartos) {
        let message = 'Buscando imóveis...';
        
        if (tipo !== 'Tipo de Imóvel') message += ` Tipo: ${tipo}`;
        if (bairro !== 'Bairro') message += ` Bairro: ${bairro}`;
        if (quartos !== 'Quartos') message += ` Quartos: ${quartos}`;
        
        showAlert(message, 'info');
        
        setTimeout(() => {
            showAlert('Encontramos 15 imóveis que atendem aos seus critérios!', 'success');
        }, 2000);
    }

    
    function showAllProperties() {
        showAlert('Carregando todos os imóveis disponíveis...', 'info');
        
        setTimeout(() => {
            showAlert('Todos os imóveis foram carregados!', 'success');
        }, 1500);
    }

    
    function filterProperties(filterType) {
        const propertyCards = document.querySelectorAll('.property-card');
        
        propertyCards.forEach(card => {
            const features = card.querySelectorAll('.property-features .badge');
            let hasFeature = false;
            
            features.forEach(feature => {
                if (feature.textContent.includes(filterType)) {
                    hasFeature = true;
                }
            });
            
            if (hasFeature) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
        
        showAlert(`Filtrado por: ${filterType}`, 'info');
    }
    
    function showAlert(message, type = 'info') {
        const alertContainer = document.createElement('div');
        alertContainer.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertContainer.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertContainer.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertContainer);
        
        setTimeout(() => {
            if (alertContainer.parentNode) {
                alertContainer.remove();
            }
        }, 5000);
    }
    
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
    
    const statsNumbers = document.querySelectorAll('.stats-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    });

    statsNumbers.forEach(stat => statsObserver.observe(stat));

    function animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
    
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldValidation(this);
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        clearFieldValidation(field);
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        } else if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            errorMessage = 'E-mail inválido';
        } else if (field.type === 'tel' && value && !isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Telefone inválido';
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
    }

    function showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldValidation(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
    
    const scrollTopButton = document.createElement('button');
    scrollTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopButton.className = 'btn btn-primary position-fixed';
    scrollTopButton.style.cssText = 'bottom: 20px; right: 20px; z-index: 1000; width: 50px; height: 50px; border-radius: 50%; display: none;';
    
    document.body.appendChild(scrollTopButton);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopButton.style.display = 'block';
        } else {
            scrollTopButton.style.display = 'none';
        }
    });
    
    scrollTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });
    
    console.log('🚀 Imobiliária Premium carregada com sucesso!');
    console.log('📱 Página responsiva e otimizada para todos os dispositivos');
    console.log('🎨 Design moderno com Bootstrap 5 e CSS personalizado');
    console.log('⚡ Funcionalidades JavaScript interativas implementadas');
});


window.ImobiliariaUtils = {
    
    formatPrice: function(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    },
    
    formatPhone: function(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    },
    
    validateCPF: function(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11) return false;
        
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = 11 - (sum % 11);
        let digit1 = remainder < 2 ? 0 : remainder;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = 11 - (sum % 11);
        let digit2 = remainder < 2 ? 0 : remainder;
        
        return parseInt(cpf.charAt(9)) === digit1 && parseInt(cpf.charAt(10)) === digit2;
    }
};
