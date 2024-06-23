const express = require('express')
const router = express.Router()
const User=require("../models/User")
const { body, validationResult} = require('express-validator');
const Experience=require("../models/Experience");
const SkillsOfUser=require("../models/Skills");
const Sent=require("../models/Sent")
const Recieved=require("../models/Recieved")
const Grade=require("../models/Grade")

router.post("/creatuser",[
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password').isLength({ min: 5 })], async(req,res)=> {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let email=req.body.email
    let fool=await User.findOne({email})
    //console.log(fool)
    if (fool!=null) {
        return res.status(400).json("Email Allready Exist");
    }
    try{
        User.create({
            name: req.body.name,
            branch:req.body.branch,
            email:req.body.email,
            contact:req.body.contact,
            hostel:req.body.hostel,
            password:req.body.password
        })
        res.json({success:true});
        
    }

    catch(error){
        console.log(error)
        res.json({success:false});
        localStorage.setItem('isSignUp','false')
    }
})

router.post("/EditUserData",[
    body('email').isEmail(),
    body('name').isLength({ min: 5 })], async(req,res)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let email=req.body.email;
    try {
        await User.findOneAndUpdate({'email':email},
            { $set:{
                'name': req.body.name,
                'branch':req.body.branch,
                'email':req.body.email,
                'contact':req.body.contact,
                'hostel':req.body.hostel,
            } }).then(() => {
                res.json({ success: true })
            })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false })
    }

})

router.post("/loginuser",[
    body('email').isEmail(),
    body('password').isLength({ min: 5 })], async(req,res)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let email=req.body.email;
    try{
        let userData=await User.findOne({email});
        if(!userData){
            return res.status(400).json({errors: "Enter a Valid email"})
        }
        if(req.body.password !== userData.password){
            return res.status(400).json({errors: "Enter a Valid password"})            
        }
        return res.json({success:true})
    }

    catch(error){
        console.log(error)
        res.json({success:false});
    }
})



router.post('/Experience',[
    body('name').isLength({ min: 3 }),
    body('experience').isLength({ min: 5 }),
    ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let data = req.body.Experience_data;
    await data.splice(0,0,{Order_date:req.body.order_date})
    let email=req.body.email;
    //if email not exisitng in db then create: else: InsertMany()
    let eId = await Experience.findOne({ 'email':email })    
    //console.log(eId)
    if (eId===null) {
        try {
            
            await Experience.create({
                email:email,
                experience:[data]
            }).then(() => {
                res.json({ success: true })
            })
        } catch (error) {
            res.json({ success: false })

        }
    }

    else {
        try {
            await Experience.findOneAndUpdate({'email':email},
                { $push:{experience: data} }).then(() => {
                    res.json({ success: true })
                })
        } catch (error) {
            res.json({ success: false })
        }
    }
})

router.post('/AddSkills', async (req, res) => {
    let data = req.body.Skill_data;
    let email=req.body.email;
    //if email not exisitng in db then create: else: InsertMany()
    let eId = await SkillsOfUser.findOne({ 'email':email })    
    //console.log(eId)
    if (eId===null) {
        try { 
            await SkillsOfUser.create({
                email:email,
                SkillData:data
            }).then(() => {
                res.json({ status: true })
            })
        } catch (error) {
            res.json({status:false});
        }
    }

    else {
        try {
            await SkillsOfUser.findOneAndUpdate({'email':email},
            { $set:{'SkillData':data} }).then(() => {
                    res.json({ status: true })
                })
        } catch (error) {
            res.json({ status: false })
        }
    }
})

router.post('/AddGrades', async (req, res) => {
    let spi = req.body.spi;
    let cpi=req.body.cpi;
    //console.log(cpi,spi);
    let email=req.body.email;
    //if email not exisitng in db then create: else: InsertMany()
    let eId = await Grade.findOne({ 'email':email })    
    //console.log(eId)
    if (eId===null) {
        try { 
            await Grade.create({
                email:email,
                cpi:cpi,
                spi:spi
            }).then(() => {
                res.json({ status: true })
            })
        } catch (error) {
            res.json({status:false});
        }
    }

    else {
        try {
            await Grade.findOneAndUpdate({'email':email},
            { $set:{'cpi':cpi,'spi':spi} }).then(() => {
                    res.json({ status: true })
                })
        } catch (error) {
            //console.log(error.message)
            res.json({ status: false })
        }
    }
    })
    
router.post("/sentRequests",async(req,res)=>{
    let email=req.body.email
    //console.log(email)
    let fool=await Sent.findOne({'userEmail':email})
    //console.log(fool)
    res.json(fool)
})

router.post("/recievedRequests",async(req,res)=>{
    let email=req.body.email
    let fool=await Recieved.findOne({'userEmail':email})
    //console.log(fool)
    res.json(fool)
    
})

router.post('/Requests', async (req, res) => {
    let data = [{RequestedEmail:req.body.RequestedEmail,message:req.body.message,accepted:false}];
    let email=req.body.userEmail;
    //if email not exisitng in db then create: else: InsertMany()
    let eId = await Sent.findOne({ 'userEmail':email })    
    console.log(email,data)
    if (eId===null) {
        try { 
            console.log("hii")
            await Sent.create({
                userEmail:email,
                requestData:data
            })
        } catch (error) {
            //console.log(error.message)
            res.json({success:false});
        }
    }
    else {
        console.log("hiiii")
            try {
                await Sent.findOneAndUpdate({'userEmail':email},
                    { $push:{requestData: data[0]} })
            } catch (error) {
                //console.log(error.message)
                res.json({ success: false })
            }
        }
        data = [{recievedEmail:req.body.userEmail,message:req.body.message,accepted:false}];
        email=req.body.RequestedEmail;
        //if email not exisitng in db then create: else: InsertMany()
        eId = await Recieved.findOne({ 'userEmail':email })    
        console.log(email,data)
        if (eId===null) {
            try { 
                console.log("recieved")
                await Recieved.create({
                    userEmail:email,
                    recievedData:data
                }).then(() => {
                    res.json({ success: true })
                })
            } catch (error) {
                //console.log(error.message)
                res.json({success:false});
            }
        }
        else {
                try {
                    await Recieved.findOneAndUpdate({'userEmail':email},
                        { $push:{recievedData: data[0]} }).then(() => {
                            res.json({ success: true })
                        })
                } catch (error) {
                    //console.log(error.message)
                    res.json({ success: false })
                }
            }
    })

router.post('/updateRequest',async (req, res) => {
    let userEmail = req.body.userEmail;
    let recievedEmail = req.body.recievedEmail;
    console.log(userEmail,recievedEmail);
    try {
        await Sent.updateOne({'userEmail':recievedEmail,'requestData.RequestedEmail':userEmail},
            { $set:{'requestData.$.accepted':true} }).then(() => {
                console.log("hii")
            })
            await Recieved.updateOne({'userEmail':userEmail,'recievedData.recievedEmail':recievedEmail},
            { $set:{'recievedData.$.accepted':true} }).then(() => {
                console.log("hii")
                res.json({ success: true })
            })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false })
}})

router.post('/updateEndRequest',async (req, res) => {
    let userEmail = req.body.userEmail;
    let recievedEmail = req.body.recievedEmail;
    console.log(userEmail,recievedEmail);
    try {
        await Sent.updateOne({'userEmail':recievedEmail,'requestData.RequestedEmail':userEmail},
            { $set:{'requestData.$.accepted':false} }).then(() => {
                console.log("hii")
            })
            await Recieved.updateOne({'userEmail':userEmail,'recievedData.recievedEmail':recievedEmail},
            { $set:{'recievedData.$.accepted':false} }).then(() => {
                console.log("hii")
                res.json({ success: true })
            })
    } catch (error) {
        res.json({ success: false })

   
}})


router.post("/getSkills",async(req,res)=>{
    try{
        res.send(global.Skills)
    } catch(error){
        res.send("Server Error")
    }
})

router.post("/getUserDetails",async(req,res)=>{
    let email=req.body.email
    //console.log(email)
    let fool=await User.findOne({email})
    //console.log(fool.email,fool.name,fool.location)
    res.json(fool)
 
})

router.post("/getExperiences",async(req,res)=>{
    try{
        //console.log(global.experience)
        res.send(global.experience)
    } catch(error){
        res.send("Server Error")
    }
    
})

router.post("/getUsersSkills",async(req,res)=>{
    try{
        //console.log(global.userSkills)
        res.send(global.userSkills)
    } catch(error){
        res.send("Server Error")
    }
    
})

router.post("/userExperiences",async(req,res)=>{
    let email=req.body.email
    //console.log(email)
    let fool=await Experience.findOne({'email':email})
    //console.log(fool.email,fool.name,fool.location)
    res.json(fool)
    
})

router.post("/getUserSkills",async(req,res)=>{
    let email=req.body.email
    //console.log(email)
    let fool=await SkillsOfUser.findOne({'email':email})
    //console.log(fool)
    //console.log("i am at get userSkills")
    res.json(fool)
    
})
router.post("/getGrades",async(req,res)=>{
    let email=req.body.email
    //console.log(email)
    //console.log("i am at get Grades")
    let fool=await Grade.findOne({'email':email})
    //console.log(fool)
    res.json(fool)
    
})

module.exports = router;