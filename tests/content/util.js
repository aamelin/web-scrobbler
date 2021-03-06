'use strict';

/**
 * Tests for 'util' module.
 */

const expect = require('chai').expect;
const Util = require('../../src/core/content/util');

/**
 * Test data is an array of objects. Each object must contain
 * three fields: 'description', 'args' and 'expected'.
 *
 * 'description' is a test description used by 'it' function.
 * 'args' is an function arguments that used to test function.
 * 'expected' is an expected value of function result.
 */

/**
 * Test data for testing 'Util.splitArtistTrack' function.
 * @type {Array}
 */
const SPLIT_ARTIST_TRACK_DATA = [{
	description: 'should return empty result for empty input',
	args: ['', null, { swap: false }],
	expected: { artist: null, track: null },
}, {
	description: 'should return empty result for null input',
	args: [null, null, { swap: false }],
	expected: { artist: null, track: null },
}, {
	description: 'should split artist and track w/o swap and separators',
	args: ['Artist - Track'],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should split artist and track',
	args: ['Artist - Track', null, { swap: false }],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should split artist and track by custom separator',
	args: ['Artist * Track', [' * '], { swap: false }],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should not split malformed string',
	args: ['Artist & Track', null, { swap: false }],
	expected: { artist: null, track: null },
}, {
	description: 'should split artist and track, and swap them',
	args: ['Track - Artist', null, { swap: true }],
	expected: { artist: 'Artist', track: 'Track' },
}];

/**
 * Test data for testing 'Util.escapeBadTimeValues' function.
 * @type {Array}
 */
const ESCAPE_BAD_TIME_VALUES_DATA = [{
	description: 'should round float number',
	args: [3.25],
	expected: 3
}, {
	description: 'should return null for NaN',
	args: [NaN],
	expected: null
}, {
	description: 'should return null for Infinity',
	args: [Infinity],
	expected: null
}, {
	description: 'should return null for -Infinity',
	args: [-Infinity],
	expected: null
}, {
	description: 'should return integer number as is',
	args: [3],
	expected: 3
}, {
	description: 'should return null for other input',
	args: [[]],
	expected: null
}];

/**
 * Test data for testing 'Util.stringToSeconds' function.
 * @type {Array}
 */
const STRING_TO_SECONDS_DATA = [{
	description: 'should trim string and parse time',
	args: ['01:10:30 '],
	expected: 4230
}, {
	description: 'should parse time in hh:mm:ss format',
	args: ['01:10:30'],
	expected: 4230
}, {
	description: 'should parse negative time',
	args: ['-01:10'],
	expected: -70
}, {
	description: 'should parse time in mm:ss format',
	args: ['05:20'],
	expected: 320
}, {
	description: 'should parse time in ss format',
	args: ['20'],
	expected: 20
}, {
	description: 'should not parse empty string',
	args: [''],
	expected: 0
}, {
	description: 'should not parse null value',
	args: [null],
	expected: 0
}, {
	description: 'should not parse malformed format',
	args: [NaN],
	expected: 0
}];

/**
 * Test data for testing 'Util.extractUrlFromCssProperty' function.
 * @type {Array}
 */
const EXRACT_URL_FROM_CSS_PROPERTY_DATA = [{
	description: 'should extract URL from CSS property (double quotes)',
	args: ['url("http://example.com/image.png")'],
	expected: 'http://example.com/image.png'
}, {
	description: 'should extract URL from CSS property (single quotes)',
	args: ['url(\'http://example.com/image.png\')'],
	expected: 'http://example.com/image.png'
}, {
	description: 'should extract URL from CSS property (no quotes)',
	args: ['url(http://example.com/image.png)'],
	expected: 'http://example.com/image.png'
}, {
	description: 'should extract URL from shorthand CSS property',
	args: ['#ffffff url("http://example.com/image.png") no-repeat right top;'],
	expected: 'http://example.com/image.png'
}, {
	description: 'should return null for malformed CSS property',
	args: ['whatever'],
	expected: null
}, {
	description: 'should return null for null',
	args: [null],
	expected: null
}];

/**
 * Test data for testing 'Util.getYtVideoIdFromUrl' function.
 * @type {Array}
 */
const GET_YT_VIDEO_ID_FROM_URL_DATA = [{
	description: 'should return null for null input',
	args: [null],
	expected: null,
}, {
	description: 'should return null for empty input',
	args: [''],
	expected: null,
}, {
	description: 'should return null for invalid input',
	args: ['Invalid input'],
	expected: null,
}, {
	description: 'should return video ID from URL',
	args: ['https://www.youtube.com/watch?v=JJYxNSRX6Oc'],
	expected: 'JJYxNSRX6Oc',
}, {
	description: 'should return video ID from URL with several params',
	args: ['https://www.youtube.com/watch?v=JJYxNSRX6Oc&t=92s'],
	expected: 'JJYxNSRX6Oc',
}, {
	description: 'should return video ID from URL when "v" param is in the end of query',
	args: ['https://www.youtube.com/watch?list=PLjTdkvaV6GM-J-6PHx9Cw5Cg2tI5utWe7&v=ALZHF5UqnU4'],
	expected: 'ALZHF5UqnU4',
}, {
	description: 'should return video ID from short URL',
	args: ['https://youtu.be/Mssm8Ml5sOo'],
	expected: 'Mssm8Ml5sOo',
}, {
	description: 'should return video ID from embed video URL',
	args: ['https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&origin=http://example.com'],
	expected: 'M7lc1UVf-VE',
}];

/**
 * Test data for testing 'Util.processYtVideoTitle' function.
 * @type {Array}
 */
const PROCESS_YT_VIDEO_TITLE_DATA = [{
	description: 'should return null for empty input',
	args: [''],
	expected: { artist: null, track: null },
}, {
	description: 'should return null for null input',
	args: [null],
	expected: { artist: null, track: null },
}, {
	description: 'should process YouTube title',
	args: ['Artist - Track'],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should remove [genre] from the beginning of the title',
	args: ['[Genre] Artist - Track'],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should remove 【genre】 from the beginning of the title',
	args: ['【Genre】 Artist - Track'],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process text string w/o separators',
	args: ['Artist "Track"'],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process Japanese tracks',
	args: ['Artist「Track」'],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process inverted tracks with parens',
	args: ['Track (by Artist)'],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process inverted tracks with parens and comments',
	args: ['Track (cover by Artist) Studio'],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process inverted tracks with parens original artist',
	args: ['Original Artist - Track (cover by Artist)'],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process tracks with seperators and quotes',
	args: ['Artist - "Track Name"'],
	expected: { artist: 'Artist', track: 'Track Name' }
}, {
	description: 'should process tracks with seperators without leading whitespace and quotes',
	args: ['Artist: "Track Name"'],
	expected: { artist: 'Artist', track: 'Track Name' }
}, {
	description: 'should use title as track title',
	args: ['Track Name'],
	expected: { artist: null, track: 'Track Name' }
}];

/**
 * Test data for testing 'Util.processSoundCloudTrack' function.
 * @type {Array}
 */
const PROCESS_SOUNDCLOUD_TRACK_DATA = [{
	description: 'should process SoundCloud title (hyphen)',
	args: ['Artist - Track'],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process SoundCloud title (en dash)',
	args: ['Artist \u2013 Track'],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process SoundCloud title (em dash)',
	args: ['Artist \u2014 Track'],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should process SoundCloud title (horizontal bar)',
	args: ['Artist \u2015 Track'],
	expected: { artist: 'Artist', track: 'Track' },
}, {
	description: 'should use title as track title',
	args: ['Track Name'],
	expected: { artist: null, track: 'Track Name' }
}];

/**
 * Test data for testing 'Util.splitTimeInfo' function.
 *
 * This test data contains additions properties: 'swap' and 'separators'.
 * These properties are uses as arguments of 'splitTimeInfo' function.
 * @type {Array}
 */
const SPLIT_TIME_INFO_DATA = [{
	description: 'should split time info',
	args: ['01:00 / 03:00'],
	expected: { currentTime: 60, duration: 180 },
}, {
	description: 'should split time info',
	args: ['01:00 / 03:00', ['/'], { swap: false }],
	expected: { currentTime: 60, duration: 180 },
}, {
	description: 'should split time info and swap values',
	args: ['03:00 / 01:00', ['/'], { swap: true }],
	expected: { currentTime: 60, duration: 180 },
}, {
	description: 'should not split malformed time info text',
	args: ['01:10:30', ['/'], { swap: false }],
	expected: { currentTime: null, duration: null },
}];

const FIND_SEPARATOR_DATA = [{
	description: 'should return null for null input',
	args: [null],
	expected: null,
}, {
	description: 'should return null for empty input',
	args: [''],
	expected: null,
}, {
	description: 'should find separator',
	args: ['Key : Var'],
	expected: { index: 4, length: 1 },
}, {
	description: 'should find custom separator',
	args: ['Key * Var', [' * ']],
	expected: { index: 3, length: 3 },
}, {
	description: 'should not find separator if no separator in string',
	args: ['Key 2 Var'],
	expected: null,
}];

const IS_ARTIST_TRACK_EMPTY_DATA = [{
	description: 'should return true for null result',
	args: [null],
	expected: true
}, {
	description: 'should return true for empty Artist-Track pair',
	args: [{ artist: null, track: null }],
	expected: true
}, {
	description: 'should return false if field is missing',
	args: [{ artist: 'Artist', track: null }],
	expected: true
}, {
	description: 'should return false for non-empty Artist-Track pair',
	args: [{ artist: 'Artist', track: 'Track' }],
	expected: false
}];

const GET_MEDIASESSION_INFO_DATA = [{
	description: 'should return null for null input',
	args: [null],
	expected: null
}, {
	description: 'should return null if MediaMetadata is missing',
	args: [{ mediaMetadata: null }],
	expected: null
}, {
	description: 'should return track info if MediaMetadata available',
	args: [{
		metadata: {
			artist: 'Artist', title: 'Track', album: 'Album',
			artwork: [{
				sizes: '32x32', type: 'image/png', src: 'url1'
			}, {
				sizes: '64x64', type: 'image/png', src: 'url2'
			}]
		}
	}],
	expected: {
		artist: 'Artist', track: 'Track', album: 'Album', trackArt: 'url2',
	}
}, {
	description: 'should return track info if artwork is missing',
	args: [{
		metadata: {
			artist: 'Artist', title: 'Track', album: 'Album',
		}
	}],
	expected: {
		artist: 'Artist', track: 'Track', album: 'Album', trackArt: null,
	}
}];

const JOIN_ARTISTS_DATA = [{
	description: 'should return null for null',
	args: [null],
	expected: null,
}, {
	description: 'should return null for empty array',
	args: [[]],
	expected: null,
}, {
	description: 'should return list of artist for valid input',
	args: [[{ textContent: 'Artist 1' }]],
	expected: 'Artist 1'
}, {
	description: 'should return list of artist for valid input',
	args: [[{ textContent: 'Artist 1' }, { textContent: 'Artist 2' }]],
	expected: 'Artist 1, Artist 2'
}];

const FILL_EMPTY_FIELDS = [{
	description: 'should return target if source element is null',
	args: [
		{ artist: 'Artist', track: 'Track' }, null, [],
	],
	expected: { artist: 'Artist', track: 'Track' }
}, {
	description: 'should return target if fields arg is null',
	args: [
		{ artist: 'Artist', track: 'Track' }, { artist: 'New Artist' }, null,
	],
	expected: { artist: 'Artist', track: 'Track' }
}, {
	description: 'should not modify target if fields arg is empty',
	args: [
		{ artist: 'Artist', track: 'Track' }, { artist: 'New Artist' }, [],
	],
	expected: { artist: 'Artist', track: 'Track' }
}, {
	description: 'should not modify target if source field is missing',
	args: [
		{ track: 'Track' }, {}, ['artist'],
	],
	expected: { track: 'Track' }
}, {
	description: 'should not modify target if field exists',
	args: [
		{ artist: 'Artist', track: 'Track' }, { artist: 'New Artist' }, ['artist'],
	],
	expected: { artist: 'Artist', track: 'Track' }
}, {
	description: 'should modify target if field is missing',
	args: [
		{ track: 'Track' }, { artist: 'New Artist' }, ['artist'],
	],
	expected: { artist: 'New Artist', track: 'Track' }
}];

const YT_DESCRIPTION_EXAMPLE_1 = `Provided to YouTube by IDOL

Tranquility (Forces of Nature Remix) · Aquasky

Shadow Era, Pt. 2

℗ Passenger Ltd

Released on: 2015-10-09

Lyricist: B. Newitt
Lyricist: D. Wallace
Lyricist: K. Bailey
Composer: B. Newitt
Composer: D. Wallace
Composer: K. Bailey

Auto-generated by YouTube.`;

const YT_DESCRIPTION_EXAMPLE_2 = `Capoeira (Airbase pres. Scarab Remix) · Under Sun

Capoeira

℗ Armada Music B.V.

Released on: 2006-08-21

A R T I S T: Under Sun

Auto-generated by YouTube.`;

const YT_DESCRIPTION_EXAMPLE_3 = `Provided to YouTube by The Orchard Enterprises

Fugitive · Time, The Valuator · Mattéo Gelsomino

How Fleeting, How Fragile

℗ 2018 Long Branch Records

Released on: 2018-08-03

Auto-generated by YouTube.`;

const YT_DESCRIPTION_EXAMPLE_4 = `Provided to YouTube by The Orchard Enterprises

Fugitive

How Fleeting, How Fragile

Auto-generated by YouTube.`;

const PARSE_YT_VIDEO_DESCRIPTION_DATA = [{
	description: 'should not parse null description',
	args: [null],
	expected: null
}, {
	description: 'should parse normal description',
	args: [YT_DESCRIPTION_EXAMPLE_1],
	expected: {
		album: 'Shadow Era, Pt. 2',
		track: 'Tranquility (Forces of Nature Remix)',
		artist: 'Aquasky',
	}
}, {
	description: 'should parse description w/o "Autogenerated" header',
	args: [YT_DESCRIPTION_EXAMPLE_2],
	expected: {
		album: 'Capoeira',
		track: 'Capoeira (Airbase pres. Scarab Remix)',
		artist: 'Under Sun',
	}
}, {
	description: 'should parse description w/ featuring artists',
	args: [YT_DESCRIPTION_EXAMPLE_3],
	expected: {
		album: 'How Fleeting, How Fragile',
		track: 'Fugitive (feat. Mattéo Gelsomino)',
		artist: 'Time, The Valuator',
	}
}, {
	description: 'should parse description w/o artist',
	args: [YT_DESCRIPTION_EXAMPLE_4],
	expected: {
		album: 'How Fleeting, How Fragile',
		track: 'Fugitive',
		artist: null,
	}
}];

const testData = [{
	func: Util.joinArtists,
	data: JOIN_ARTISTS_DATA,
}, {
	func: Util.splitTimeInfo,
	data: SPLIT_TIME_INFO_DATA,
}, {
	func: Util.findSeparator,
	data: FIND_SEPARATOR_DATA,
}, {
	func: Util.stringToSeconds,
	data: STRING_TO_SECONDS_DATA
}, {
	func: Util.fillEmptyFields,
	data: FILL_EMPTY_FIELDS,
}, {
	func: Util.splitArtistTrack,
	data: SPLIT_ARTIST_TRACK_DATA,
}, {
	func: Util.isArtistTrackEmpty,
	data: IS_ARTIST_TRACK_EMPTY_DATA,
}, {
	func: Util.getYtVideoIdFromUrl,
	data: GET_YT_VIDEO_ID_FROM_URL_DATA
}, {
	func: Util.escapeBadTimeValues,
	data: ESCAPE_BAD_TIME_VALUES_DATA,
}, {
	func: Util.processYtVideoTitle,
	data: PROCESS_YT_VIDEO_TITLE_DATA,
}, {
	func: Util.getMediaSessionInfo,
	data: GET_MEDIASESSION_INFO_DATA,
}, {
	func: Util.processSoundCloudTrack,
	data: PROCESS_SOUNDCLOUD_TRACK_DATA,
}, {
	func: Util.parseYtVideoDescription,
	data: PARSE_YT_VIDEO_DESCRIPTION_DATA,
}, {
	func: Util.extractUrlFromCssProperty,
	data: EXRACT_URL_FROM_CSS_PROPERTY_DATA,
}];

/**
 * Test function.
 * @param  {Function} func Function to be tested
 * @param  {Array} testData Array of test data
 */
function testFunction(func, testData) {
	const boundFunc = func.bind(Util);

	for (const data of testData) {
		const { description, args, expected } = data;
		if (args === undefined) {
			throw new Error(`${description}: function arguments are missing`);
		}

		const actual = boundFunc(...args);
		it(description, () => {
			expect(actual).to.be.deep.equal(expected);
		});
	}
}

/**
 * Run all tests.
 */
function runTests() {
	for (const entry of testData) {
		const { func, data, isDeepEqual } = entry;
		const description = func.name;

		describe(description, () => {
			testFunction(func, data, { isDeepEqual });
		});
	}
}

runTests();
