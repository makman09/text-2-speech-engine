import sys
sys.path.append('waveglow/')

from flask import Flask
import torch

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
model = load_model(hparams)
model.load_state_dict(torch.load(checkpoint_path)['state_dict'])

waveglow_path = '/models/waveglow_256channels_universal_v5.pt'
waveglow = torch.load(waveglow_path)['model']
waveglow.cuda().eval().half()
for k in waveglow.convinv:
    k.float()
denoiser = Denoiser(waveglow)

@app.route('/')
def hello_world():
    return 'Hello, World!'