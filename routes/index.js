module.exports = function(app,Message,Comment){
  var errors_array = []
  app.get('/', function(req,res){
    Message.find({})
    .populate('comments')
    .exec(function(err, messages){
      res.render('index',{messages: messages})
    })
  })

  app.post('/', function(req,res){
    message = new Message({name: req.body.name, message: req.body.message})
    message.save(function(err){
      errors_array = []
      if(err){
        for (var x in err.errors){
          errors_array.push(err.errors[x].message)
        }
      }
      res.redirect('/')
    })
  })
  app.post('/comments', function(req,res){
    Message.findOne({_id: req.body.message_id}, function(err, message){
      var comment = new Comment(req.body)
      comment._message = message._id;
      message.comments.push(comment)
      message.save(function(message_err){
        if(message_err){
          res.render('index',{errors: message_err})
        } else {
          comment.save(function(comment_err){
            if(comment_err){
              res.render('index', {errors: message_err})
            } else{
              res.redirect('/')
            }
          })
        }
      })
    })
  })
}
