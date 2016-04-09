(function ($) {
   var papyrusSlide = function (element, custom_settings) {
      var obj = this;
      var slider_interval = null;

      console.log(element.className);

      var settings = $.extend({
         slider_container: element.className,
         slider_class: '.' + element.className,
         slide_list: '.' + element.className + ' ul',
         slides: '.' + element.className + ' ul li',
         auto_scroll: true,
         controls: true,
         tracker: true,
         current_slide: 0,
         slide_width: 0,
         slide_height: 0,
         interval: 2000,
         slide_speed: 500,
         slide_speed_fast: 200
      }, custom_settings);

      obj.slide_count = $(settings.slides).length;
      obj.current_slide = 0;

      settings.slide_width = $(settings.slides).width();
      settings.slide_height = $(settings.slides).height();

      $(settings.slider_class).css({
         width: settings.slide_width,
         height: settings.slide_height
      });

      $(settings.slide_list).css({
         width: settings.slide_width * obj.slide_count,
         height: settings.slide_height
      });

      if (settings.controls) {
         $(settings.slider_class).after('<a class="control_prev">Prev</a> <a class="control_next">Next</a>');
      }

      if (settings.tracker) {
         $('.slider').after('<div class="slider-controls"><ul></ul></div>');

         console.log("test");

         for (var i = 0; i < obj.slide_count; i++) {
            $('.slider-controls ul').append(' <li class="slide-control" data-index="' + i + '"></li> ');
         }

         $('.slider-controls ul li').first().addClass('active');
      }

      $(settings.slides).each(function (i) {
         $(this).attr('data-index', i);
      });

      function setSlideInterval() {
         clearInterval(slider_interval);
         slider_interval = setInterval(function () {
            obj.nextSlide();
         }, settings.interval);
      }

      setSlideInterval();

      $('.slide-control').click(function () {
         if (obj.current_slide < $(this).attr('data-index')) {
            obj.nextSlide(parseInt($(this).attr('data-index')));
         } else if (obj.current_slide > $(this).attr('data-index')) {
            obj.prevSlide(parseInt($(this).attr('data-index')));
         }
      });

      $('a.control_prev').click(function () {
         obj.prevSlide();
         clearInterval(slider_interval);
         setSlideInterval();
      });

      $('a.control_next').click(function () {
         obj.nextSlide();
         clearInterval(slider_interval);
         setSlideInterval();
      });

      obj.changeControls = function (slide) {
         $('.slide-control').each(function () {
            if (parseInt($(this).attr('data-index')) === slide) {
               $(this).addClass('active');
            } else {
               $(this).removeClass('active');
            }
         });
      };

      obj.nextSlide = function (slide) {
         obj.current_slide = (obj.current_slide + 1 != obj.slide_count) ? parseInt($(settings.slides).first().attr('data-index')) + 1 : 0;

         obj.changeControls(obj.current_slide);
         $(settings.slide_list).animate({
            left: -settings.slide_width
         }, (slide) ? settings.slide_speed_fast : settings.slide_speed, function () {
            $(settings.slides).first().appendTo(settings.slide_list);
            $(settings.slide_list).css('left', 0);
            if (slide) {
               if (obj.current_slide < slide) {
                  clearInterval(slider_interval);
                  setSlideInterval();
                  obj.nextSlide(slide);
               }
            }
         });
      };

      obj.prevSlide = function (slide) {
         obj.current_slide = parseInt($(settings.slides).first().attr('data-index'));
         obj.current_slide = (obj.current_slide - 1 >= 0) ? parseInt($(settings.slides).first().attr('data-index')) - 1 : obj.slide_count - 1;

         console.log("slide" + slide);

         obj.changeControls(obj.current_slide);

         $(settings.slides).last().prependTo(settings.slide_list);
         $(settings.slide_list).css('left', '-100%');

         $(settings.slide_list).animate({
            left: 0
         }, (slide >= 0) ? settings.slide_speed_fast : settings.slide_speed, function () {
            if (slide >= 0) {
               if (obj.current_slide > parseInt(slide)) {
                  clearInterval(slider_interval);
                  setSlideInterval();
                  obj.prevSlide(slide);
               }
            }
         });
      };
   };

   $.fn.papyrusSlide = function (settings) {
      return this.each(function () {
         var element = $(this);

         if (element.data('papyrusSlide')) return;

         var papyrusslide = new papyrusSlide(this, settings);

         element.data('papyrusSlide', papyrusSlide);
      });
   }
})(jQuery);
