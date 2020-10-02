// function that sets the dates format
function date(inputdate){
  let brokendate = inputdate.split('-');
  const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
  return (months[parseInt(brokendate[1])-1] + ' ' + parseInt(brokendate[2]) + ', ' + brokendate[0]);
};

// creation of a new project
$('#new_project').submit(function(e){
  var formData = new FormData(this);
  var files = $('#image')[0].files[0];
  formData.append('file',files);
  e.preventDefault()
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
      $('#new_project')[0].reset();
      $(".popup").toggleClass("active")
      $(".label p").html('&nbsp; Choose your photo')
      $("#no-item").remove()
      document.querySelectorAll(".input").forEach(input => {
        	let parent = input.parentNode.parentNode;
        	if(input.value == ""){
        		parent.classList.remove("focus");
        	}
      })
      $(".item_wrap").prepend('<div class="card" id="card'+ response.id +'">'+
        '<div class="delete">'+
          '<div class="btn-delete">'+
            '<span name="'+ response.name +'"><i class="fas fa-trash"></i></span>'+
          '</div>'+
        '</div>'+
        '<div class="imgbox">'+
          '<div class="img" style="background-image: url(' + response.image + ');"></div>'+
        '</div>'+
        '<div class="content">'+
          '<div class="group-content">'+
            '<h2>' + response.name + '</h2>'+
            '<p>' + response.detail + '</p>'+
          '</div>'+
          '<div class="group-btn">'+
            '<div class="middle">'+
              '<button class="btn btn1 details">Details</button>'+
              '<button class="btn btn1 list" value="'+ response.id +'">See List</button>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '</div>'
        )
    },
    error : function(xhr,errmsg,err){
      console.log(xhr.status + ": " + xhr.responseText);
    }
  })
})

// deletion of an existing projects
$(document).on('submit', '#delete', function(e){
  e.preventDefault()
  let deleted_project = $(this).find('.remove').attr('name')
  $.ajax({
    headers: {"X-CSRFToken": $.cookie("csrftoken")},
    type: 'GET',
    url: window.location.pathname,
    data: {
      form_name: 'delete-card',
      project_name: $(this).find('.remove').val(),
      csrfmiddlewaretoken: $(this).find('input[name=csrfmiddlewaretoken]').val(),
      action: 'get'
    },
    success: function(response){
      $('#delete')[0].reset();
      $('#delete').find('.remove').val("")
      $(".popup-del").toggleClass("active")
      $(document).find(`div#${deleted_project}`).remove()
      console.log(deleted_project)
      let card = $("div.card").length
      if (card === 0){
        $(".item_wrap").prepend('<div class="nocard" id="no-item">'+
            '<div class="nocard-cntn">'+
              '<div class="add-sign"><i class="fas fa-layer-group"></i></div>'+
              '<div class="add-cntn">'+
                '<h3>New project</h3>'+
                '<p>Create a new project for your students</p>'+
                '<button type="button" class="add-btn" onclick="popup()">ADD</button>'+
              '</div></div></div>'
        )
      }
    },
    error : function(xhr,errmsg,err){
      console.log(xhr.status + ": " + xhr.responseText);
    }
  })
})

// getting the list of students related to a projects
$(document).on('click', 'button.list', function(e){

  let project_node = $(this)

  e.preventDefault();
  $.ajax({
    headers: {"X-CSRFToken": $.cookie("csrftoken")},
    type: 'GET',
    url: window.location.pathname,
    data: {
      form_name: 'show-list',
      the_project: $(this).val(),
      csrfmiddlewaretoken: $(this).parent().find('input[name=csrfmiddlewaretoken]').val(),
    },
    success: function(response){
      $('.popup-list').toggleClass('active');
      let project_name = project_node.closest('div.card').find('.group-content h2').text();
      let project_image = project_node.closest('div.card').find('.img').css("background-image");
      let image_url = project_image.split(/"/)[1];
      $('.popup-list').find('div.list-project-title h1').text(project_name);
      $('.popup-list').find('.project-image').css("background-image", "url("+ image_url +")")
      $('.popup-list').find('.list-student').remove()

      for (student of response) {
        $('.popup-list').find('.list-item').append('<div class="list-student">' +
            '<div class="student-details">' +
              '<div class="student-img" style="background-image: url('+ student.image +');"></div>' +
              '<div class="student-name"><p>'+ student.name +'</p></div>' +
            '</div>' +
            '<div class="student-deadline">' +
              '<div class="the-deadline"><p>'+ date(student.deadline) +'</p></div>' +
            '</div>' +
          '</div>'
        )
      }

    },
    error : function(xhr,errmsg,err){
      console.log(xhr.status + ": " + xhr.responseText);
    }
  })
})
