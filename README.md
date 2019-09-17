# insta-scraper

Simple script for scraping public Instagram profiles.

### Installation

First, make sure that Node and NPM are installed:

* [Install Node and NPM on Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows)
* [Install Node and NPM on Mac](http://blog.teamtreehouse.com/install-node-js-npm-mac)

Then, install dependencies by typing (inside this directory):

``` bash
$ npm install
```

### Usage

Run this script from the command line:

``` bash
$ node scrape -u instagramuser
```

The following arguments are available:

* `-u <username>` the name of the Instagram profile to be scraped (required).
* `-d <directory>` the target directory (has to exist). Optional, if not used output will be saved in the `./data` subdirectory.
* `--raw` default the script will only save `Profile` and `Post` related data. Use this option to save **all** the available JSON data instead.

**Example**

``` bash
$ node scrape -u instagramuser -d ~/Desktop/ig-data --raw
```
will result in

``` bash
Saved profile /Users/myself/Desktop/ig-data/instagramuser.json: 3456.78ms
```


