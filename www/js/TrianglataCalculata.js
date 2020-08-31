$(document).ready(function(){
	$("#TriangleSubmit").click(function(){
		$.post("TrianglataCalculata/calculate",	
		{
			height: $("#Height").val(),
			base: $("#Base").val()
		},
		function(data, status){
			$(".answer").css("visibility", "visible");
			$("#AnswerField").text(data);
		});
	});
});
