import datetime
import random
from faker import Faker
from enum import Enum
import time
from flask import Flask
import flask
import itertools
import json

app = Flask(__name__)
fake = Faker()
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
        {
            'id': value,
            'name': f'RSE{value}',
            'city': fake.city(),
            'country': fake.country(),
            'continent': fake.country_code(),
            'latitude': fake.latitude().to_eng_string(),
            'longitude': fake.longitude().to_eng_string(),
            'rse_type': random.choice(['DISK', 'TAPE', 'DISK+TAPE']),
            'volatile': random.choice([True, False]),
        } for value in range(10000)
    ]
    try:
        def generate():
            for i in long_list:
                # time.sleep(2)
                print(f"sending {i}")
                yield render_json(i) + '\n'
                print("sleeping")

        return try_stream(generate())
    except Exception as e:
        return flask.Response(status=500, response=str(e))

@app.route('/rseaccountusage')
def rseaccountusage():
    name = f'{fake.first_name()}_{fake.last_name()}'
    long_list = [
        {
            'rse_id': f'rse_{value}',
            'rse': fake.pystr_format(),
            'account': name,
            'used_files': random.randint(0, 50),
            'used_bytes': random.randint(0, 1000),
            'quota_bytes': random.randint(500, 2000),
        } for value in range(10)
    ]
    try:
        def generate():
            for i in long_list:
                # time.sleep(2)
                print(f"sending {i}")
                yield render_json(i) + '\n'
                print("sleeping")

        return try_stream(generate())
    except Exception as e:
        return flask.Response(status=500, response=str(e))

@app.route('/listdids')
def listdids():

    long_list = [
        {
            "scope": fake.pystr_format("user.{{first_name}}{{last_name}}"),
            "name": random.choice(["file", "dataset", "container"]) + "-" + fake.pystr(),
            "did_type": random.choice(["File", "Dataset", "Container"]),
            "bytes": random.randint(0, 1e8),
            "length": random.randint(0, 1e8),
        } for i in range(100)
    ]
    try:
        def generate():
            for i in long_list:
                # time.sleep(2)
                print(f"sending {i}")
                yield render_json(i) + '\n'
                print("sleeping")

        return try_stream(generate())
    except Exception as e:
        return flask.Response(status=500, response=str(e))
    

if __name__ == '__main__':
    app.run(debug=True, port=8080)