# grunt-require-cache-clear
RequireCacheClear is a for the removal of files from require.cache where retention can cause issues, particularly in watch build environments.
## Description
Whilst primarily conceived as a Grunt task, and developed for that implementation, RequireCacheClear can also be used within a node environment for removing require.cache inclusions. In this form in can be used as in object form, giving several helpful methods (RequireCacheClear) or from a quick function call (clearRequireCache).

## Getting Started
This plugin requires Grunt `~0.4.5`, it also has a dependency on Issacs npm glob to enable wildcard searching (https://github.com/isaacs/node-glob).

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-require-cache-clear --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-require-cache-clear');
```

## The "require_cache_clear" task

### Overview
In your project's Gruntfile, add a section named `require_cache_clear` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  require_cache_clear: {
    options: {
      clearAll: false,
      ignoreFiles: {
        src: ['example1.js', 'example2.js']
      },
    },
    files: {
      src: { // Target-specific file lists. }
    },
  },
});
```
### Files
Type: `String` | `Array` | `Object`
Default value: `undefined`
Description: When supplied an object it should be in the form;
```
    var obj = {
        src: []
    };
```
files in grunt-require-cache-clear operates on lazy supplied-variable principle, in that it can be supplied a string of a filename or glob, and array of strings of filenames or globs, or an object, containing a src property with an array of strings of filenames or globs. Whilst this laziness may be considered bad practice by some, and prone to misinterpretting supplied data, interpretation is preferred by the developer.

### Options

#### options.clearAll
Type: `Boolean`
Default value: `false`

#### options.ignoreFiles
Type: `String` | `Array` | `Object`
Default value: `undefined`
Description: When supplied an object it should be in the form;
```
    var obj = {
        src: []
    };
```
options.ignoreFiles, as files in grunt-require-cache-clear operates on lazy supplied-variable principle, in that it can be supplied a string of a filename or glob, and array of strings of filenames or globs, or an object, containing a src property with an array of strings of filenames or globs. Whilst this laziness may be considered bad practice by some, and prone to misinterpretting supplied data, interpretation is preferred by the developer.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  require_cache_clear: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  require_cache_clear: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
