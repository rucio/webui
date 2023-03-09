import datetime
from enum import Enum
import time
from flask import Flask
import flask
import itertools
import json

app = Flask(__name__)

# RFC 1123 (ex RFC 822)
DATE_FORMAT = '%a, %d %b %Y %H:%M:%S UTC'

def date_to_str(date):
    """ Converts a datetime value to the corresponding RFC-1123 string.
    :param date: the datetime value to convert.
    """
    return datetime.datetime.strftime(date, DATE_FORMAT) if date else None

class APIEncoder(json.JSONEncoder):
    """ Propretary JSONEconder subclass used by the json render function.
    This is needed to address the encoding of special values.
    """

    def default(self, obj):  # pylint: disable=E0202
        if isinstance(obj, datetime.datetime):
            # convert any datetime to RFC 1123 format
            return date_to_str(obj)
        elif isinstance(obj, (datetime.time, datetime.date)):
            # should not happen since the only supported date-like format
            # supported at dmain schema level is 'datetime' .
            return obj.isoformat()
        elif isinstance(obj, datetime.timedelta):
            return obj.days * 24 * 60 * 60 + obj.seconds
        elif isinstance(obj, Enum):
            return obj.name
        return json.JSONEncoder.default(self, obj)


def render_json(data):
    """ JSON render function
    """
    return json.dumps(data, cls=APIEncoder)


def render_json_list(list_):
    """ JSON render function for list
    """
    return json.dumps(list_, cls=APIEncoder)

def try_stream(generator, content_type=None) -> "flask.Response":
    """
    Peeks at the first element of the passed generator and raises
    an error, if yielding raises. Otherwise returns
    a flask.Response object.
    :param generator: a generator function or an iterator.
    :param content_type: the response's Content-Type.
                         'application/x-json-stream' by default.
    :returns: a response object with the specified Content-Type.
    """
    if not content_type:
        content_type = 'application/x-json-stream'

    it = iter(generator)
    try:
        peek = next(it)
        print(f"sending response")
        return flask.Response(flask.stream_with_context(itertools.chain((peek,), it)), content_type=content_type)
    except StopIteration:
        print("sending empty response")
        return flask.Response('', content_type=content_type)
    

@app.route('/stream')
def stream():
    long_list = [{
        'id': 1,
        'name': 'test',
        'date': datetime.datetime.now(),
        'type': 'test'
    }]
    long_list = [
        {f'RSE{value}': value for value in range(100000)} 
    ]
    try:
        def generate():
            for i in long_list:
                # print(f"yielding response {i}")
                time.sleep(2)
                yield render_json(i) + '\n'
                print("sleeping")

        return try_stream(generate())
    except Exception as e:
        return flask.Response(status=500, response=str(e))

if __name__ == '__main__':
    app.run(debug=True)