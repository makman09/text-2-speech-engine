

I'm trying to figure out why I can't seem to get the Flask docker container running for some reason .. instead it just gives me this really weird error .. 

```bash
# How I originally ran the container
docker build -t server .
docker run \
	--env NVIDIA_VISIBLE_DEVICES=all \
	-p 5000:5000 \
	-v ./models:/models \
	-it tts-rest-api-engine_server 
```

Is it possible to create a docker volume from a directory path?

```bash
	docker volume create my-vol
```

