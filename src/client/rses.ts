import { RSEConfig } from '../utils/config'
import { RSEModel } from '../utils/models'
import { streamData } from '../utils/restApiWrapper'

class RSE extends RSEModel {
    public static listRses(
        expression?: any,
        onSuccess?: (args?: unknown) => void,
        onError?: (args?: unknown) => void,
    ) {
        let url = RSEConfig.endpoints.rses
        if (expression) {
            url += '?expression=' + expression
        }
        streamData(url)
            .then((data: any) => {
                onSuccess?.(data)
            })
            .catch((error: any) => {
                onError?.(error)
            })
    }
}

export { RSE }
