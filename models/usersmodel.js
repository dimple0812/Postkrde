var db=require('./conn')
var randomstring=require('randomstring')

function usersmodel(){
    this.userregister=function(cnm,data,cb){
        db.collection(cnm).insert(data,function(err,result){
            if(err)
            console.log(err)
            else
            cb(result)
        })

    }
     this.logincheck=function(data,cb)
{
    db.collection('register').find(data).toArray(function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
    })
    
    
}
 this.fetchcatlimit=function(cb)
{
    db.collection('addcat').find().toArray(function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
    })
    
}
this.verifyaccount=function(data,cb)
{
    db.collection('register').update({'email':data.email},{$set:{'vstatus':'1'}},function(err,result){
        if(err)
            console.log(err)
        else
            cb(result)
    })
   
} 

this.fetchsubcatlimit=function(d,cb)
{
    db.collection('addsubcat').find({'catnm':d.cnm}).toArray(function(err,result){
        if(err)
        console.log(err)
        else
        cb(result)
    })
    
}

this.fetchpost=function(d,cb)
{
    if(d.city==undefined)
    {
        db.collection('addpost').find({$and:[{'catnm':d.scnm},{'vstatus':1}]}).toArray(function(err,result){
            if(err)
            console.log(err)
            else
            cb(result)
        })
    }
        

        else
    {
        
        db.collection('addpost').find({$and:[{'catnm':d.scnm},{'city':d.city},{'vstatus':1}]}).toArray(function(err,result){
            if(err)
            console.log(err)
            else
            cb(result)
        })
        
    }
    
    
}
function addpost(data,f1,f2,f3,cb)
{
    var query="insert into addpost values (NULL,'"+data.title+"','"+data.cat_nm+"','"+data.description+"','"+data.price+"','"+f1+"','"+f2+"','"+f3+"','"+data.mob+"','"+data.email+"','"+data.address+"','"+data.city+"',0,0,'"+Date()+"')"
    con.query(query,function(err,result){
        if(err)
            console.log(err)
        else
        
            cb(result)
    })
}
}
module.exports=new usersmodel()

