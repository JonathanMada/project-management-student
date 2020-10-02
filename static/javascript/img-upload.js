$('.label').click(function(){
    $(this).parent().find('.input-img').click();
});
$(document).ready(function(){
  $(".input-img").change(function(){
      $(this).parent().find('.label p').html('&nbsp; Image uploaded');
      let title = $('title').text().split(" ");
    	if (title[title.length-1] === 'Students'){
        $('form#registration').find('p.edit-image').css('display', 'none')
    	}
  });
});
