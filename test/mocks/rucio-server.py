import datetime
import random
from faker import Faker
from enum import Enum
import time
from flask import Flask
import flask
import itertools
import json
import functools

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
            'files': random.randint(0, 50),
            'used_bytes': random.randint(0, 1000),
            'bytes_limit': random.randint(500, 2000),
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

@app.route('/didmeta')
def didmeta():
    didtype = random.choice(["Dataset", "Container", "File"])
    isfile = lambda dtype: dtype == "File"
    firstname, lastname = fake.first_name(), fake.last_name()
    metadata = {
        # for all
        "name": f"{didtype}-{fake.pystr()}",
        "scope": f"{firstname}.{lastname}",
        "account": f"{firstname}_{lastname}",
        "did_type": didtype,
        "created_at": fake.date_time_this_year(),
        "updated_at": fake.date_time_this_year(),
        "availability": random.choice(["Lost", "Deleted", "Available"]),
        "obsolete": random.choice([True, False]),
        "hidden": random.choice([True, False]),
        "suppressed": random.choice([True, False]),
        "purge_replicas": random.choice([True, False]),
        "monotonic": random.choice([True, False]),
        # begin only for collections
        "is_open": random.choice([True, False]) if not isfile(didtype) else None,
        # begin only for files
        "adler32": fake.hexify(text="^" * 8) if isfile(didtype) else None,
        "guid": fake.uuid4() if isfile(didtype) else None,
        "md5": fake.hexify(text="^" * 32) if isfile(didtype) else None,
        "filesize": random.randint(0, 1e3) * random.choice([1, 1e3, 1e6, 1e9]) if isfile(didtype) else None,
    }
    try:
        def generate():
            print(f"sending {metadata}")
            yield render_json(metadata) + '\n'
            print("sleeping")
        return try_stream(generate())
    except Exception as e:
        return flask.Response(status=500, response=str(e))

@app.route('/didparents')
def didparents():
    long_list = [
        {
            "scope": fake.pystr_format("user.{{first_name}}{{last_name}}"),
            "name": random.choice(["dataset", "container"]) + "-" + fake.pystr(),
            "did_type": random.choice(["Dataset", "Container"]),
        } for _ in range(100)
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

@app.route("/didrules")
def didrules():
    long_list = [
        {
            "id": fake.uuid4(),
            "name": f"RULE-{fake.pystr()}",
            "state": random.choice(["Replicating", "OK", "Stuck", "Suspended", "Waiting_Approval", "Inject"]),
            "account": fake.pystr_format("user.{{first_name}}{{last_name}}"),
            "subscription": {"name": fake.pystr(), "account": fake.pystr_format("user.{{first_name}}{{last_name}}")},
            "last_modified": fake.date_time_this_year(),
        } for _ in range(100)
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

@app.route("/datasetreplicas")
def datasetreplicas():
    long_list = [
        {
            "rse": f"RSE-{fake.pystr()}",
            "rseblocked": random.choice([*[0]*4, random.randint(0,7)]),
            "availability": fake.boolean(),
            "available_files": random.randint(0, 100),
            "available_bytes": int(random.randint(0, 1e3) * random.choice([1, 1e3, 1e6, 1e9])),
            "creation_date": fake.date_of_birth(minimum_age=2, maximum_age=8),
            "last_accessed": fake.date_time_this_year(),
        } for _ in range(100)
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

@app.route("/subscriptionrulestates")
def subscriptionrulestates():
    long_list = [
        {
            "name": f"SUBSCRIPTION-{fake.pystr()}",
            "state_ok": random.randint(0, 100),
            "state_replicating": random.randint(0, 100),
            "state_stuck": random.randint(0, 100),
            "state_suspended": random.randint(0, 100),
        } for _ in range(100)
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

def output(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        long_list = [func(*args, **kwargs) for _ in range(100)]
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
    return wrapper

@app.route("/rulepagelockentry")
@output
def rulepagelockentry():
    return {
        "scope": fake.pystr_format("user.{{first_name}}{{last_name}}"),
        "name": random.choice(["dataset", "container"]) + "-" + fake.pystr(),
        "rse": f"RSE-{fake.pystr()}",
        "state": random.choice(["R", "O", "S"]),
        "ddm_link": fake.url(),
        "fts_link": fake.url(),
    }

@app.route("/filereplicastate")
@output
def filereplicastate():
    return {
        "rse": f"RSE-{fake.pystr()}",
        "state": random.choice(["Available", "Unavailable", "Copying", "Being_Deleted", "Bad", "Temporary_Unavailable"]),
    }

@app.route("/filereplicastate-d")
@output
def filereplicastate_d():
    return {
        "scope": fake.pystr_format("user.{{first_name}}{{last_name}}"),
        "name": "dataset-" + fake.pystr(),
        "available": random.randint(0, 100),
        "unavailable": random.randint(0, 100),
        "copying": random.randint(0, 100),
        "being_deleted": random.randint(0, 100),
        "bad": random.randint(0, 100),
        "temporary_unavailable": random.randint(0, 100),
    }

if __name__ == '__main__':
    app.run(debug=True, port=8080)