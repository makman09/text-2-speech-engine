import { AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
// import * as WaveSurfer from 'wavesurfer.js';
import WaveSurfer from 'wavesurfer.js';

import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import Regions from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';

import { RestAPIService } from './rest-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  text: string = "Help everyone fend for themselves or I won't be able to myself.";
  textMax = 200;

  sampleLink: string = null;
  wavesurfer: any;

  hasSampleLoaded: boolean = false;
  loading: boolean = false;

  constructor(
    private apiService: RestAPIService
  ) { }

  ngAfterViewInit() {

    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      fillParent: false,
      // Define a minimum amount of pixels that should be used
      // to draw a single second of the sound. This defines a
      // specific width to the
      minPxPerSec: 150,
      waveColor: "#9DD9D9",
      height: 200,
      barHeight: 5 
    });
    this.wavesurfer.empty();
    this.wavesurfer.setHeight(0);
  }

  /**
   * Dummy test function to validate wavesurfer.js
   */
  dummySampleValidation() {
    this.wavesurfer.load('http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');
    this.wavesurfer.on('ready', () => { /** Dead code */ });
  }

  playPause() {
    this.wavesurfer.playPause();
  }

  /**
   * Perform inference on text input
   * to generate sample speech
   */
  generate() {
    this.hasSampleLoaded = false;
    this.loading = true;
    this.wavesurfer.empty();
    this.wavesurfer.setHeight(0);

    // Submit request to web service
    this.apiService.inference(this.text)
      .subscribe(resp => {
        console.log('success', resp);

        this.sampleLink = `/api/sample/${resp["link"]}`;
        this.wavesurfer.load(this.sampleLink);
        this.wavesurfer.setHeight(200);

        this.loading = false;
        this.hasSampleLoaded = true;
      });

  }
}
