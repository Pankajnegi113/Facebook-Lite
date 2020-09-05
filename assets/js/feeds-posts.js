{
    let createPost = function(){
        let newPostForm = $('#new-post-form');  
        newPostForm.submit(function(e){
            e.preventDefault();
            var form = $('#new-post-form')[0];
            console.log("ASdasda");
            var data = new FormData(form);
            $.ajax({
                type:'post',
                enctype: 'multipart/form-data',
                url:'/posts/create',
                data:data,
                processData: false, //prevent jQuery from automatically transforming the data into a query string
                contentType: false,
                success:function(data){
                    debugger;
                    let newPost=newPostDom(data.data.post,data.data.user);
                    $('#post-list-containers').prepend(newPost);
                    deletePost($('#delete-post'));
                    $('#post-textarea').val("");
                    new ToggleLike($(' .toggle-like-button', newPost));
                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();

                },error:function(err){
                    console.log(error.responseText);
                }
            })
        })

    }

    let newPostDom= function(post,user){debugger
        return $(`<li id="post_${post._id}">  
        <div class="post-content">

        


           <img src="${post.postImg}" height="100">
            <br>
        
            ${post.content}
            <small>
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                        0 <i class="far fa-heart"></i>
                </a>
            </small>
            <small>
                <a  id="delete-post" href="/posts/destroy/${post._id}"><i class="fas fa-trash"></i></a>
            </small>
        </div>
        <div class="post-comments">
                <form id="post-com" action="/comments/create" method="POST">
                    <input type="text" class="form-control comment-text" style=" display: inline;width:69%;" name="content" placeholder="Add comment here...">
                    <input type="hidden" name="post" value=${post._id}>
                    <input type="submit" class="btn btn-info comment-submit" value="Add Comment" style="width: 29%;"> 
                </form>
            <div class="post-comments-list">
                <ul id="post-comment-${post.id}">
                     <!--comment to be added by another ajax call-->
                </ul>
            </div>
        </div>
        <footer  class="blockquote-footer">by ${user.firstname} ${user.lastname}</footer>
    </li>`)
    }


    let deletePost = function(deleteLink){
        $(deleteLink).on('click',function(e){
            e.preventDefault();
            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success:function(data){
                    $(`#post_${data.data.postId}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();

                },error:function(err){
                    console.log(err.responseText);
                }
            })
        })

    }

    

    let convertPostsToAjax = function(){
        debugger;
        $('#post-list-containers').each(function(){
            let self = $(this);
            let deleteButton = $('#delete-post');
            deletePost(deleteButton);
            //get posts ids by spliting id attribute
            let postId=self.prop('id').split("_")[1]
        })
    }

    createPost();
    convertPostsToAjax();


}
