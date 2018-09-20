# KNX Visu Projects

This is part of a series of projects dedicated to Smart Home control using KNX technology. The purpose is mainly to investigate the ability to create advanced, sophisticated functions, controllers, and user interfaces using pure Open Source technology and state-of-the-art web technologies. Especially all my projects are done with:

* [NodeJS](https://nodejs.org)
* [Angular](https://angular.io/)
* [MongoDb](https://www.mongodb.com/)
* [AWS Lambda functions](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)
* [Amazon Alexa](https://developer.amazon.com/alexa/console/ask)
* [TypeScript](http://typescriptlang.org)

The hardware part is Raspyberry Pi, using

* [Windows 10 IoT](https://developer.microsoft.com/en-us/windows/iot) for kiosk/display apps
* Raspbian OS for controllers

I'm using two commercial products:

* [Weinzierl IP Interface 731](https://www.weinzierl.de/index.php/en/all-knx/knx-devices-en/knx-ip-interface-731-en)
* [Enertex EibPC](http://www.enertex.de/d-eibpc.html) with Web Interface

On the long way I'm going to replace the [Enertex EibPC](http://www.enertex.de/d-eibpc.html) with the technology stack described before. The goal is to show that it is possible to replace a € 700 device with a € 30 Raspberry and some OS software without loosing any of the functionality.

## What is KNX?

KNX offers multiple design options and a unique range of products. This allows you to create your own unique smart home that answers your needs perfectly. It's the industry standard with the widest range of products. It controls light, energy, blinds, and other devices. It's very robust and easy to install. It's vendor independent, so you can mix in whatever you like and it will work. It's completely offline and safe by default and connects to the cloud if you wish - and only if you wish. It's definitely the safest smart home system available. 

## Features of this Project

This project is an extension to Visual Studio Code. It's primary purpose is to support a commercial product, the [Enertex EibPC](http://www.enertex.de/d-eibpc.html). But it's also a way to provide a text based interface to program the controller. There is another project that uses Node-Red, where I'm going to write a node that imports EFS files from ETS 4 (or ETS 5) and gives the user the ability to easily retrieve the right group address to select the IoT-device one want to control.

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

* [NodeJS](https://nodejs.org)
* [Node Red](https://nodered.org/)
* [Raspberry](https://www.raspbian.org/)
* [KNX Home](https://www.knx.org/knx-en/for-professionals/index.php)
* [Enertex](http://www.enertex.de/)
* [Enertex EibPC](http://www.enertex.de/d-eibpc.html)
* [Weinzierl](https://www.weinzierl.de/index.php/en/)
* [Writing VS Code extensions](https://code.visualstudio.com/docs/extensions/example-hello-world)
* [About me](https://www.joergkrause.de)

# Other Projects

## Pi Mirror

I have a huge display app (designed for an 42" screen). It shows the values from the KNX weather station, the weather data pulled from Internet every hour, and a saying of the day (in German) just for enjoyment. It has pictures and text for public holidays and a few other nice gimmicks.

It's written as an UWP app on Windows 10 IoT and deployed on a Raspberry Pi 2B. The display connects through HDMI.

## Visualization

This app is written with Angular, the nebular theme, and deployed as an Electron app. It runs on Linux, Mac, Windows, and of course on a Raspberry (Model 3 recommended).

## Controller

This app is written with NodeJs, Node Red, and uses the MongoDb to store states. It runs on a Raspberry (Model 3 recommended). It's a complete graphical smart home control module.

## Serverless Functions

I have serverless functions for outbound devices. These integrate with Amazon Alexa. Because the AI Alexa runs in the cloud, I have the functions in the cloud, too. Here you can:

* Use Alexa to control a Husqvarna mower 420 with Connect Device (Husqvarna has a API for that)
* Use Alexa to trigger any KNX device at home (that's a piece of code in the EibPC (commercial) or a node in a NodeRed flow (OS))
* Use Alexa to control a Mi Home vacuum cleaner robot (It's a hack of the robot API)

The skills are private, they are not deployed to the store. To make it that way, a developer account for AWS and Alexa is required.

**Enjoy!**
