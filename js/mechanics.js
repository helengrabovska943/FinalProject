
// Boostrap ScrollSpy automatically updates nav targets based on scroll position
	$('#nav').scrollspy();

// Initialize jQuery UI tooltip
	$('ul#nav').tooltip({
	    position: {
	        my: "left+1 bottom-0",
	        at: "left top"
	    },
	    show: false,
	    hide: false
	});

// Add / remove class on skill boxes on hover in/out
		$('.box-skill').hover(function() {
			$(this).addClass('hoverClass');
			$(this).children().find('p').stop();
		}, function () {
			$(this).removeClass('hoverClass');
			$(this).children().find('p').stop();
		});

// Contact Form Actions

var isEmail_re       = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
function isEmail (s) {
   return String(s).search (isEmail_re) != -1;
}

$(document).ready(function(){

	$('form#contactForm button.submit').click(function() {
		var contactName = $('form#contactForm input#contactName').val();
		var contactEmail = $('form#contactForm input#contactEmail').val();
		var contactMessage = $('form#contactForm #contactMessage').val();
		var contactCaptcha = $('form#contactForm input#contactCaptcha').val();
		var contactCaptchaAnswer = $('form#contactForm input#contactCaptchaAnswer').val();

		var dataString = 'contactName=' + contactName + '&contactEmail=' + contactEmail + '&contactMessage=' + contactMessage;
		
		var contactError = '';
		
		// Check name
		if( contactName == '' ) {
			contactError += 'Please enter your name<br />';
		}
		
		// Check e-mail
		if ( contactEmail == '') {
			contactError += 'Please enter your e-mail<br />';
		} else if ( isEmail(contactEmail) !== true ) {
			contactError += 'Please enter a valid e-mail address<br />';
		}

		if( contactMessage == '' ) {
			contactError += 'Please enter your message<br />';
		}
		
		if ( contactCaptcha !== contactCaptchaAnswer ) {
			contactError += 'Please enter the correct validation value <br />';
		}
		
		if ( contactError == '' ) {
			$.submit({
				success: function() {
					$('#contact-success').fadeIn();
					$('form#contactForm').fadeOut();
					$('#contact-warning').hide();
				}
			});
		} else {
			$('#contact-warning').html(contactError);
			$('#contact-warning').fadeIn();
		}

		return false;
	});
});