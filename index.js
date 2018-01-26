/**
 * @module  audio-through
 */
'use strict';

const convert = require('pcm-convert')
const aformat = require('audio-format')
const createBuffer = require('audio-buffer-from')
const isAudioBuffer = require('is-audio-buffer')
const defined = require('defined')

module.exports = createThrough

function createThrough (fn, format) {
	if (!format) format = 'array mono 44100'

	format = typeof format === 'string' ? aformat.parse(format) : aformat.detect(format)
	format.length = defined(format.length, format.frame, format.block, format.samplesPerFrame, format.frameSize, format.frameLength, format.blockSize, format.blockLength, 1024)

	let state = {
		count: 0,
		time: 0,
		format: format
	}

	// fill passed source with oscillated data
	function through (dst, ...args) {
		let buf = dst

		if (buf == null) buf = format.length

		//make sure we deal with audio buffer
		if (!isAudioBuffer(buf)) {
			buf = createBuffer(buf, format)
		}

		// fill channels
		let data

		// audio-buffer interception hack
		if (buf._channelData) {
			data = buf._channelData
		}
		else {
			data = []
			for (let c = 0, l = buf.numberOfChannels; c < l; c++) {
				data[c] = buf.getChannelData(c)
			}
		}

		state.time = state.count / state.format.sampleRate
		let count = state.count

		// generate data by generating function
		fn(data, state, ...args)

		state.count = count + data[0].length

		// convert to target dtype
		if (format.type === 'audiobuffer') return buf
		if (dst && dst.length) return convert(buf, format, dst)
		return convert(buf, format)
	}

	return through
}
