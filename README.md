# KNX Visu Projects

This is part of a series of projects dedicated to Smart Home control using KNX technology. The purpose is mainly to investigate the ability to create advanced, sophisticated functions, controllers, and user interfaces using pure Open Source technology and state-of-the-art web technologies. Especially all my projects are done with:

* NodeJS
* Angular
* MongoDb
* AWS Lambda functions
* Amazon Alexa 
* TypeScript / JavaScript

The hardware part is Raspyberry Pi, using

* Windows 10 IoT for kiosk/display apps
* Raspbian OS for controllers

I'm using two commercial products:

* Weinzierl IP Interface 771
* Enertex EibPC with Web Interface

On the long way I'm going to replace the Enertex EibPC with the technology stack described before. The goal is to show that it is possible to replace a € 700 device with a € 30 Raspberry and some OS software without loosing any of the functionality.

## Features of this Project

This project is an extension to Visual Studio Code. It's primary purpose is to support a commercial product, the Enertex EibPC. But it's also a way to provide a text based interface to program the controller. There is another project that uses Node-Red, where I'm going to write a node that imports EFS files from ETS 4 (or ETS 5) and gives the user the ability to easily retrieve the right group address to select the IoT-device one want to control.

This extension in particular has these features:

> Import ESF file and create a group address tree
> Invoke these addresses and send values to devices
> Edit an *.epc file as used by the Enertex EibPC, complete with syntax highlighting and language support
> Send data to EibPC using the provided command line tools `nconf` and `eibparser`.
> Monitor messages from IP interface
> Set some settings on EibPC

So far, the goal is to replace the program "EibStudio" with something far more advanced.

## Requirements

This runs everywhere you can start Visual Studio Code. You need EibPC up and running in the local network and an IP Interface to KNX.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `files.encoding`: Default encoding of code file, is set to `windows1252` for the EibPC and must be set to `utf8` for the NodeRed/Raspberry device

## Known Issues

It's work in progress, keep an eye on it for updates.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of with extension is planned for december 2018.

### For more information

These websites are partially in German.

* [NodeJS](http://code.visualstudio.com/docs/languages/markdown)
* [Node Red](https://help.github.com/articles/markdown-basics/)
* [Raspberry](https://help.github.com/articles/markdown-basics/)
* [KNX Home](https://help.github.com/articles/markdown-basics/)
* [Enertex](https://help.github.com/articles/markdown-basics/)
* [Enertex EibPC](https://help.github.com/articles/markdown-basics/)
* [Weinzierl](https://help.github.com/articles/markdown-basics/)
* [Writing VS Code extensions](https://help.github.com/articles/markdown-basics/)
* [About me](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
