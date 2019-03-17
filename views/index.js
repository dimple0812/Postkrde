var express = require('express');
var usersmodel=require('../models/usersmodel');
var testmail=require('./testmail');
var url=require('url');
var randomstring=require('randomstring')
var path=require('path')
var router = express.Router();
var d1=''
router.use('/viewsubcat',function(req,res,next){
    usersmodel.fetchalldata('addcat',function(result){
        d1=result
        next()
    })
})
var d2=''
router.use('/addpost',function(req,res,next){
    usersmodel.fetchalldata('addsubcat',function(result){
        d2=result
        next()
    
})
})

/* GET home page. */
router.get('/', function(req, res, next) {
    usersmodel.fetchcatlimit(function(result){
        res.render('index',{'data':result});
    })
  
});
router.get('/logout',function(req,res,next){
    req.session.destroy()
    res.redirect('/login')
})
router.get('/home', function(req, res, next) {
    usersmodel.fetchcatlimit(function(result){
        res.render('index',{'data':result});
    })
  
});
router.get('/about', function(req, res, next) {
    res.cookie('unm','abc')
    res.cookie('pass','123')
    res.clearCookie('unm')
    res.clearCookie('pass')
    res.render('about',{'mycookie':req.cookies});
    
  
});
router.get('/contact', function(req, res, next) {
  res.render('contact');
});
router.all('/login', function(req, res, next) {
    if(req.cookies.unm!=undefined)
    {
        d={'u':req.cookies.unm,'p':req.cookies.pass,'s':1}
    }
    else
    {
        d={'u':'','p':'','s':0}
    }
    if(req.method=="GET")
        {
            res.render('login',{'result':'','d':d});
        }
    else
    {
        var data={'email':req.body.email,'pass':req.body.pass,'vstatus':1}
        usersmodel.logincheck(data,function(result){
            if(result.length>0)
            {
                if(req.body.chk!=undefined)
                {
                    res.cookie('unm',req.body.email)
                    res.cookie('pass',req.body.pass)
                }
                req.session.unm=req.body.email
                req.session.role=result[0].role
                if(result[0].role=='admin')
                {
                    res.redirect('/admin')
                }
                if(result[0].role=='user')
                {
                    res.redirect('/users')
                }
                else
                {
                    res.render('login',{'result':'Invalid username or password','d':d})
                }
            }
            
        })
    }
    
  
 
});
router.get('/verify',function(req,res,next){
   var data=url.parse(req.url,true).query
   console.log(data)
   usersmodel.verifyaccount(data,function(result){
       res.redirect('/login')
   })
 })
router.all('/register', function(req, res, next) {
     var regid=randomstring.generate({
          length:10,
          charset:"12345678900987654321"
      })
      
    if(req.method=='GET')
  res.render('register',{'result':''});
  else
  {
     
      req.body.regid=regid
      req.body.role='user'
      usersmodel.userregister('register',req.body,function(result){
          if(result)
          {   
              testmail.mymail(req.body.email,req.body.pass,function(){
              res.render('register',{'result':'registered successfully\n\ ,verify your account through your mail'})
          })
          }
              else
              res.render('register',{'result':'registration failed'})
          
      })
  }
  
  
});
router.get('/service', function(req, res, next) {
var paypalURL = 'https://www.sandbox.paypal.com/cgi-bin/webscr'; //Test PayPal API URL
var paypalID = 'dimplesharma0812seller@gmail.com'; //Business Email
var item_name='bike'
var item_price='100'
var item_id='1001'
  res.render('service',{'paypalURL':paypalURL,'paypalID':paypalID,'item_name':item_name,'item_price':item_price,'item_id':item_id});
});
router.get('/cancel',function(req,res,next){
    res.render('cancel')
})
router.get('/success',function(req,res,next){
    var q=url.parse(req.url,true).query
    usersmodel.paymentreq('payment',q,function(result){
    res.render('success')    
    })
    
})
router.get('/viewsubcat',function(req,res,next){
    var d=url.parse(req.url,true).query
    usersmodel.fetchsubcatlimit(d,function(result){
        res.render('viewsubcat',{'data':result,'catnm':d,'catlist':d1})
    })
})
router.all('/addpost',function(req,res,next){
   if(req.method=='GET')
   {
       res.render('addpost',{'result':'','subcatlist':d2})
   }
   else
   {
       var data=req.body
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
       usersmodel.addpost(data,f1,f2,f3,function(result){
           if(result)
               res.render('addpost',{'result':'Post added successfully please wait for verification','subcatlist':d2})
           else
               res.render('addpost',{'result':'post not added','subcatlist':d2})
       })
   }
});
router.get('/viewpost', function(req, res, next) {
    var d=url.parse(req.url,true).query
    usersmodel.fetchpost(d,function(result){
        res.render('viewpost',{'data':result,'scatnm':d})
    })
    
  
});

module.exports = router;
