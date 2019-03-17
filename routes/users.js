var express = require('express');
var path=require('path')
var url=require('url')
var randomstring=require('randomstring')
var usersmodel=require('../models/usersmodel')
var router = express.Router();


var myuser;
var myuserrole;

    router.use('/',function(req,res,next){
    myuser=req.session.unm
    myuserrole=req.session.role
    if(myuser==undefined || myuserrole!='user')
    {
        console.log('invalid user please login first,IP tracking')
        res.redirect('/login')
    }
next()    

    
})
var d2=''
var d3=''
router.use('/addpostuser',function(req,res,next){
    usersmodel.fetchalldata('addsubcat',function(result){
        d2=result
    usersmodel.fetchalldata('addcat',function(result1){
        d3=result1
        next()
    })    
        
    
})
})


/* GET users listing. */

router.get('/', function(req, res, next) {
  res.render('userhome',{'myuser':myuser})
});
router.all('/addpostuser',function(req,res,next){
   if(req.method=='GET')
   {
       res.render('addpostuser',{'result':'','catlist':d3,'subcatlist':d2})
   }
   else
   {
       var data=req.body
       var pid=randomstring.generate({
           length:6,
           charset:'12345678900987654321'
       })
       var postdate=Date()
       var myfiles=req.files
       imgref1=req.files.myimg1
       if(imgref1!=undefined)
       {
           f1=imgref1.name
           var des=path.join(__dirname,'../public/uploads',f1)
           imgref1.mv(des)
       }
       else
       {
           var f1='dummy.png'
       }
       imgref2=req.files.myimg2
       if(imgref2!=undefined)
       {
           f2=imgref2.name
           var des=path.join(__dirname,'../public/uploads',f2)
           imgref2.mv(des)
       }
       else
       {
           var f2='dummy.png'
       }
       imgref3=req.files.myimg3
       if(imgref3!=undefined)
       {
           f3=imgref3.name
           var des=path.join(__dirname,'../public/uploads',f3)
           imgref3.mv(des)
       }
       else
       {
           var f3='dummy.png'
       }
       var data1={'pid':pid,'title':data.title,'catnm':data.catnm,'subcatnm':data.subcatnm,'description':data.description,'price':data.price,'image1':f1,'image2':f2,'image3':f3,'mob':data.mob,'email':data.email,'address':data.address,'city':data.city,'ustatus':myuser,'vstatus':'0','postdate':postdate}

       usersmodel.addpostuser(data1,function(result){
           if(result)
               res.render('addpostuser',{'result':'Post added successfully please wait for verification','catlist':d3,'subcatlist':d2})
           else
               res.render('addpostuser',{'result':'post not added','catlist':d3,'subcatlist':d2})
       })
   }
});
router.get('/managepostuser',function(req,res,next){
  
    usersmodel.managepostuser(myuser,function(result){
        
      res.render('managepostuser',{'data':result})
    })
})
router.get('/manageposts',function(req,res,next){
     q=url.parse(req.url,true).query
    if(q.update!=undefined)
    {
        res.render('updatepostsuser',{'result':'','subcatlist':d2})
    }
    
    if(q.delete!=undefined)
    {
        usersmodel.deletepost(q.delete,function(result){
            console.log('post deleted')
            res.redirect('/users/managepostuser')
        })
    }
})
router.get('/updatepostsuser',function(req,res,next)
{
    usersmodel.updatepost(q,function(result){
        console.log('post updated')
        res.render('/users/managepostuser')
    })
})
router.all('/feedback', function(req, res, next) {
     
      
    if(req.method=='GET')
  res.render('feedbackuser',{'result':''});
  else
  {
     var fid=randomstring.generate({
          length:5,
          charset:"12345678900987654321"
      })
      var d=req.body
      var data={'fid':fid,'feedback':d.feedback,'uid':myuser}
      
      usersmodel.feedbackuser('feedback',data,function(result){
         if(result)
             res.render('feedbackuser',{'result':'feedback submitted successfully'})
         else
             res.render('feedbackuser',{'result':'feedback doesnot submitted'})
          
      })
  }
  
  
});

router.all('/changepass',function(req,res,next){
    if(req.method=='GET')
        res.render('changepassuser',{'result':''})
    else
    {
       if(req.body.email==myuser)
       {
           if(req.body.newpass==req.body.renewpass)
           {
               usersmodel.changepass(req.body.email,req.body.newpass,function(result){
                   if(result)
                       res.render('changepassuser',{'result':'password changed!!!!!'})
                   else
                       res.render('changepassuser',{'result':'password doesnot changed!!!'})
               })
           }
           else
           {
               res.render('changepassuser',{'result':'password and re-enter password doesnot match'})
           }
           
       }
       else
       {
           res.render('changepassuser',{'result':'invalid email id'})
       }
        
    }
})




module.exports = router
