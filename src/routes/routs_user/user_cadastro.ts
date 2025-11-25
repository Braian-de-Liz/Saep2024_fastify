// src\routes\routs_user\user_cadastro.ts
import { FastifyPluginAsync } from 'fastify';
import { connectar } from "../../data/conecction.js";



const cadastarr_user:FastifyPluginAsync = async (aplicacao, options) =>{

    const schema_json = schema:{
        body:{
            
        }
    }
    
    aplicacao.post("/usuario",schema_json ,async (request, replay) =>{
        
    });
    
}

export{cadastarr_user};
