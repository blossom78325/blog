import {config} from "../config";
import jwt from "jsonwebtoken";

const {JWT_SECRET} = config;

export const auth = (req: any, res: any, next: any) => {
    const token = req.header('x-auth-token');

    if (!token) return res.status(401).json({mgs: "인증에 실패했습니다."});

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (e) {
        console.log(e);
        if (e instanceof Error) res.status(400).json({msg: e.message});
    }
}


