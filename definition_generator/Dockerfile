From python:3.6

# We install first dependences in order to reuse more often containers layers
COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .