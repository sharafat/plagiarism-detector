from io import BytesIO
from werkzeug.exceptions import NotFound
from api import app


def _login():
    return app.test_client().post('/api/login', json={
        "email": "demo@demo.com",
        "password": "demo"
    })


def _auth_header():
    token = _login().json.get('access_token')
    return {'Authorization': 'Bearer ' + token}


def test_login_with_incorrect_credentials():
    response = app.test_client().post('/api/login', json={
        "email": "a@b.com",
        "password": "???"
    })
    assert response.status_code == 401
    assert "Incorrect username or password." in response.json.get('error')


def test_login_with_correct_credentials():
    response = _login()
    assert response.status_code == 200
    assert response.json.get('access_token', None) is not None


def test_documents():
    response = app.test_client().get('/api/documents', headers=_auth_header())
    assert response.status_code == 200
    assert len(response.json) > 0


def test_check_document_with_no_input():
    response = app.test_client().post('/api/documents/check', headers=_auth_header())
    assert response.status_code == 422
    assert "text/file is required." in response.json.get('error')


def test_check_pasted_document():
    response = app.test_client().post('/api/documents/check', data={"text": "test"}, headers=_auth_header())
    assert response.status_code == 200
    assert response.json.get('matching_probability') >= 0.0


def test_check_uploaded_document():
    response = app.test_client().post(
        '/api/documents/check',
        data=dict(file=(BytesIO(b'test'), 'test_file.csv')),
        headers=_auth_header()
    )
    assert response.status_code == 200
    assert response.json.get('matching_probability') >= 0.0


def test_check_document_with_high_matching_probability():
    response = app.test_client().post(
        '/api/documents/check',
        data={"text": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. "
                      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, "
                      "when an unknown printer took a galley of type and scrambled it to make a type specimen book."},
        headers=_auth_header()
    )
    assert response.status_code == 200
    assert response.json.get('matching_probability') > 0.0


def test_refresh_token():
    response = app.test_client().post('/api/refresh-token', headers=_auth_header())
    assert response.status_code == 200
    assert response.json.get('access_token', None) is not None


def test_404():
    try:
        app.test_client().get('non-existent-url')
    except NotFound:
        assert NotFound is not None
    else:
        raise Exception('non-existent-url should throw NotFound')
