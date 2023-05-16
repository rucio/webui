import { withAuthenticatedSessionRoute, withSessionRoute } from "@/lib/infrastructure/auth/session-utils";
import { NextApiRequest, NextApiResponse } from "next";

async function testAuthenticatedRoute(req: NextApiRequest, res: NextApiResponse, rucioAuthToken: string) {
    res.status(200).json({ message: `Authenticated route ${rucioAuthToken}` });
}

export default withAuthenticatedSessionRoute(testAuthenticatedRoute);