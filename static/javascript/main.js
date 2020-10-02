$(document).ready(function(e){
	const pages = {projects: 'Projects', students: 'Students'};
	let title = $('title').text().split(" ");
	if (title[title.length-1] === pages.projects){
		$('a.Projects').addClass('active');
	}
	else if (title[title.length-1] === pages.students){
		$('a.Students').addClass('active');
	}
})

const inputs = document.querySelectorAll(".input");

function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}

inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});

$(".hamburger").click(function(){
	$(".wrapper").toggleClass("active")
})
$(document).on('click', '.details', function(e) {
		$(this).parents('.card').toggleClass("active")
});
$(document).ready(function(){
	$(document).on("click", ".btn-delete", function(){
		let project_name = $(this).find('span').attr('name');
		let project_id = $(this).closest('div.card').attr('id');
		$(".popup-del").find(".remove").val(project_name);
		$(".popup-del").find(".remove").attr('name', project_id);
		$(".popup-del").toggleClass("active");
	});
	$(document).on("click", ".cancel", function(){
		$(".popup-del").toggleClass("active")
	});
})
function del_popup(){
	$(".popup-del").toggleClass("active")
}
function popup(){
	$(".popup").toggleClass("active");
	// resetting everything when closed
	let title = $('title').text().split(" ");
	if (title[title.length-1] === 'Students'){
		$('form#registration').attr('class', 'registration');
		$('h2.title').text('Register a new student');
		$('form#registration').find('button').text('Register');
		$('input[name=student_id]').remove();
		$('form#registration').find('input[name=purpose]').val('create')
		$('form#registration').find('p.edit-image').css('display', 'none')
	}
  $('form#registration')[0].reset();
	$('option:selected').removeAttr('selected');
  $(".label p").html('&nbsp; Choose your photo');
  $(".input").each((index, input) => {
    let parent = $(input).parent().parent();
    if($(input).val() == ""){
      parent.removeClass("focus");
    }
  });
}
