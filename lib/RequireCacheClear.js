"use strict";
/*globals path, Array, grunt, console */
var path = require('path');
var glob = require('glob');

var RequireCacheClear = function(files, options){
    this.log = {};
    this.initLog();
    this.files = { src: [] };
    this.options = { 
        clearAll: false,
        ignoreFiles: { src: [] }};
    if(files !== undefined){ 
        options = options || undefined;
        this.init(files,options); }};
/**
 * @method initLog
 * @module RequireCacheClear
 * @description log initialisation, could and should be done with a class
 **/
RequireCacheClear.prototype.initLog = function(){
    this.log = {
        errors : {
            msg : [],
            verbose : []},
        verbose : [],
        msg: []};
};
/**
 * @method init
 * @module RequireCacheClear
 * @param files {String|Array|undefined|Object}
 * @param options {String|Array|undefined|Object}
 * @description - formats the files and options parameters into the correct format
 **/
RequireCacheClear.prototype.init = function(files, options){
    //files can be full object that contains files and options, an object with a src, a string or an array, or undefined;
    var a = '';
    if(typeof files !== 'undefined'){
        if(typeof files === 'object' && 'files' in files){
            options = (typeof options === 'undefined' && 'options' in files) ? files.options : options;
            files = this.cleanSrcDefinition(files.files);
        } else { 
            files = this.cleanSrcDefinition(files); 
        }
        
        if(typeof options === 'undefined'){
            options = {clearAll: false, ignoreFiles: []};
        } else {
            if(typeof options === 'object' && 'ignoreFiles' in options){
                options.ignoreFiles = this.cleanSrcDefinition(options.ignoreFiles);
            } else {
                if(typeof options === 'object' && 'clearAll' in options){
                    options.ignoreFiles = [];
                } else {
                    a = this.cleanSrcDefinition(options);
                    if('src' in a){
                        options = {
                            clearAll: false,
                            ignoreFiles: a }; 
                    }}}}
    } else if(typeof options === 'object' && 'ignoreFiles' in options){
        options.ignoreFiles = this.cleanSrcDefinition(options.ignoreFiles);
    } else {
        a = this.cleanSrcDefinition(options);
        options = { 
            clearAll: true,
            ignoreFiles: a };
    }
    this.files = files;
    this.options = options; };
/**
 * @method cleanSrcDefinition
 * @module RequireCacheClear
 * @param v {String|Array|Object|undefined}
 * @return {Object} properly formated object with src property
 **/
RequireCacheClear.prototype.cleanSrcDefinition = function(v){
    v = (typeof v === 'object' && 'src' in v) ? v.src : v;
    if(typeof v === 'string'){
        v = { src: [v] };
    } else if(Array.isArray(v)){
        v = { src: v };
    } else { v = { src: [] }; }
    return v; };
RequireCacheClear.prototype.getCacheLength = function(){
    if(this.doesCacheExist()){
        var count = 0;
        for(var prop in require.cache){
            if(require.cache.hasOwnProperty(prop)){ count +=1; }}
        return count;
    } else { return 0; }};
/**
 * @method run
 * @module RequireCacheClear
 * @param files [opt] - allows overide of construction
 * @param options [opt] - allows overife of construction
 * @returns log object in format;
 *      log {
 *          msg: [],
 *          verbose: [],
 *          errors: {
 *              msg: [],
 *              verbose: []
 *          };
 **/
RequireCacheClear.prototype.run = function(files, options){
    if(typeof files !== 'undefined' || typeof options !== 'undefined'){
        files = files || undefined;
        options = options || undefined;
        this.init(files, options); }
    files = this.files;
    options = this.options;
    if(typeof files === 'undefined' && typeof options === 'undefined'){ this.options.clearAll = true; }
    this.initLog(); //refresh the log;
    if(!this.doesCacheExist()){
        this.log.errors.msg.push('require.cache cannot be found. Exiting with error.');
    } else {
        var removed = 0, i, imax,
            fileslist = this.getFilesList(files),
            ignorelist = this.getFilesList(options.ignoreFiles);
        if(options.clearAll === true){
            var c = this;
            c.log.msg.push('Require Cache - Full Delete');
            for(var k in require.cache){
                if(require.cache.hasOwnProperty(k)){
                    if(!this.inArray(k, ignorelist)){
                        delete require.cache[k];
                        this.log.verbose.push('Full Delete: require cache deleted for ' + k);
                        removed += 1;
                         }}}
        } else if(fileslist.length < 1){
            this.log.msg.push('grunt-require-cache-clear not supplied any files to remove, and options.clearAll not true');
        } else {
            for(var key in require.cache){
              if(require.cache.hasOwnProperty(key)){
                if (fileslist.length < 1) {
                  break;
                } else { 
                  for (i=0, imax = fileslist.length; i < imax; i+=1) {
                    if (key === fileslist[i] && !this.inArray(key, ignorelist)){
                      delete require.cache[key];
                      this.log.verbose.push('require.cache deleted for ' + key);
                      fileslist.splice(i, 1);
                      removed += 1;
                      i -= 1; }}}}}
        }
        this.log.msg.push(removed + ' files removed from require.cache');
        for(i=0, imax=fileslist.length; i<imax; i+=1){
            this.log.verbose.push('require.cache not found for ' + fileslist[i]);
        }
    }
    return this.log;
};
/**
 * @method inArray
 * @module RequireCacheClear
 * @param needle {*}
 * @param haystack {Array}
 * @return {Boolean}
 **/
RequireCacheClear.prototype.inArray = function(needle, haystack){
    for(var i=0, imax=haystack.length; i<imax; i+=1){
        if(haystack[i] === needle){ return true; }}
    return false; };
/**
 * @method doesCacheExist
 * @module RequireCacheClear
 * @return {Boolean}
 * @description - checks that require.cache exists in global space
 **/
RequireCacheClear.prototype.doesCacheExist = function(){ return (typeof require !== 'undefined' && typeof require === 'function' && 'cache' in require) ? true : false; };
/**
 * @method getFilesList
 * @param files
 * @requires path
 * @return {Array}
 **/
RequireCacheClear.prototype.getFilesList = function(files){
    var fileslist = [],
        locations = process.env.NODE_PATH ? process.env.NODE_PATH.split(':') : [];
    locations.push(process.cwd());
    locations.push(process.env.PWD);
    locations.push('');
    if(typeof files === 'object' && 'src' in files){
        for(var i=0, imax=files.src.length; i<imax; i+=1){ 
            if(typeof files.src[i] === 'string' && files.src[i].indexOf('**') !== -1){
                var a = this.getWildCardFilesList(files.src[i]);
                fileslist = fileslist.concat(a);
            } else {
                for(var n=0, nmax = locations.length; n<nmax; n+=1){
                    try {
                        var p = path.join(locations[n], files.src[i]),
                            f = require.resolve(p);
                        if(f !== ''){ 
                            fileslist.push(f); 
                            break; }
                    } catch(e) { continue; }}}}
    }
    return fileslist; 
};
RequireCacheClear.prototype.getWildCardFilesList = function(filepath){
    var fileslist = [],
        locations = process.env.NODE_PATH ? process.env.NODE_PATH.split(':') : [];
    locations.push(process.cwd());
    locations.push(process.env.PWD);
    for(var i=0, imax = locations.length; i<imax; i+=1){
        var files = glob.sync(filepath, { cwd: path.resolve(locations[i]) });
        if(files.length > 0){ return files.slice(); }
        files = glob.sync(filepath, { cwd: path.join(locations[i], 'node_modules')});
        if(files.length > 0){ 
            for(var n=0, nmax = files.length; n<nmax; n+=1){
                files[n] = require.resolve(files[n]); }
            return files.slice(); }}
    return fileslist; };
/**
 * @function clearRequireCache
 * @param files {String|Array|Object|undefined}
 * @param options {String|Array|Object|undefined}
 * @requires path, console, grunt
 * @return Boolean
 * @description RequireCacheClear construction and envocation through function call
 **/
var clearRequireCache = function(files, options){
    var rcc = new RequireCacheClear(files, options),
        log = rcca.run(), i, imax; 
    for(i=0, imax=log.msg.length; i<imax; i+=1){ 
        (grunt) ? grunt.log.writeln(log.msg[i]) : console.log(log.msg[i]); }
    for(i=0, imax=log.errors.msg.length; i<imax; i+=1){ 
        (grunt) ? grunt.log.error(log.errors.msg[i]) : console.log(log.errors.msg[i]); }
    return (log.errors.msg.length > 0) ? false : true; };

module.exports.RequireCacheClear = RequireCacheClear;
module.exports.clearRequireCache = clearRequireCache;
