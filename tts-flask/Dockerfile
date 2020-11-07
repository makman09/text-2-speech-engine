FROM ufoym/deepo:pytorch-py36-cu101

ENV APP /code
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8
ENV FLASK_ENV development

RUN mkdir /models
WORKDIR $APP

EXPOSE 5000

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENV FLASK_APP app.py

CMD ["flask", "run", "--host", "0.0.0.0", "-p", "5000"]