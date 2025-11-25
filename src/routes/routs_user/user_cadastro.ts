// src\routes\routs_user\user_cadastro.ts
import { FastifyPluginAsync } from 'fastify';
import { connectar } from "../../data/conecction.js";



const cadastarr_user:FastifyPluginAsync = async (aplicacao, options) =>{
    
    aplicacao.post("/usuario", async (request, replay) =>{
        
    });
    
}

export{cadastarr_user};