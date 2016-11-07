'use strict';

	
	$("#Happy").on('click', function(){
		alert('Now You Are A little bit Happier')
	})
	

 const clear = function() {
        $('#todo-list').html('');
    };

    const append = function(data) {
        data.items.forEach(function(items){
            let table = $( "<tr> " + 
                "<th class = TODOname>"+ items.message + " </th> " + 
                "<th class = checkbox> <input class = completed type=checkbox id= "+ items.id+ "> </th> "+
                "<th class = DeleteBtn id="+items.id+" onclick=deleteToDo(this.id)> Delete </th> "+
                "</tr>");
            let checkBTN = table.find('input');
            checkBTN.prop('checked',items.checked);
            checkBTN.on('change',function(event){
                let sndChk = !items.checked;
                let chkID = event.target.id;
                updateTodo(sndChk,chkID);
            });

            $('#todo-list').append(table);
        });
    };

    const drawList = function(){
        clear();
        $.ajax({
            url: "/todo",
            type: "get",
            dataType: "json",
            success: function(data){
                append(data);
            },
            error: function(){
                alert("Try again, Dear");
            }
        })
    };

    const addToDo = function() {
        let newToDoName = $('#add-name').val();
        if(newToDoName === "") {
            alert('Add data, Honey');
            return;
        }
        $.ajax({
            url: "/todo",
            type: "post",
            dataType: "json",
            data: JSON.stringify({
                message: newToDoName,
                checked: false
            }),
            success: function(data){
                drawList();
                newToDoName = ' ';
            },
            error: function(){
                alert("Please try anoyher way, Darling");
            }
        })
    };

    const updateTodo=function(send, ID)
    {
      $.ajax({
          url         : "/todo",
          type        : 'put',
          dataType    : 'json',
          data        : JSON.stringify({
            checked: send,
            id: ID
        }),
          contentType : "application/json; charset=utf-8",
          success     : function(data) {
            drawList();
        },
        error       : function(data) {
          alert('Something went wrong, Sweety');
      }
  });
  }

  const searchTodo = function() {
    const searchTextBox = $('#stb').val();
    $.ajax({
        url      : "/todo",
        type     : 'get',
        dataType : 'json',
        data     : {
            searchtext : searchTextBox
        },
        contentType: "application/x-www-form-urlencoded;utf-8",
        success  : function(data) {
            clear();
            append(data);
        },

        error    : function(e) {
            alert('Can t search, Honey');
        }
    });
}

const deleteToDo =function(itemID)
{
    $.ajax({
        url     : "/todo/" + itemID,
        type    : 'delete',
        success : function(data) {
          drawList();
      },
      error   : function(data) {
        alert('Can t delete, Dear');
    }
});
};



const main = function() {
    clear();
    drawList();
}
$('#add').on('click', function() {
    addToDo();
    $('#add-name').val('');
})

$('#searchBTN').on('click', function() {
    searchTodo();
   
})

$('#stb').keypress(function(e){
    if(e.keyCode===13)
        $("#searchBTN").click();
})

$('#add-name').keypress(function(e){
    if(e.keyCode===13)
        $("#add").click();
})
main();