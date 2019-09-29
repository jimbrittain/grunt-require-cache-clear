/*
 * grunt-require-cache-clear
 * https://github.com/jimbrittain/grunt-require-cache-clear
 *
 * Copyright (c) 2019 Jim Brittain
 * Licensed under the MIT license.
 */
"use strict";
module.exports = function(grunt) {
  var RequireCacheClear = require('../lib/RequireCacheClear').RequireCacheClear;
  grunt.registerMultiTask('require_cache_clear', 'Removal of files from require.cache where retention can cause issues in watch environments.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        if(require && 'cache' in require){
            var files = this.data.files,
                options = this.data.options; 
            files = files || (this.files || undefined);
            options = options || (this.options || undefined);

            var rcc, i, imax, l;
            if (files !== undefined && 'src' in files) {
                for (i=0, imax = files.length; i<imax; i+=1) {
                    grunt.log.writeln('Searching require.cache for ' + files.src[i]); }}
            rcc = new RequireCacheClear(files, options);
            l = rcc.run();
            for(i=0, imax = l.msg.length; i<imax; i+=1){ grunt.log.writeln(l.msg[i]); }
            for(i=0, imax = l.errors.msg.length; i<imax; i+=1){ grunt.log.error(l.errors.msg[i]); }
            for(i=0, imax = l.verbose.length; i<imax; i+=1){ grunt.log.verbose.writeln(l.verbose[i]); }
            for(i=0, imax = l.errors.verbose.length; i<imax; i+=1){ grunt.log.verbose.error(l.errors.verbose[i]); }
        } else {
            grunt.log.error('require.cache cannot be found. Exiting with error.');
        }
    });
};
