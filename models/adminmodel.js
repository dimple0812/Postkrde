var db=require('./conn')
var randomstring=require('randomstring')

function adminmodel(){
    this.addcatadmin=function(data,cb)
{
       db.collection('addcat').insert(data,function(err,result){
           if(err)
               console.log(err)
           else
               cb(result)
       })
         
        
}
this.manageusersadmin=function(tblnm,cb)

{
    db.collection(tblnm).find({'role':{$ne:'admin'}}).toArray(function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
            
    })
 
}
this.blockuser=function(regid,cb)
{
    db.collection('register').update({'regid':regid},{$set:{'vstatus':'0'}},function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
    })
   
}
this.unblockuser=function(regid,cb)
{
    db.collection('register').update({'regid':regid},{$set:{'vstatus':1}},function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
    })
  
}
this.deleteuser=function(regid,cb)
{   db.collection('register').remove({'regid':regid},function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
})
  
}
this.managepostadmin=function(tblnm,cb)

{   db.collection(tblnm).find().toArray(function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
})
}
this.blockpost=function(pid,cb)
{
    db.collection('addpost').update({'pid':pid},{$set:{'vstatus':'0'}},function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
    })
   
}
this.unblockpost=function(pid,cb)
{
    db.collection('addpost').update({'pid':pid},{$set:{'vstatus':1}},function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
    })
  
}
this.deletepost=function(pid,cb)
{   db.collection('addpost').remove({'pid':pid},function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
})
  
}
this.addsubcatadmin=function(data,cb)
{
    db.collection('addsubcat').insert(data,function(err,result){
        if(err)
        console.log(err)
        else
        cb(result)
    })
        
        
}

this.fetchallcat=function(tbl_nm,cb)
{
    db.collection(tbl_nm).find().toArray(function(err,result){
        if(err)
        console.log(err)
        else
        cb(result)
    })
    
}
this.fetchfeedback=function(tblnm,cb)
{
    db.collection(tblnm).find().toArray(function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
    })
}
this.managesubcatadmin=function(tblnm,cb)

{
    db.collection(tblnm).find().toArray(function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
            
    })
}
 

this.deletesubcatadmin=function(subcatid,subcatnm,cb)
{
    db.collection('addsubcat').remove({'subcatid':subcatid},function(err,result){
        if(err)
            console.log(err)
        else
        {
            db.collection('addpost').remove({'subcatnm':subcatnm},function(err,result1){
                if(err)
                    console.log(err)
                else
                    cb(result)
            })
        }
    })
}
this.managecatadmin=function(tblnm,cb)

{
    db.collection(tblnm).find().toArray(function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
            
    })
}
this.deletecatadmin=function(catid,catnm,cb)
{
    db.collection('addcat').remove({'catid':catid},function(err,result){
        if(err)
            console.log(err)
        else
        {
            db.collection('addsubcat').remove({'catnm':catnm},function(err,result1){
                if(err)
                    console.log(err)
                else
                {
                    db.collection('addpost').remove({'catnm':catnm},function(err,result2){
                        if(err)
                            console.log(err)
                        else
                            cb(result)
                    })
                }
            })
        }
        
    })
}
this.changepass=function(email,pass,cb)
{
    db.collection('register').update({'email':email},{$set:{'pass':pass}},function(err,result){
    if(err)
        console.log(err)
    else
        cb(result)
    
    })
}



    
    
    
    
    
    
    
}
module.exports=new adminmodel()
