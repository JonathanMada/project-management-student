// this verifies if there are items on the page or not
$(document).ready(function (){
  let student = $("div.student_item").length;
  if (student === 0){
    $(".no-student").css('display', 'flex')
  } else {
    $(".no-student").css('display', 'none')
  }
})

// function that sets the dates format
function date(inputdate){
  let brokendate = inputdate.split('-');
  const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
  return (months[parseInt(brokendate[1])-1] + ' ' + parseInt(brokendate[2]) + ', ' + brokendate[0]);
};

// function that reverse the date format
function reverse_date(inputdate){
  let brokendate = inputdate.replace(",", "").split(' ');
  const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
  let month = months.indexOf(brokendate[0])+1
  let datemonth = (month < 10) ? '0'+String(month) : String(month);
  return (brokendate[2] + '-' + datemonth + '-' + brokendate[1]);
};

// This handles the creation of new student
$(document).on('submit', 'form.registration', function(e){
  var formData = new FormData(this);
  var files = $('#image')[0].files[0];
  formData.append('file',files);
  e.preventDefault();
  $.ajax({
     headers: { "X-CSRFToken": $.cookie("csrftoken"), "X-Requested-With": "XMLHttpRequest" },
     beforeSend: function(xhr) {
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
     },
     type: 'POST',
     url: window.location.pathname,
     data: formData,
     cache: false,
     contentType: false,
     processData: false,
     success: function(response){
       $('#registration')[0].reset();
       $(".popup").toggleClass("active");
       $(".label p").html('&nbsp; Choose your photo');
       $(".no-student").css('display', 'none');
       $(".input").each((index, input) => {
         let parent = $(input).parent().parent();
         if($(input).val() == ""){
           parent.removeClass("focus");
         }
       });
       $('.student-list').append('<div class="student_item" id="SD' + response.id + '">'+

           '<div class="inside_selection">'+
             '<input type="checkbox" class="checkbox" name="" value="' + response.id + '">' +
             '<div class="profile_img" style="background-image: url(' + response.image + ')"></div>' +
           '</div>' +
           '<div class="inside_id">' +
             '<p>SD' + response.id + '</p>' +
           '</div>' +
           '<div class="inside_name">' +
             '<p>' + response.name + '</p>' +
           '</div>' +
           '<div class="inside_project">' +
           '  <p>' + response.project + '</p>' +
           '</div>' +
           '<div class="inside_deadline">' +
             '<p>' + date(response.deadline) + '</p>' +
           '</div>' +
           '<div class="inside_action">' +
             '<button type="button" name="edit_item" value="' + response.id + '" class="edit-item">' +
               '<div>' +
                 '<i class="fas fa-pen"></i>' +
                 '<span>Edit</span>' +
               '</div>' +
               '<div class="line"></div>' +
             '</button>' +
             '<button type="button" name="remove_item" value="' + response.id + '" class="remove-item">' +
               '<div>' +
                 '<i class="fas fa-trash"></i>' +
                 '<span>Remove</span>' +
               '</div>' +
               '<div class="line"></div>' +
             '</button>' +
           '</div>' +
         '</div>'
       )
     },
     error : function(xhr,errmsg,err){
       console.log(xhr.status + ": " + xhr.responseText);
     }
  })
})

// This handle the ajax query for each remove button
$(document).on('click', 'button.remove-item', function(e){
  e.preventDefault();
  let item = $(this).closest('div.student_item');
  $.ajax({
    headers: {"X-CSRFToken": $.cookie("csrftoken")},
    type: 'GET',
    url: window.location.pathname,
    data: {
      button_name: 'remove-item',
      student_id: $(this).val(),
      csrfmiddlewaretoken: $(this).parent().find('input[name=csrfmiddlewaretoken]').val(),
      action: 'get'
    },
    success: function(response){
      item.remove();
      let student = $("div.student_item").length;
      if (student === 0){
        $(".no-student").css('display', 'flex')
      }
    },
    error : function(xhr,errmsg,err){
      console.log(xhr.status + ": " + xhr.responseText);
    }
  })
})

// This hande the popup of the bulk deletion of item
$(document).on('click', 'button.multidelete', function(){
  let checked = $("input:checked").length;
  $("div.del-title h3 strong").text(checked);
  $(".popup-del").toggleClass("active");
})

// This is the ajax request that takes the value from the checkboxes
$(document).on('click', '.yes-delete', function(){
  let checkedboxes = $('input:checked')
  let checkedlist = [];
  checkedboxes.each((index, checkedbox) => checkedlist.push($(checkedbox).val()));
  console.log(checkedlist)
  $.ajax({
    headers: {"X-CSRFToken": $.cookie("csrftoken")},
    type: 'GET',
    url: window.location.pathname,
    data: {
      button_name: 'multi-delete',
      students: checkedlist.toString(),
      csrfmiddlewaretoken: $('form#student_list').find('input[name=csrfmiddlewaretoken]').val(),
      action: 'get'
    },
    success: function(response){
      checkedlist.forEach(student => $(`div#SD${student}`).remove())
      $(".popup-del").toggleClass("active");
      $('.container .check-delete').removeClass('active');
      $(".multiselect").text('Select all');
      let student = $("div.student_item").length;
        if (student === 0){
          $(".no-student").css('display', 'flex')
        }
    }
  })
})

// This modifies the existing values of an existing object

  // Function that inject the existing values to the input values
  function editing(id, name, project, deadline){
    $('h2.title').text(`Editing ${name}`)
    $('form#registration').attr('class', 'modification')
    $('form#registration').prepend(`<input type="hidden" name="student_id" value="${id}">`)
    $('form#registration').find('input[name=purpose]').val('edit')
    $('form#registration').find('p.edit-image').css('display', 'block')
    $('form#registration .input').each(function(index, input){
      let parent = $(input).parent().parent();
      parent.addClass("focus")
    })
    $('form#registration').find('input[name=student_name]').val(name)
    $(`option:contains(${project})`).attr('selected', 'selected')
    $('form#registration').find('button').text('Modify')
    $('form#registration').find('#id_student_deadline').val(reverse_date(deadline))
  }

  // Function that takes the existing values of an object
  $(document).on('click', 'button.edit-item', function(){
    $('.popup').toggleClass('active')
    let id = $(this).val()
    let name = $(this).parent().parent().find('.inside_name p').text()
    let project = ($(this).parent().parent().find('.inside_project').text()).replace(/\s+/g, ' ').trim()
    let deadline = $(this).parent().parent().find('.inside_deadline p').text()
    editing(id, name, project, deadline)
  })

  // The ajax call that tells Django to update the values of a particular object
  $(document).on('submit', 'form.modification', function(e){
    e.preventDefault();
    let formData = new FormData(this);
    let files = $('#image')[0].files[0];
    formData.append('file',files);
    $.ajax({
      headers: { "X-CSRFToken": $.cookie("csrftoken") },
      type: 'POST',
      url: window.location.pathname,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(response){
        let student_item = $(`div#SD${response.id}`);
        console.log(student_item)
        console.log(`div#SD${response.id}`)
        // here we change the front-end info
        student_item.find('.inside_selection .profile_img').css("background-image", `url('${response.image}')`)
        student_item.find('.inside_name p').text(response.name)
        student_item.find('.inside_project p').text(response.project)
        student_item.find('.inside_deadline p').text(date(response.deadline))
        popup()
      },
      error : function(xhr,errmsg,err){
        console.log(xhr.status + ": " + xhr.responseText);
      }
    })
  })
