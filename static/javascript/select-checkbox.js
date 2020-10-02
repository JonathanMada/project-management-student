
// This event handler function focuses on the checkbox
$(document).on('change', '.inside_selection input[type=checkbox]', function(){
  let checked = $('input:checked').length;
  let checkbox = $('input.checkbox').length;
  if (1 < checked) {
    $('.container .check-delete').addClass('active')
  } else {
    $('.container .check-delete').removeClass('active')
  }
  if (checkbox !== checked && 1 < checked){
    $(".multiselect").text('Select all')
  } else if (checkbox === checked){
    $(".multiselect").text('Unselect all')
  }
})


// This event handler function focuses on the select all button
$(".multiselect").on('click', function(){
  if ($('input:checked').length !== $('input.checkbox').length) {
    $('.checkbox').each(function(){
        $('.checkbox').prop('checked', true);
    })
    $('.container .check-delete').addClass('active')
    $(".multiselect").text('Unselect all')
  } else {
    $('.checkbox').each(function(){
        $('.checkbox').prop('checked', false);
    })
    $('.container .check-delete').removeClass('active')
    $(".multiselect").text('Select all')
  }
});
