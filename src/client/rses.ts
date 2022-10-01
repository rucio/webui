import { RSEModel } from '../utils/models'
import { streamData } from '../utils/restApiWrapper'

class RSE extends RSEModel {
    public static glistRses(expression: boolean): object {
        let url = '/rses/'
        if (expression === true) {
            url += '?expression=' + encodeURIComponent(expression)
        }
        return streamData(url)
    }
}

export { RSE }
