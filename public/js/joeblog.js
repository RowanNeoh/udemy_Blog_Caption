/*!
=========================================================
* JoeBlog Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// smooth scroll
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });
});

$('.btnCancelEdit').hide();
$('.btnSaveEdit').hide();
$('.btnEdit').on('click',function(){
   
        var container = $(this).closest('.media'); // Find the closest container element
        var messageElement = container.find(' .message');
        var text = messageElement.text();        
        messageElement.empty().append($('<textarea />', {
            'text': text,
            'name': 'editMsg',
            'class': 'editMsg'
        }));
        //$('.message').text('').append($('<input />',{'value' : t, 'name': 'editMsg', 'class':'editMsg'}));
        $('.editMsg').focus();
        $('.btnCancelEdit',container).show();
        $('.btnSaveEdit',container).show();
        $('.btnEdit',container).hide();
        $('.btnDelete',container).hide();
});
$('.btnCancelEdit').on('click',function(){
    var container = $(this).closest('.media'); // Find the closest container element    
    $('.btnCancelEdit',container).hide();
    $('.btnSaveEdit',container).hide();
    $('.btnEdit',container).show();
    $('.btnDelete',container).show();
    const newText = $('.message').find('.editMsg').val();
    $('.message').find('.editMsg').replaceWith($('<p>',{text:newText}));
});
