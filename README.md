# Plagiarism Detector

This is a sample Python-Flusk-React application to detect plagiarism using a naive algorithm.

## Building and running the application
1. Clone repo: `git clone https://github.com/sharafat/plagiarism-detector.git` 
2. Change directory to `plagiarism-detector`
3. Build application: `docker build -f Dockerfile -t plagiarism-detector .`
4. Run application: `docker run --rm -p 3000:3000 plagiarism-detector`
5. Browse using a web browser: `http://localhost:3000`

## Running tests with coverage
1. Change directory to `plagiarism-detector/api`
2. Run tests with coverage: `coverage run --source=api,services -m pytest && coverage report -m`
