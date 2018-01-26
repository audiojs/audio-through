# audio-through [![Build Status](https://travis-ci.org/audiojs/audio-through.svg?branch=master)](https://travis-ci.org/audiojs/audio-through) [![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

Audio processor or generator constructor.

[![npm install audio-through](https://nodei.co/npm/audio-through.png?mini=true)](https://npmjs.org/package/audio-through/)

```js
let createThrough = require('audio-through')
let write = require('audio-speaker')()

// panned sine generator
let through = createThrough(
  (channelData, state, ...args) => {
  let [left, right, ...rest] = channelData
  let {time, count, format} = state

  // modify channel data here and/or return new channel data

  return channelData
}, 'stereo audiobuffer')

// hook up createThrough → speaker loop
(function tick () {
	write(through(), tick);
})()
```

### `createThrough(fn, format='array')`

Takes channel processing function and format, returns a function generating audio data of the indicated format.

Output data format can be a string `'planar stereo array'`, `'5.1 audiobuffer 44100'` etc., or an object with format properties. See [audio-format](https://github.com/audiojs/audio-format) for full disclosure.

### `through(target|length=1024)`

Fill passed audio-buffer/array or create a new one of the `length` with throughd samples. Returns data container defined by `options.format`.

## Related

See [audio-through-stream](https://github.com/audiojs/audio-through-stream) for previous (stream) version of audio-through.

## License

(c) 2017 Dmitry Yvanov @ audiojs. MIT License
