import { Router } from "express";


const router = Router();

router.get('/group-one',(req,res)=>{
    res.sendFile(__dirname+'/public/landings/group-one/index.html')
});

router.get('/group-two',(req,res)=>{
    res.sendFile(__dirname+'/public/landings/group-two/index.html')
});

router.get('/group-three',(req,res)=>{
    res.sendFile(__dirname+'/public/landings/group-three/index.html')
});

export default router; 