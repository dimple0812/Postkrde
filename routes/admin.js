var express=require('express')
var adminmodel=require('../models/adminmodel')
var url=require('url')
var path=require('path')
var randomstring=require('randomstring')
var router=express.Router()
var d
router.use('/addsubcatadmin',function(req,res,next){
    adminmodel.fetchallcat('addcat',function(result){
        d=result
        next()
    })
})
var myuser;
var myuserrole;
router.use('/',function(req,res,next){
    myuser=req.session.unm
    myuserrole=req.session.role
    if(myuser==undefined || myuserrole!='admin')
    {
        console.log('invalid user please login first,IP tracking')
        res.redirect('/login')
    }
next()    
})
router.get('/',function(req,res,next){
    res.render('adminhome',{'myuser':myuser})
})
router.get('/manageusersadmin',function(req,res,next){
    adminmodel.manageusersadmin('register',function(result){
        console.log(result)
        res.render('manageusersadmin',{'data':result})
    })
})
router.get('/managepostadmin',function(req,res,next){
    adminmodel.managepostadmin('addpost',function(result){
        console.log(result)
        res.render('managepostadmin',{'data':result})
    })
})

router.get('/validateusers',function(req,res,next){
    var q=url.parse(req.url,true).query
    if(q.block!=undefined)
    {
        adminmodel.blockuser(q.block,function(result){
            console.log('user blocked')
            res.redirect('/admin/manageusersadmin')
        })
    }
    if(q.unblock!=undefined)
    {
        adminmodel.unblockuser(q.unblock,function(result){
            console.log('user unblocked')
            res.redirect('/admin/manageusersadmin')
        })
    }
    if(q.delete!=undefined)
    {
        adminmodel.deleteuser(q.delete,function(result){
            console.log('user deleted')
            res.redirect('/admin/manageusersadmin')
        })
    }
})
router.get('/validatepost',function(req,res,next){
    var q=url.parse(req.url,true).query
    if(q.block!=undefined)
    {
        adminmodel.blockpost(q.block,function(result){
            console.log('post blocked')
            res.redirect('/admin/managepostadmin')
        })
    }
    if(q.unblock!=undefined)
    {
        adminmodel.unblockpost(q.unblock,function(result){
            console.log('post unblocked')
            res.redirect('/admin/managepostadmin')
        })
    }
    if(q.delete!=undefined)
    {
        adminmodel.deletepost(q.delete,function(result){
            console.log('post deleted')
            res.redirect('/admin/managepostadmin')
        })
    }
})
router.all('/addcatadmin',function(req,res,next){
    if(req.method=='GET')
        res.render('addcatadmin',{'r':''})
    else
    {   var catid=randomstring.generate({
            length:3,
            charset:"12345678900987654321"
    })
        var catnm=req.body.catnm
        var catimg=req.files.catimg
        var catimgnm=catimg.name
        var data={'catid':catid,'catnm':catnm,'catimgnm':catimgnm}
        console.log(catimgnm)
        var des=path.join(__dirname,'../public/uploads/',catimgnm)
        catimg.mv(des,function(err){
            if(err)
                console.log(err)
            else
                adminmodel.addcatadmin(data,function(result){
                    if(result)
                    {
                        console.log('category added successfully')
                        res.render('addcatadmin',{'r':'category added successfully'})
                        
                    }
                    else
                        res.render('addcatadmin',{'r':'category not added'})
                     
                })
        })
    }
         
})
router.get('/viewfeedback',function(req,res,next){
    adminmodel.fetchfeedback('feedback',function(result){
        res.render('viewfeedbackadmin',{'data':result})
    })
})
router.all('/addsubcatadmin',function(req,res,next){
    if(req.method=='GET')
        res.render('addsubcatadmin',{'r':'','catdata':d})
    else
    {
        var catnm=req.body.catnm
        var subcatnm=req.body.subcatnm
        var catimg=req.files.catimg
        var catimgnm=catimg.name
        var subcatid=randomstring.generate({
            length:5,
            charset:'09876543211234567890'
        })
        var data={'subcatid':subcatid,'catnm':catnm,'subcatnm':subcatnm,'catimgnm':catimgnm}
        console.log(catimgnm)
        var des=path.join(__dirname,'../public/uploads/',catimgnm)
        catimg.mv(des,function(err){
            if(err)
                console.log(err)
            else
                adminmodel.addsubcatadmin(data,function(result){
                    if(result)
                    {
                        console.log('category added successfully')
                        res.render('addsubcatadmin',{'r':'Subcategory added successfully','catdata':d})
                        
                    }
                    else
                        res.render('addsubcatadmin',{'r':'subcategory not added','catdata':d })
                     
                })
        })
    }
         
})
router.get('/managesubcatadmin',function(req,res,next){
    adminmodel.managesubcatadmin('addsubcat',function(result){
        console.log(result)
        res.render('managesubcatadmin',{'data':result})
    })
})
router.get('/deletesubcatadmin',function(req,res,next){
    var d=url.parse(req.url,true).query
    if(d.delete!=undefined){
            adminmodel.deletesubcatadmin(d.delete,d.subcatnm,function(result){
            if(result)
            {
                
                res.redirect('/admin/managesubcatadmin');
                console.log('subcategory deleted successfully');
            }
        })
    }
    
})
router.get('/managecatadmin',function(req,res,next){
    adminmodel.managecatadmin('addcat',function(result){
        console.log(result)
        res.render('managecatadmin',{'data':result})
    })
})
router.get('/deletecatadmin',function(req,res,next){
    var d=url.parse(req.url,true).query
    if(d.delete!=undefined){
            adminmodel.deletecatadmin(d.delete,d.catnm,function(result){
            if(result)
            {
                console.log('category deleted successfully');
                res.redirect('/admin/managecatadmin');
                
            }
        })
    }
    
})
router.all('/changepass',function(req,res,next){
    if(req.method=='GET')
        res.render('changepassadmin',{'result':''})
    else
    {
       if(req.body.email==myuser)
       {
           if(req.body.newpass==req.body.renewpass)
           {
               adminmodel.changepass(req.body.email,req.body.newpass,function(result){
                   if(result)
                       res.render('changepassadmin',{'result':'password changed!!!!!'})
                   else
                       res.render('changepassword',{'result':'password doesnot changed!!!'})
               })
           }
           else
           {
               res.render('changepassadmin',{'result':'password and re-enter password doesnot match'})
           }
           
       }
       else
       {
           res.render('changepassadmin',{'result':'invalid email id'})
       }
        
    }
})







module.exports=router