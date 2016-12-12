'use strict';
var grunt = require('grunt');
var path = require('path');
var RequireCacheClear = require('../lib/RequireCacheClear').RequireCacheClear;
var modulefiles = [
    'testinc/inc/testrequire1.js',
    'testinc/inc/testrequire2.js'];
modulefiles = [
    'glob/sync.js',
    'glob/node_modules/minimatch/minimatch.js'];
var localfiles = [
    'test/testinc2/inc/testrequire1.js',
    'test/testinc2/inc/testrequire2.js'
];
var modulewildfiles = 'testinc/inc/**.js';
var localwildfiles = 'test/testinc2/inc/**.js';
/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.require_cache_clear = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    is_RequireCacheClear_function: function(test){
        test.expect(1);
        var actual = (typeof RequireCacheClear === 'function');
        test.equal(actual, true, 'RequireCacheClear is a function');
        test.done(); },
    is_RequireCacheClear_object: function(test){
        test.expect(1);
        var actual = new RequireCacheClear();
        test.equal(actual instanceof RequireCacheClear, true, 'RequireCacheClear can create a new instance');
        test.done(); },
    is_RequireCacheClear_clearAll: function(test){
        test.expect(1);
        var a = new RequireCacheClear({files:{src: []}, options:{clearAll: true}});
        a.run();
        var actual = a.getCacheLength();
        test.equal(actual, 0, 'RequireCacheClear with clearAll set to true clears all of require.cache');
        test.done();
    },
    is_RequireCacheClear_constructionString: function(test){
        var testname = 'morris.js',
            a = new RequireCacheClear(testname);
        test.equal(a.files.src[0] === testname, 1, 'RequireCacheClear files set correctly when supplied a string');
        test.done(); },
    is_RequireCacheClear_constructionArray: function(test){
        var testnames = ['morris.js', 'cheese.js'],
            a = new RequireCacheClear(testnames),
            actual = (a.files.src.length === 2 && a.files.src[0] === testnames[0] && a.files.src[1] === testnames[1]) ? true : false;
        test.equal(actual, 1, 'RequireCacheClear files set correctly when supplied an array'); 
        test.done(); },
    /**
    is_RequireCacheClear_constructionObject: function(test){
        var tester = {
                files : ['morris.js', 'cheese.js']},
            a = new RequireCacheClear(tester),
            actual = (a.files.src.length === 2 && a.files.src[0] === tester.files[0] && a.files.src[1] === tester.files[1]) ? true : false;
        test.equal(actual, 1, 'RequireCacheClear files are set correctly when supplied an object.files'); 
        test.done();
    },**/
    is_RequireCacheClear_constructionStringString: function(test){
        var b1 = 'morris.js',
            b2 = 'cheese.js',
            a = new RequireCacheClear(b1, b2),
            actual = (a.files.src.length === 1 && a.files.src[0] === b1 && a.options.ignoreFiles.src.length === 1 && a.options.ignoreFiles.src[0] === b2) ? true : false;
        test.equal(actual, 1, 'RequireCacheClear files and ignore are set up correctly when suppling each with a string');
        test.done(); },
    is_RequireCacheClear_ignoreArray: function(test){
        var b1 = 'morris.js',
            b2 = ['cheese.js', 'toast.js', 'beans.js'],
            a = new RequireCacheClear(b1, b2),
            actual = (a.options.ignoreFiles.src.length === 3 && a.options.ignoreFiles.src[0] === b2[0] && a.options.ignoreFiles.src[1] === b2[1] && a.options.ignoreFiles.src[2] === b2[2]) ? true : false;
        test.equal(actual, 1, 'RequireCacheClear files and ignore are set up correctly when ignoreFiles parameter is supplied as an array');
        test.done(); },
    is_RequireCacheClear_ignoreObject: function(test){
        var b1 = {
                files: 'morris.js',
                options: {
                    ignoreFiles: {
                        src: ['cheese.js', 'toast.js', 'beans.js'],
                        clearAll: false
                    }}},
            a = new RequireCacheClear(b1),
            actual = (a.options.ignoreFiles.src.length === 3) ? true : false;
        test.equal(actual, 1, 'RequireCacheClear files and ignore are set up correctly when supplied as part of an object');
        test.done();
    },
    is_RequireCacheClear_clearSingleFile: function(test){
        test.expect(1);
        var testname = modulefiles[0],
            re = require.resolve(testname),
            t1 = require(testname),
            found = false,
            a = new RequireCacheClear(testname);
        a.run();
        for(var prop in require.cache){ 
            if(require.cache.hasOwnProperty(prop) && prop == re){ 
                found = true; break; }}
        test.equal(found, false, 'RequireCacheClear clears a single file when specified');
        test.done(); },
    is_RequireCacheClear_clearSeveralFiles: function(test){
        test.expect(1);
        var testnames = [modulefiles[0], modulefiles[1]];
        var t1 = require(modulefiles[0]),
            t2 = require(modulefiles[1]),
            r1 = require.resolve(modulefiles[0]),
            r2 = require.resolve(modulefiles[1]);
        var a = new RequireCacheClear({files:{src:testnames}});
        a.run();
        var found = false;
        for(var prop in require.cache){
            if(require.cache.hasOwnProperty(prop) && (prop === r1 || prop === r2)){ found = true; break; }}
        test.equal(found, false, 'RequireCacheClear clears several files when specified in an array');
        test.done();
    },
    is_RequireCacheClear_localFiles: function(test){
        test.expect(1);
        var testnames = localfiles[0],
            t1 = require('../' + testnames),
            r1 = require.resolve('../' + testnames);
        var a = new RequireCacheClear({ files: { src: [testnames]}});
        a.run();
        var found = false;
        for(var prop in require.cache){
            if(require.cache.hasOwnProperty(prop) && prop === r1){ found = true; break; }}
        test.equal(found, false, 'Local File Check');
        test.done();
    },
    is_RequireCacheClear_clearWildcardFiles: function(test){
        test.expect(1);
        var testnames = modulewildfiles;
        var t1 = require(modulefiles[0]),
            t2 = require(modulefiles[1]),
            r1 = require.resolve(modulefiles[0]),
            r2 = require.resolve(modulefiles[1]);
        var found = false;
        var a = new RequireCacheClear({files: { src: [testnames]}});
        a.run();
        for(var prop in require.cache){
            if(require.cache.hasOwnProperty(prop) && (r1 === prop || r2 === prop)){ found = true; break; }}
        test.equal(found, false, 'RequireCacheClear clears a single wildcard specification');
        test.done();
    },
    is_RequireCacheClear_clearSeveralWildcardFiles: function(test){
        test.expect(1);
        var testnames = [modulewildfiles, localwildfiles];
        var t1 = require(modulefiles[0]),
            t2 = require(modulefiles[1]),
            t3 = require('../' + localfiles[0]);
        var r1 = require.resolve(modulefiles[0]),
            r2 = require.resolve(modulefiles[1]),
            r3 = require.resolve('../' + localfiles[0]);
        var a = new RequireCacheClear({files:{src:testnames}});
        a.run();
        var found = false;
        for(var prop in require.cache){
            if(require.cache.hasOwnProperty(prop) && (prop === r1 || prop === r2 || prop === r3)){ found = true; break; }}
        test.equal(found, false, 'RequireCacheClear clears several wildcard specifications');
        test.done(); 
    },
    is_RequireCacheClear_clearBlockwithIgnore: function(test){
        test.expect(1);
        var testnames = modulefiles[0],
            ignorenames = modulefiles[0],
            t1 = require(testnames),
            re = require.resolve(ignorenames),
            a = new RequireCacheClear({files:{src:testnames}, options:{ignoreFiles:{src:ignorenames}}}),
            found = false;
        a.run();
        for(var prop in require.cache){
            if(require.cache.hasOwnProperty(prop) && re === prop){
                found = true;
                break; }}
        test.equal(found, true, 'RequireCacheClear blocks the removal of a single file if included in ignoreFiles.src option');
        test.done(); },
    is_RequireCacheClear_clearBlockMultipleWithIgnore: function(test){
        test.expect(1);
        var testnames = [modulefiles[0], modulefiles[1]],
            ignorenames = testnames[0],
            t1 = require(testnames[0]),
            t2 = require(testnames[1]),
            re1 = require.resolve(testnames[0]),
            re2 = require.resolve(testnames[1]),
            a = new RequireCacheClear({files:{src:testnames}, options:{ignoreFiles:{src:ignorenames}}}),
            foundIgnored = false,
            foundCleared = false,
            cl = a.getCacheLength();
        a.run();
        for(var prop in require.cache){
            if(require.cache.hasOwnProperty(prop)){
                if(re1 === prop){
                    foundIgnored = true;
                } else if(re2 === prop){
                    foundCleared = true; }}}
        test.equal((foundIgnored && !foundCleared), true, 'RequireCached blocks the removal of single file whilst included in files.src, but also in ignoreFiles.src');
        test.done();
    },
    is_RequireCacheClear_clearBlockWildcardWithSingleIgnore: function(test){
        test.expect(1);
        var testnames = [modulewildfiles];
        var ignorenames = modulefiles[0];
        var t1 = require(modulefiles[0]),
            t2 = require(modulefiles[1]);
        var r1 = require.resolve(modulefiles[0]),
            r2 = require.resolve(modulefiles[1]);
        var a = new RequireCacheClear({files:{src:testnames}, options:{ignoreFiles:{src:ignorenames}}});
        a.run();
        var foundIgnored = false;
        var foundCleared = false;
        for(var prop in require.cache){
            if(require.cache.hasOwnProperty(prop)){
                if(r1 === prop){
                    foundIgnored = true;
                } else if(r2 === prop){
                    foundCleared = true; }}}
        test.equal((foundIgnored && !foundCleared), true, 'RequireCached blocks the removal of single file whilst included in wildcarded files.src, but also in ignoreFiles.src');
        test.done();
    },
    is_RequireCacheClear_clearBlockWildCardsWithSingleIgnore: function(test){
        test.expect(1);
        var testnames = [modulewildfiles, localwildfiles];
        var ignorenames = modulefiles[0];
        var t1 = require(modulefiles[0]),
            t1a = require(modulefiles[1]),
            t2 = require('../' + localfiles[0]);
        var r1 = require.resolve(modulefiles[0]),
            r2 = require.resolve(modulefiles[1]),
            r3 = require.resolve('../' + localfiles[0]);
        var a = new RequireCacheClear({files:{src:testnames}, options:{ignoreFiles:{src:ignorenames}}});
        a.run();
        var foundIgnored = false;
        var foundCleared = false;
        for(var prop in require.cache){
            if(require.cache.hasOwnProperty(prop)){
                if(r1 === prop){
                    foundIgnored = true;
                } else if(r2 === prop || r3 === prop){
                    foundCleared = true; }}}
        test.equal((foundIgnored && !foundCleared), true, 'RequireCached blocks the removal of single file whilst included in wildcarded files.src, but also in ignoreFiles.src');
        test.done();
    },
    /**
     * to test
     *  try as object run rather than direct access. */
};
