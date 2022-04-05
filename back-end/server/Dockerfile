# syntax=docker/dockerfile:1
FROM python:3.9
WORKDIR /back-end/server
ENV PYTHONPATH "${PYTHONPATH}:/back-end/server/"
COPY ./requirements.txt /server/requirements.txt 
RUN pip install --no-cache-dir --upgrade -r /server/requirements.txt
COPY . /back-end/server
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "5000"]
