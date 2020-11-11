import sys
sys.path.append('waveglow/')

from flask import Flask, request, jsonify, send_file
import json
import numpy as np
from scipy.io.wavfile import write
import torch
from uuid import uuid4

from hparams import create_hparams
from model import Tacotron2
from layers import TacotronSTFT, STFT
from audio_processing import griffin_lim
from train import load_model
from text import text_to_sequence
from denoiser import Denoiser

app = Flask(__name__)

hparams = create_hparams()
hparams.sampling_rate = 22050

checkpoint_path = "/models/attenborough_checkpoint_824800"
checkpoint_path = "/models/Celestia_24988_0.071"
model = load_model(hparams)
model.load_state_dict(torch.load(checkpoint_path)['state_dict'])

waveglow_path = '/models/waveglow_256channels_universal_v5.pt'
waveglow = torch.load(waveglow_path)['model']
waveglow.cuda().eval()
for k in waveglow.convinv:
    k.float()
denoiser = Denoiser(waveglow)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/sample/<file_id>', methods=['GET'])
def get_sample(file_id):
    # TODO: check if file exists

    return send_file(
        "/tmp/{}.wav".format(file_id),
        mimetype="audio/wav",
        as_attachment=True,
        attachment_filename="test.wav"
    )

@app.route('/inference', methods=['POST'])
def inference():
    data = json.loads(request.data)
    text = data.get("text")
    filename = uuid4().hex

    # Convert text into vector
    sequence = np.array(
        text_to_sequence(text, ['english_cleaners'])
    )[None, :]
    sequence = torch.autograd.Variable(
        torch.from_numpy(sequence)
    ).cuda().long()

    # Infer mel spectrogram from input vector
    mel_outputs, mel_outputs_postnet, _, alignments = model.inference(
        sequence
    )

    with torch.no_grad():
        audio = waveglow.infer(mel_outputs_postnet, sigma=1)
        audio_denoised = denoiser(audio, strength=0.005)[:, 0]

    # Write to file
    write(
        '/tmp/{}.wav'.format(filename),
        hparams.sampling_rate,
        # audio[0].data.cpu().numpy()
        audio_denoised.cpu().numpy()[0]
    )

    return jsonify({
        "status": "success",
        "messsage": "we got it dude",
        "link": filename
    })