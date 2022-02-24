docker build -f Dockerfile -t plagiarism-detector .
docker run --rm -p 3000:3000 plagiarism-detector
