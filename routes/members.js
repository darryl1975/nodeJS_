
/*
 * GET members listing.
 */
exports.list = function(req, res){

  var pg = req.url;

  req.getConnection(function(err,connection){
       
      var query = connection.query('SELECT * FROM member',function(err,rows)
      {
        if(err)
          console.log("Error Selecting : %s ",err );
     
        res.render('pages/members',{page: pg, page_title:"members - Node.js", data:rows});
      });
  });
};

exports.add = function(req, res){
  res.render('pages/add_member',{page_title:"Add member - Node.js"});
};

/*
 * Save the member
 */
exports.save = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);

    req.getConnection(function (err, connection) {
        
      if (err)
        console.log("Error establishing connection: %s", err);

      var data = {
          surname       : input.surname,
          fname         : input.fname,
          secondname    : input.secondname
      };
        
      var query = connection.query("INSERT INTO member SET ? ",data, function(err, rows)
      {
        if (err)
          console.log("Error inserting : %s ",err );
         
        res.redirect('/about'); 
      });
    });
};

exports.edit = function(req, res){
    
    var id = req.params.id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM member WHERE mid = ?',[id],function(err,rows)
        {         
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('pages/edit_member',{page_title:"Edit member - Node.js",data:rows});        
        });
    }); 
};

exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    
    req.getConnection(function (err, connection) {
        
        var data = {     
            surname     : input.surname,
            fname       : input.fname,
            secondname  : input.secondname
        };
        
        connection.query("UPDATE member set ? WHERE mid = ? ",[data,id], function(err, rows)
        {
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/about');
        });
    });
};


exports.delete_member = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM member  WHERE mid = ? ",[id], function(err, rows)
        {
          if(err)
            console.log("Error deleting : %s ",err );
            
          res.redirect('/about'); 
        });
     });
};


