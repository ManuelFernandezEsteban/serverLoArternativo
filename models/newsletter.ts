import { DataTypes } from "sequelize";
import db from "../db/connection";



const NewsLetter = db.define('Newsletter',{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    nombre:{
        type:DataTypes.STRING(255)
    },
    email:{
        type:DataTypes.STRING(255)
    },
    privacidad:{
        type:DataTypes.BOOLEAN
    },
    ip:{
        type:DataTypes.STRING(255)
    },
    createdAt:{
        type:DataTypes.DATE
    },
    updatedAt:{
        type:DataTypes.DATE
    }

});

export default NewsLetter;