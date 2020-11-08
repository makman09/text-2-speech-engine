import { AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as WaveSurfer from 'wavesurfer.js';
import { RestAPIService } from './rest-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  text: string = '';
  textMax = 200;

  link: string = null;
  wavesurfer: any;

  constructor(
    private apiService: RestAPIService
  ) { }

  ngAfterViewInit() {

    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      // Prevent autosize
      fillParent: false,
      // Define a minimum amount of pixels that should be used
      // to draw a single second of the sound. This defines a
      // specific width to the
      minPxPerSec: 10
    });
  }

  load() {
    this.wavesurfer.load('http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');
    this.wavesurfer.on('ready', () => { /** Dead code */ });
  }

  playPause() {
    this.wavesurfer.playPause();
  }

  generate() {
    this.apiService.inference(this.text)
      .subscribe(resp => {
        console.log('success', resp);

        this.link = resp["link"]
        this.wavesurfer.load(`/api/sample/${this.link}`);
      });
  }
}
