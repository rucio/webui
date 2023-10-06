import { withAuthenticatedSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { NextApiRequest, NextApiResponse } from "next";

async function endpoint(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    if(req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' })
        return
    }

   
    const data = req.body
    
    if(!data) {
        res.status(400).json({ error: 'Missing body' })
        return
    }
    
    res.status(200).json(req.body)
}

export default withAuthenticatedSessionRoute(endpoint);