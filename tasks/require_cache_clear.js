/*
 * grunt-require-cache-clear
 * https://github.com/jimbrittain/grunt-require-cache-clear
 *
 * Copyright (c) 2016 Jim Brittain
 * Licensed under the MIT license.
 */

'use strict';
var RequireCacheClear = require('../lib/RequireCacheClear').RequireCacheClear;
module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('require_cache_clear', 'Removal of files from require.cache where retention can cause issues in watch environments.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    if(require && 'cache' in require){
        //arg1 = arg1 || (this.data.files.src || undefined);
        //arg2 = arg2 || (this.data.options || undefined);
        var arg1 = this.data || undefined;
        var rcc;
        if(arg1 !== undefined){
            for(var prop in arg1){
                grunt.log.writeln(prop + ' = ' + arg1[prop]);
            }
            rcc = new RequireCacheClear(arg1);
        //var rcc = new RequireCacheClear(arg1, arg2);
        var l = rcc.run(), i, imax;
        for(i=0, imax = l.msg.length; i<imax; i+=1){ grunt.log.writeln(l.msg[i]); }
        for(i=0, imax = l.errors.msg.length; i<imax; i+=1){ grunt.log.error(l.errors.msg[i]); }
        for(i=0, imax = l.verbose.length; i<imax; i+=1){ grunt.log.verbose.writeln(l.verbose[i]); }
        for(i=0, imax = l.errors.verbose.length; i<imax; i+=1){ grunt.log.verbose.error(l.errors.verbose[i]); }
        }
    } else {
        grunt.log.error('require.cache cannot be found. Exiting with error.');
    }
    });
};
