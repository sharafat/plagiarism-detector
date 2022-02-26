# Plagiarism Detector

This is a simple Python-Flusk-React application to detect plagiarism using Rabin-Karp string searching algorithm.

## Building and running the application
1. Clone repo: `git clone https://github.com/sharafat/plagiarism-detector.git` 
2. Change directory to `plagiarism-detector`
3. Build application: `docker build -f Dockerfile -t plagiarism-detector .`
4. Run application: `docker run --rm -p 3000:3000 plagiarism-detector`
5. Browse using a web browser: `http://localhost:3000`
6. Log in using the credential: email = `demo@demo.com` / password = `demo`

## Running on Dev Environment with Hot Reloading
1. Clone repo: `git clone https://github.com/sharafat/plagiarism-detector.git`
2. Change directory to `plagiarism-detector/api` and run `flask run --no-debugger` to start the back-end.
3. Open another terminal tab/window, change directory to `plagiarism-detector` and run `yarn start` to start the front-end.
4. Browse using a web browser: `http://localhost:3000`
6. Log in using the credential: email = `demo@demo.com` / password = `demo`

## Running tests with coverage
1. Change directory to `plagiarism-detector/api`
2. Run tests with coverage: `coverage run --source=api,services -m pytest && coverage report -m`
3. Output should be like the following:
```
tests/test_apis.py .........                            [100%]

================== 9 passed in 0.76s =========================
Name                            Stmts   Miss  Cover   Missing
-------------------------------------------------------------
api.py                             66      0   100%
services/DB.py                     21      0   100%
services/PlagiarismChecker.py      46      0   100%
services/RabinCarp.py              29      0   100%
-------------------------------------------------------------
TOTAL                             162      0   100%
```

## Demo
![](https://i.imgur.com/Aw4gcmE.png)
![](https://i.imgur.com/EvKTNbB.png)
![](https://i.imgur.com/k7nnkyR.png)
![](https://i.imgur.com/hZ83pXN.png)
![](https://i.imgur.com/PFivwdK.png)
![](https://i.imgur.com/iYddmOa.png)
