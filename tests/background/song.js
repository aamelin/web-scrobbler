'use strict';

/**
 * Tests for Song object.
 */

const expect = require('chai').expect;
const Song = require('../../src/core/background/object/song');

/**
 * Object that contains source data for Song object.
 * @type {Object}
 */
const PARSED_DATA = {
	artist: 'Artist',
	track: 'Track',
	album: 'Album',
	albumArtist: 'AlbumArtist',
	uniqueID: '{4AC45782-0990-4DCC-9FD0-925EC688FF3C}',
	duration: 320,
	currentTime: 5,
	isPlaying: true,
	originUrl: 'https://example.com/play',
	trackArt: 'https://example.com/image.png',
};
/**
 * Object that contains processed song data.
 * @type {Object}
 */
const PROCESSED_DATA = {
	artist: 'Processed Artist',
	track: 'Processed Track',
	album: 'Processed duration',
	albumArtist: 'Processed AlbumArtist',
	duration: 321
};

const DUMMY_CONNECTOR = {
	label: 'Dummy label'
};

/**
 * Create song object.
 * @param  {Object} parsed Object contains custom parsed data values
 * @param  {Object} processed Object contains custom processed data values
 * @return {Object} Processed song object
 */
function createSong(parsed, processed) {
	const parsedDataCopy = Object.assign({}, parsed);
	const song = new Song(parsedDataCopy, DUMMY_CONNECTOR);

	if (processed) {
		for (const field in processed) {
			song.processed[field] = processed[field];
		}
	}

	return song;
}

/**
 * Test if song getters return parsed values.
 */
function testParsedFields() {
	const song = createSong(PARSED_DATA);
	const valuesMap = {
		artist: song.getArtist(),
		track: song.getTrack(),
		album: song.getAlbum(),
		originUrl: song.getOriginUrl(),
		albumArtist: song.getAlbumArtist(),
	};

	for (const key in valuesMap) {
		const expectedValue = PARSED_DATA[key];
		const actualValue = valuesMap[key];

		it(`should return parsed ${key} value`, () => {
			expect(expectedValue).to.be.equal(actualValue);
		});
	}
}

/**
 * Test if song getters return processed values.
 */
function testProcessedFields() {
	const song = createSong(PARSED_DATA, PROCESSED_DATA);
	const valuesMap = {
		albumArtist: song.getAlbumArtist(),
		artist: song.getArtist(),
		track: song.getTrack(),
		album: song.getAlbum(),
	};

	for (const key in valuesMap) {
		const expectedValue = PROCESSED_DATA[key];
		const actualValue = valuesMap[key];

		it(`should return processed ${key} value`, () => {
			expect(expectedValue).to.be.equal(actualValue);
		});
	}
}

function testGetDuration() {
	const parsedDuration = 100;
	const processedDuration = 200;

	it('should return processed duration if no parsed duration', () => {
		const song = createSong({}, { duration: processedDuration });
		expect(song.getDuration()).equals(processedDuration);
	});

	it('should return parsed duration if no processed duration', () => {
		const song = createSong({ duration: parsedDuration }, { duration: processedDuration });
		expect(song.getDuration()).equals(parsedDuration);
	});

	it('should return parsed duration if processed duration available', () => {
		const song = createSong({ duration: parsedDuration }, {});
		expect(song.getDuration()).equals(parsedDuration);
	});
}

function testGetTrackArt() {
	const parsedTrackArt = 'parsed';
	const processedTrackArt = 'processed';

	const song1 = createSong({ trackArt: parsedTrackArt });
	const song2 = createSong({});

	it('should return parsed track art', () => {
		expect(song1.getTrackArt()).equals(parsedTrackArt);
	});

	it('should return null if track art is missing', () => {
		expect(song2.getTrackArt()).to.be.null;
	});

	it('should return parsed track art if processed track art exists', () => {
		const song = createSong({ trackArt: parsedTrackArt });
		song.metadata.trackArtUrl = processedTrackArt;
		expect(song.getTrackArt()).equals(parsedTrackArt);
	});

	it('should return processed track art if parsed track art is missing', () => {
		const song = createSong({});
		song.metadata.trackArtUrl = processedTrackArt;
		expect(song.getTrackArt()).equals(processedTrackArt);
	});
}

function testStaticFields() {
	it('should be an array', () => {
		expect(Song.BASE_FIELDS).to.be.an('array').that.is.not.empty;
	});

	it('should be an array', () => {
		expect(Song.USER_FIELDS).to.be.an('array').that.is.not.empty;
	});
}

function testIsValid() {
	it('should be not valid by default', () => {
		const song = createSong({});
		expect(song.isValid()).to.be.false;
	});

	it('should be valid if it is corrected', () => {
		const song = createSong({});
		song.flags.isCorrectedByUser = true;
		expect(song.isValid()).to.be.true;
	});

	it('should be valid if it is marked as valid', () => {
		const song = createSong({});
		song.flags.isValid = true;
		expect(song.isValid()).to.be.true;
	});
}

function testToString() {
	it('should be not valid by default', () => {
		const song = createSong({});
		expect(song.toString()).to.be.a('string');
	});
}

function testSetLoveStatus() {
	it('should return true if `setLoveStatus` called with true', () => {
		const song = createSong({});
		song.setLoveStatus(true);

		expect(song.metadata.userloved).to.be.true;
	});

	it('should return false if one of services set it to false', () => {
		const song = createSong({});
		song.setLoveStatus(true);
		song.setLoveStatus(false);

		expect(song.metadata.userloved).to.be.false;
	});

	it('should return false if one of services set it to false', () => {
		const song = createSong({});
		song.setLoveStatus(false);
		song.setLoveStatus(true);

		expect(song.metadata.userloved).to.be.false;
	});

	it('should return proper value if `force` param is used', () => {
		const song = createSong({});
		song.setLoveStatus(false);
		song.setLoveStatus(true, { force: true });

		expect(song.metadata.userloved).to.be.true;
	});
}

function testResetData() {
	it('should reset flags and metadata', () => {
		const song = createSong({});

		song.flags.isCorrectedByUser = true;
		song.metadata.notificationId = 123;

		expect(song.flags.isCorrectedByUser).to.be.true;
		expect(song.metadata.notificationId).equals(123);

		song.resetData();

		expect(song.flags.isCorrectedByUser).to.be.false;
		expect(song.metadata.notificationId).to.be.undefined;
	});
}

function testResetInfo() {
	const song = createSong(PARSED_DATA, PROCESSED_DATA);
	song.resetInfo();

	const valuesMap = {
		albumArtist: song.getAlbumArtist(),
		artist: song.getArtist(),
		track: song.getTrack(),
		album: song.getAlbum(),
	};

	for (const key in valuesMap) {
		const expectedValue = PARSED_DATA[key];
		const actualValue = valuesMap[key];

		it(`should return processed ${key} value`, () => {
			expect(expectedValue).to.be.equal(actualValue);
		});
	}
}

function testGetCloneableData() {
	it('should return a copy of song', () => {
		const song = createSong(PARSED_DATA, PROCESSED_DATA);

		song.setLoveStatus(true);
		song.flags.isCorrectedByUser = true;

		const copy = song.getCloneableData();
		for (const field of ['parsed', 'processed', 'flags', 'metadata']) {
			expect(copy[field]).to.be.deep.equal(song[field]);
		}
	});
}

function testEquals() {
	const song1 = createSong({
		artist: 'Artist', track: 'Title', album: 'Album',
		uniqueID: 'uniqueId1'
	});
	const song2 = createSong({
		artist: 'Artist', track: 'Title', album: 'Album',
		uniqueID: 'uniqueId1'
	});
	const song3 = createSong({
		artist: 'Artist', track: 'Title', album: 'Album',
		uniqueID: 'uniqueId3'
	});

	it('should equal itself', () => {
		expect(song1.equals(song1)).to.be.true;
	});
	it('should equal another song with the same uniqueId', () => {
		expect(song1.equals(song2)).to.be.true;
	});
	it('should not equal song with the different uniqueId', () => {
		expect(song1.equals(song3)).to.be.false;
	});
	it('should not equal null value', () => {
		expect(song1.equals(null)).to.be.false;
	});
	it('should not equal non-song object', () => {
		expect(song1.equals(23)).to.be.false;
	});
}

/**
 * Test 'Song.isEmpty' function.
 */
function testIsEmpty() {
	it('should return true if song has no metadata', () => {
		const songs = [
			createSong({ artist: 'Artist', track: null }),
			createSong({ artist: null, track: 'Track' }),
			createSong({ artist: null, track: null })
		];

		for (const song of songs) {
			expect(song.isEmpty()).to.be.true;
		}
	});

	it('should return false if song has metadata', () => {
		const song = createSong(PARSED_DATA);
		expect(song.isEmpty()).to.be.false;
	});
}

function testGetUniqueId() {
	it('should return unique ID if song has parsed unique ID', () => {
		const uniqueId = 'unique';
		const song = createSong({
			artist: 'Artist', track: 'Title', album: 'Album',
			uniqueID: uniqueId
		});
		expect(song.getUniqueId()).to.be.equal(uniqueId);
	});

	it('should return unique ID if song has no parsed unique ID', () => {
		const uniqueId = '8021e94350ed56f71a673b08eaea0888';
		const song = createSong({
			artist: 'Artist', track: 'Title', album: 'Album'
		});
		expect(song.getUniqueId()).to.be.equal(uniqueId);
	});

	it('should not return unique ID if song is empty', () => {
		const song = createSong({});
		expect(song.getUniqueId()).to.be.null;
	});
}

function testGetArtistTrackString() {
	it('should return `Artist - Track` string if song has metadata', () => {
		const song = createSong({ artist: 'Artist', track: 'Track' });
		expect(song.getArtistTrackString()).to.be.equal('Artist — Track');
	});
	it('should return null value if song is empty', () => {
		const song = createSong({ artist: null, track: null });
		expect(song.getArtistTrackString()).to.be.null;
	});
}

/**
 * Run all tests.
 */
function runTests() {
	describe('parsedData', testParsedFields);
	describe('processedData', testProcessedFields);
	describe('static fields', testStaticFields);

	describe('equals', testEquals);
	describe('isValid', testIsValid);
	describe('isEmpty', testIsEmpty);
	describe('toString', testToString);
	describe('resetData', testResetData);
	describe('resetInfo', testResetInfo);
	describe('getUniqueId', testGetUniqueId);
	describe('getTrackArt', testGetTrackArt);
	describe('getDuration', testGetDuration);
	describe('setLoveStatus', testSetLoveStatus);
	describe('getCloneableData', testGetCloneableData);
	describe('getArtistTrackString', testGetArtistTrackString);
}

runTests();
