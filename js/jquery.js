(function ($) {
  'use strict';

  var modalQueued = false;

  $(document).on('click', 'a[data-reveal-id]', function ( event ) {

    event.preventDefault();

    var modalLocation = $( this ).attr( 'data-reveal-id' );

    $( '#' + modalLocation ).reveal( $( this ).data() );

  });

  $.fn.reveal = function ( options ) {
 
    var $doc = $( document ),
    
        defaults = {
      
          animation: 'fadeAndPop',
 
          animationSpeed: 200,
      
          closeOnBackgroundClick: true,
   
          dismissModalClass: 'close-reveal-modal',
          
          open: $.noop,
		  
          opened: $.noop,
       
          close: $.noop,
     
          closed: $.noop
        }
    ;

    options = $.extend( {}, defaults, options );

    return this.not('.reveal-modal.open').each( function () {
   
      var modal = $( this ),
   
        topMeasure = parseInt( modal.css( 'top' ), 10 ),
   
        topOffset = modal.height() + topMeasure,
   
        locked = false,
   
        modalBg = $( '.reveal-modal-bg' ),
   
        cssOpts = {
      
          open : {
         
            'top': 0,
     
            'opacity': 0,
       
            'visibility': 'visible',
       
            'display': 'block'
          },

          close : {
    
            'top': topMeasure,
      
            'opacity': 1,
     
            'visibility': 'hidden',

            'display': 'none'
          }

        },

        $closeButton
      ;

      if ( modalBg.length === 0 ) {
 
        modalBg = $( '<div />', { 'class' : 'reveal-modal-bg' } )
 
        .insertAfter( modal );
 
        modalBg.fadeTo( 'fast', 0.8 );
      }

      function unlockModal() {
        locked = false;
      }

      function lockModal() {
        locked = true;
      }

      function closeOpenModals() {

        var $openModals = $( ".reveal-modal.open" );
        if ( $openModals.length === 1 ) {
          modalQueued = true;
          $openModals.trigger( "reveal:close" );
        }

      }
  
      function openAnimation() {
        if ( !locked ) {
          lockModal();
          closeOpenModals();
          modal.addClass( "open" );
		  
          if ( options.animation === "fadeAndPop" ) {
           
            cssOpts.open.top = $doc.scrollTop() - topOffset;
        
            cssOpts.open.opacity = 0;
         
            modal.css( cssOpts.open );
        
            modalBg.fadeIn( options.animationSpeed / 2 );
 
            modal.delay( options.animationSpeed / 2 )
            .animate( {
              "top": $doc.scrollTop() + topMeasure + 'px',
              "opacity": 1

            },

            options.animationSpeed,

            function () {

              modal.trigger( 'reveal:opened' );

            });

          }

          if ( options.animation === "fade" ) {
            cssOpts.open.top = $doc.scrollTop() + topMeasure;

            cssOpts.open.opacity = 0;
            modal.css( cssOpts.open );
            modalBg.fadeIn( options.animationSpeed / 2 );
            modal.delay( options.animationSpeed / 2 )

            .animate( {

              "opacity": 1
            },

            options.animationSpeed,

            function () {

              modal.trigger( 'reveal:opened' );

            });

          }

          if ( options.animation === "none" ) {

            cssOpts.open.top = $doc.scrollTop() + topMeasure;

            cssOpts.open.opacity = 1;
            modal.css( cssOpts.open );
            modalBg.css( { "display": "block" } );

            modal.trigger( 'reveal:opened' );

          }

        }

      }


      function openVideos() {
        var video = modal.find('.flex-video'),
            iframe = video.find('iframe');
        if (iframe.length > 0) {
          iframe.attr("src", iframe.data("src"));
          video.fadeIn(100);
        }
      }

      modal.bind( 'reveal:open.reveal', openAnimation );
      modal.bind( 'reveal:open.reveal', openVideos);

      function closeAnimation() {

        if ( !locked ) {
          lockModal();
          modal.removeClass( "open" );

          if ( options.animation === "fadeAndPop" ) {
            modal.animate( {

              "top":  $doc.scrollTop() - topOffset + 'px',

              "opacity": 0

            },

            options.animationSpeed / 2,

            function () {

              modal.css( cssOpts.close );

            });

            if ( !modalQueued ) {

              modalBg.delay( options.animationSpeed )

              .fadeOut(
              options.animationSpeed,

              function () {
                modal.trigger( 'reveal:closed' );

              });

            } else {
              modal.trigger( 'reveal:closed' );

            }

          }

          if ( options.animation === "fade" ) {

            modal.animate( { "opacity" : 0 },

              options.animationSpeed,
  
              function () {
              modal.css( cssOpts.close );

            }); 

            if ( !modalQueued ) {

              modalBg.delay( options.animationSpeed )

              .fadeOut(
              options.animationSpeed,

                function () {
                  modal.trigger( 'reveal:closed' );

              });

            } else {
              modal.trigger( 'reveal:closed' );

            }

          }

          if ( options.animation === "none" ) {

            modal.css( cssOpts.close );
            if ( !modalQueued ) {
              modalBg.css( { 'display': 'none' } );
            }
            
            modal.trigger( 'reveal:closed' );

          } 
          modalQueued = false;
        } 

      } 

      function destroy() {
        modal.unbind( '.reveal' );
        modalBg.unbind( '.reveal' );
        $closeButton.unbind( '.reveal' );
        $( 'body' ).unbind( '.reveal' );
      }

      function closeVideos() {
        var video = modal.find('.flex-video'),
            iframe = video.find('iframe');
        if (iframe.length > 0) {
          iframe.data("src", iframe.attr("src"));
          iframe.attr("src", "");
          video.fadeOut(100);  
        }
      }

      modal.bind( 'reveal:close.reveal', closeAnimation );
      modal.bind( 'reveal:closed.reveal', closeVideos );
      modal.bind( 'reveal:opened.reveal reveal:closed.reveal', unlockModal );
      modal.bind( 'reveal:closed.reveal', destroy );
      modal.bind( 'reveal:open.reveal', options.open );
      modal.bind( 'reveal:opened.reveal', options.opened );
      modal.bind( 'reveal:close.reveal', options.close );
      modal.bind( 'reveal:closed.reveal', options.closed );
      modal.trigger( 'reveal:open' );
	  
     $closeButton = $( '.' + options.dismissModalClass )
     .bind( 'click.reveal', function () {
        modal.trigger( 'reveal:close' );

      });
	  
     if ( options.closeOnBackgroundClick ) {

      modalBg.css( { "cursor": "pointer" } );
      modalBg.bind( 'click.reveal', function () {
        modal.trigger( 'reveal:close' );

      });
     }

     $( 'body' ).bind( 'keyup.reveal', function ( event ) {

       if ( event.which === 27 ) { // 27 is the keycode for the Escape key
 
         modal.trigger( 'reveal:close' );
       }
      });
    });
  };
} ( jQuery ) );
