
<p align=left>
    <img src="https://img.shields.io/github/v/release/IPdotSetAF/CodeChef"/>
    <img src="https://img.shields.io/github/release-date/IPdotSetAF/CodeChef"/>
    <img src="https://img.shields.io/github/last-commit/IPdotSetAF/CodeChef"/>
    <img src="https://img.shields.io/github/license/IPdotSetAF/CodeChef"/>
</p>

# <img src="public/code-chef.svg" height="30"> CodeChef

CodeChef is an online developer tool that aims to eliminate repetitive developer tasks and automate what could be automated.

## Tools
- **C# to TypeScript converter**<br/>Converts C# classes and fields to typescript interfaces and fields.
- **Markdown to HTML converter**<br/>Converts Markdown code to HTML code.
- **Serialized tool**<br/>Converts serialized objects between different formats(JSON, XML, YAML, TOML).
- **MSSQL Scaffolder**<br/>Scaffolds C# Models from MSSQL Tables and Stored Procedures.

## Usage

You can [**Go to Live Website**](https://codechef.ipdotsetaf.ir) or Run the website locally.

### MSSQL Proxy Server

If you want to use any of the tools that need to communicate with MSSQL database, you need to download and run the proxy server, you can either download the binaries for your machine from the [**Release**](https://github.com/IPdotSetAF/CodeChef/releases) section or download the proxy [**Source Code**](https://github.com/IPdotSetAF/CodeChef/tree/main/CodeChefDatabaseProxy) and run it in your python environment.

## Running CodeChef Locally

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.9.

### Development server

Run `npm run start` or `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Run `npm run build` or `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `npm run test` or `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running MSSQL Proxy Server

### From precompiled binaries
Just download the proper version from the [release section](https://github.com/IPdotSetAF/CodeChef/releases) and run it!!

### From Source Code
Follow these steps if you want to Run the proxy server from the Python source code: 
1. Download the proxy server Python source code from the [release section](https://github.com/IPdotSetAF/CodeChef/releases).
3. `pip install -r requirements.txt`
4. `python proxy.py`

## TODO:
- **Markdown preview** in Markdown to HTML Converter
- MSSQL **Diff Tool**
- MSSQL **Search Tool**
- MSSQL **Bulk Scaffolder**

## Contribution
- You can open Issues for any bug report or feature request.
- You are free to contribute to this project by following these steps:
   1. Fork this Repo.
   2. Create a new branch for your feature/bugfix in your forked Repo.
   3. Commit your changes to the new branch you just made.
   4. Create a pull request from your branch into the `main` branch of This Repo([https://github.com/IPdotSetAF/CodeChef](https://github.com/IPdotSetAF/CodeChef)).
