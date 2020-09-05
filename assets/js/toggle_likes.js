// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }


    toggleLike(){
        $(this.toggler).click(function(e){
            debugger;
            e.preventDefault();
            let self = this;

            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount);
                if (data.data.deleted == true){
                    likesCount -= 1;
                    
                }else{
                    likesCount += 1;
                }


                $(self).attr('data-likes', likesCount);
                if(likesCount==0)
                {
                    $(self).html(`${likesCount} <i style="color:white"class="far fa-heart"></i>`);
                }
                else{
                     $(self).html(`${likesCount} <i style="color:yellow"class="far fa-heart"></i>`);
                }

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }
}
