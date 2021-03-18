document.addEventListener('DOMContentLoaded', function() {


    function initMenu() {
        const menuBtn = document.querySelector('.header__menu-btn');
        const menuClose = document.querySelector('.menu__close');
        const menu = document.querySelector('.menu');
        const header = document.querySelector('.header');
        const html = document.querySelector('html');

        menu.querySelectorAll('.menu__navigation a').forEach(link => {
            link.addEventListener('click', function() {
                menu.classList.remove('active');
            })
        })
        
        menuBtn.addEventListener('click', function() {
            menu.classList.add('active');
        })
        menuClose.addEventListener('click', function() {
            menuClose.classList.remove('active');
            menu.classList.remove('active');
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
            if (document.querySelector('.projects-page')) {
                var mySwiper = new Swiper('.projects-page__slider', {
                    watchSlidesVisibility: true,
                    slidesPerView: 2.8,
                    breakpoints: {
                        320: {
                            slidesPerView: 2,
                        },
                        601: {
                            slidesPerView: 2.8,
                        },
                    }
                });
            }
            else {
                var mySwiper = new Swiper('.projects__slider', {
                    watchSlidesVisibility: true,
                    slidesPerView: 2.8,
                    breakpoints: {
                        320: {
                            slidesPerView: 2.3,
                        },
                        601: {
                            slidesPerView: 2.8,
                        },
                    }
                });
            }
        }
    }
    
    function initStepsSlider() {
        if (document.documentElement.clientWidth < 1025) {
            $('.steps__slider').addClass('swiper-container');
            $('.steps__list').addClass('swiper-wrapper');
            $('.steps__item').addClass('swiper-slide');
            var mySwiper = new Swiper('.steps__slider', {
                watchSlidesVisibility: true,
                slidesPerView: 2.6,
                pagination: {
                    el: '.swiper-pagination',
                    type: 'fraction',
                },
                spaceBetween: 15,
                breakpoints: {
                    320: {
                        slidesPerView: 1.5,
                    },
                    601: {
                        slidesPerView: 2.6,
                    },
                }
            });
        }
    }

    function initProjectSlider() {
        if (document.documentElement.clientWidth < 601) {
            $('.project__slider').addClass('swiper-container');
            $('.project__images').addClass('swiper-wrapper');
            $('.project__images li').addClass('swiper-slide');
            var mySwiper = new Swiper('.project__slider', {
                watchSlidesVisibility: true,
                slidesPerView: 2,
                navigation: {
                    nextEl: '.slider-next',
                    prevEl: '.slider-prev',
                },
                spaceBetween: 20
            });
        }
    }

    function initServicesSlider() {
        var mySwiper = new Swiper('.services__slider', {
            watchSlidesVisibility: true,
            slidesPerView: 1,
            centeredSlides: true,
            initialSlide: 0,
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
                701: {
                    centeredSlides: true,
                    initialSlide: 1,
                    spaceBetween: 0,
                    slidesPerView: 3,
                },
            }
        });
    }

    function initArticlesSlider() {
        if (document.querySelector('.blog__slider')) {
            if (document.documentElement.clientWidth > 600) {
                var mySwiper = new Swiper('.blog__slider', {
                    watchSlidesVisibility: true,
                    slidesPerView: 4,
                    spaceBetween: 24,
                    navigation: {
                        nextEl: '.slider-next',
                        prevEl: '.slider-prev',
                    },
                    breakpoints: {
                        320: {
                            slidesPerView: 1.5,
                        },
                        601: {
                            slidesPerView: 2.5,
                        },
                        1025: {
                            slidesPerView: 4,
                        }
                    }
                });
            } else {
                $('.blog__slider').removeClass('swiper-container');
                $('.blog__list').removeClass('swiper-wrapper');
                $('.articles__item').removeClass('swiper-slide');
            }
        } else {
            var mySwiper = new Swiper('.articles__slider', {
                watchSlidesVisibility: true,
                slidesPerView: 4,
                spaceBetween: 24,
                navigation: {
                    nextEl: '.slider-next',
                    prevEl: '.slider-prev',
                },
                breakpoints: {
                    320: {
                        slidesPerView: 1.5,
                        spaceBetween: 15,
                    },
                    601: {
                        slidesPerView: 2.5,
                        spaceBetween: 24 ,
                    },
                    1025: {
                        slidesPerView: 4,
                    }
                }
            });
        }
        
    }

    function initFullPageSlider() {
        
        if (document.documentElement.clientWidth < 1025 && document.documentElement.clientWidth > 600) {
            $('#fullpage').removeClass('swiper-container');
            $('.fullpage-wrapper').removeClass('swiper-wrapper');
        } else {
            var swiper = new Swiper('#fullpage', {
                direction: 'vertical',
                hashNavigation: {
                    watchState: true,
                },
                speed: 1000,
                mousewheel: {
                    invert: false,
                    releaseOnEdges: true,
                },
                touchReleaseOnEdges: true,
                touchStartForcePreventDefault: true,
            });
        }
        document.body.addEventListener("touchstart", function() {
            
        });
    }

    function initSelect() {
        $('select').niceSelect();
    }

    function initScrollbar() {
        $(".article__content").mCustomScrollbar();
        $(".about__text").mCustomScrollbar();
    }

    function initCursor() {
        var cursor = document.querySelector(".cursor");
        document.addEventListener("mousemove", function(e){
            cursor.style.cssText = "left: " + e.clientX + "px; top: " + e.clientY + "px;";
        });
        $('.btn, a, button, .arrow-prev, .arrow-next, .form__radio-item').on('mouseenter', function(e) {
            $(cursor).addClass('hovered');
        })
        $('.btn, a, button, .arrow-prev, .arrow-next, .form__radio-item').on('mouseleave', function(e) {
            $(cursor).removeClass('hovered');
        })
        $('.btn, a, button, .arrow-prev, .arrow-next, .form__radio-item').on('click', function(e) {
            $(cursor).addClass('active');
            setTimeout(() => {
            $(cursor).removeClass('active');
            }, 100);
        })
    }

    function initBtnsClick() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function() {
                btn.classList.add('clicked');
            })
        })
    }

    
    initMenu();
    initDynamicAdapt();
    initStepsSlider();
    initFullPageSlider();
    initServicesSlider();
    initFooterPanel();
    initArticlesSlider();
    initSelect();
    initProjectsSlider();
    initProjectSlider();
    initScrollbar();
    initCursor();
    initBtnsClick();
})