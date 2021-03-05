document.addEventListener('DOMContentLoaded', function() {


    function initMenu() {
        const menuBtn = document.querySelector('.header__menu-btn');
        const menuClose = document.querySelector('.menu__close');
        const menu = document.querySelector('.menu');
        const html = document.querySelector('html');
        
        menuBtn.addEventListener('click', function() {
            menu.classList.add('active');
            // menuBtn.classList.toggle('active');
            // html.classList.toggle('overflow-hidden');
        })
        menuClose.addEventListener('click', function() {
            menu.classList.remove('active');
            menuClose.classList.remove('active');
        })
    }
    function initDynamicAdapt() {
        function DynamicAdapt(type) {
            this.type = type;
        }
        
        DynamicAdapt.prototype.init = function () {
            const _this = this;
            // массив объектов
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            // массив DOM-элементов
            this.nodes = document.querySelectorAll("[data-da]");
        
            // наполнение оbjects объктами
            for (let i = 0; i < this.nodes.length; i++) {
                const node = this.nodes[i];
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(dataArray[0].trim());
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }
        
            this.arraySort(this.оbjects);
        
            // массив уникальных медиа-запросов
            this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
                return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
            }, this);
            this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
                return Array.prototype.indexOf.call(self, item) === index;
            });
        
            // навешивание слушателя на медиа-запрос
            // и вызов обработчика при первом запуске
            for (let i = 0; i < this.mediaQueries.length; i++) {
                const media = this.mediaQueries[i];
                const mediaSplit = String.prototype.split.call(media, ',');
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
        
                // массив объектов с подходящим брейкпоинтом
                const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
                    return item.breakpoint === mediaBreakpoint;
                });
                matchMedia.addListener(function () {
                    _this.mediaHandler(matchMedia, оbjectsFilter);
                });
                this.mediaHandler(matchMedia, оbjectsFilter);
            }
        };
        
        DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
            if (matchMedia.matches) {
                for (let i = 0; i < оbjects.length; i++) {
                    const оbject = оbjects[i];
                    оbject.index = this.indexInParent(оbject.parent, оbject.element);
                    this.moveTo(оbject.place, оbject.element, оbject.destination);
                }
            } else {
                for (let i = 0; i < оbjects.length; i++) {
                    const оbject = оbjects[i];
                    if (оbject.element.classList.contains(this.daClassname)) {
                        this.moveBack(оbject.parent, оbject.element, оbject.index);
                    }
                }
            }
        };
        
        // Функция перемещения
        DynamicAdapt.prototype.moveTo = function (place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === 'last' || place >= destination.children.length) {
                destination.insertAdjacentElement('beforeend', element);
                return;
            }
            if (place === 'first') {
                destination.insertAdjacentElement('afterbegin', element);
                return;
            }
            destination.children[place].insertAdjacentElement('beforebegin', element);
        }
        
        // Функция возврата
        DynamicAdapt.prototype.moveBack = function (parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== undefined) {
                parent.children[index].insertAdjacentElement('beforebegin', element);
            } else {
                parent.insertAdjacentElement('beforeend', element);
            }
        }
        
        // Функция получения индекса внутри родителя
        DynamicAdapt.prototype.indexInParent = function (parent, element) {
            const array = Array.prototype.slice.call(parent.children);
            return Array.prototype.indexOf.call(array, element);
        };
        
        // Функция сортировки массива по breakpoint и place 
        // по возрастанию для this.type = min
        // по убыванию для this.type = max
        DynamicAdapt.prototype.arraySort = function (arr) {
            if (this.type === "min") {
                Array.prototype.sort.call(arr, function (a, b) {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) {
                            return 0;
                        }
        
                        if (a.place === "first" || b.place === "last") {
                            return -1;
                        }
        
                        if (a.place === "last" || b.place === "first") {
                            return 1;
                        }
        
                        return a.place - b.place;
                    }
        
                    return a.breakpoint - b.breakpoint;
                });
            } else {
                Array.prototype.sort.call(arr, function (a, b) {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) {
                            return 0;
                        }
        
                        if (a.place === "first" || b.place === "last") {
                            return 1;
                        }
        
                        if (a.place === "last" || b.place === "first") {
                            return -1;
                        }
        
                        return b.place - a.place;
                    }
        
                    return b.breakpoint - a.breakpoint;
                });
                return;
            }
        };
        
        const da = new DynamicAdapt("max");
        da.init();
    }
    

    function initAos() {
        AOS.init({
            duration: 700
        });
    }

    function initFooterPanel() {
        $('.footer__item-head').on('click', function(e) {
            const item = this.closest('.footer__item');
            const content = item.querySelector('.footer__item-content');
            const caption = this.querySelector('span');
            const items = document.querySelectorAll('.footer__item');

            if (item.classList.contains('active')) {
                items.forEach(el => {
                    item.classList.remove('active');
                    el.classList.remove('hide');
                })
            }
            else {
                item.classList.add('active');

                items.forEach(el => {
                    if (el != item) {
                        el.classList.add('hide');
                    }
                })
            }

        })
    }

    function initProjectsSlider() {
        if (document.documentElement.clientWidth < 1025) {
            $('.projects__slider').addClass('swiper-container');
            $('.projects__list').addClass('swiper-wrapper');
            $('.projects__item').addClass('swiper-slide');
            var mySwiper = new Swiper('.projects__slider', {
                slidesPerView: 2.8,
                loop: true,
                breakpoints: {
                    320: {
                        slidesPerView: 2.3,
                    },
                    600: {
                        slidesPerView: 2.8,
                    },
                }
            });
        }
    }

    
    function initStepsSlider() {
        if (document.documentElement.clientWidth < 1025) {
            $('.steps__slider').addClass('swiper-container');
            $('.steps__list').addClass('swiper-wrapper');
            $('.steps__item').addClass('swiper-slide');
            var mySwiper = new Swiper('.steps__slider', {
                slidesPerView: 2.6,
                pagination: {
                    el: '.swiper-pagination',
                    type: 'fraction',
                },
                breakpoints: {
                    320: {
                        slidesPerView: 1.5,
                    },
                    600: {
                        slidesPerView: 2.6,
                    },
                }
            });
        }
    }

    function initServicesSlider() {
        var mySwiper = new Swiper('.services__slider', {
            slidesPerView: 3,
            loop: true,
            centeredSlides: true,
            initialSlide: 2,
            navigation: {
                nextEl: '.slider-next',
                prevEl: '.slider-prev',
            },
            breakpoints: {
                320: {
                    slidesPerView: 1.4,
                    centeredSlides: false,
                    initialSlide: 0,
                    spaceBetween: 15,
                },
                700: {
                    centeredSlides: true,
                    initialSlide: 2,
                    spaceBetween: 0,
                    slidesPerView: 3,
                },
            }
        });
    }

    function initArticlesSlider() {
        var mySwiper = new Swiper('.articles__slider', {
            slidesPerView: 4,
            loop: true,
            navigation: {
                nextEl: '.slider-next',
                prevEl: '.slider-prev',
            },
            breakpoints: {
                320: {
                    slidesPerView: 1.5,
                },
                600: {
                    slidesPerView: 2.5,
                },
                1024: {
                    slidesPerView: 4,
                }
            }
        });
    }

    function initFullPageSlider() {
        var mySwiper = new Swiper('#fullpage', {
            direction: 'vertical',
            hashNavigation: {
                watchState: true,
            },
            speed: 1000,
            mousewheel: {
                invert: false,
            },
            // touchRatio: 0
        });
    }

    function initSelect() {
        $('select').niceSelect();
    }
    
    initMenu();
    initDynamicAdapt();
    initStepsSlider();
    // initAos();
    initFullPageSlider();
    initServicesSlider();
    initFooterPanel();
    initArticlesSlider();
    initSelect();
    initProjectsSlider();
})