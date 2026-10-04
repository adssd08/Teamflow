import express , {type Express, type Request, type Response}  from 'express'
import {env} from './config/env.js'

const app: Express = express();

app.get("/health",(req: Request, res: Response)=>{
    res.send({"status" : "ok"})
});

app.listen(env.PORT, ()=>{
    console.log(`App listening on port ${env.PORT}`)
})
