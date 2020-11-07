import { AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'tts-angular';

  wavesurfer: any;

  ngOnInit() {

  }

  ngAfterViewInit() {
    const textMax = 200;
    $('#count_message').html('0 / ' + textMax );

    $('#text').keyup(() => {
      const textLength = ($('#text').val() as string).length;
      const textRemaining = textMax - textLength;

      $('#count_message').html(textLength + ' / ' + textMax);
    });

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
    this.wavesurfer.on('ready', () => {
      // console.log('ahoy matey')
      // this.wavesurfer.play();
    });
  }

  playPause() {
    this.wavesurfer.playPause();
  }
}
