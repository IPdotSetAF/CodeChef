
<p align=left>
    <img src="https://img.shields.io/github/v/release/IPdotSetAF/CodeChef"/>
    <img src="https://img.shields.io/github/release-date/IPdotSetAF/CodeChef"/>
    <img src="https://img.shields.io/github/last-commit/IPdotSetAF/CodeChef"/>
    <img src="https://img.shields.io/github/license/IPdotSetAF/CodeChef"/>
</p>

# <img src="Frontend/public/code-chef.svg" height="30"> CodeChef

CodeChef is an online developer tool that aims to eliminate repetitive developer tasks and automate what could be automated.

## Tools
- **C# to TypeScript converter**<br/>Converts C# classes and fields to typescript interfaces and fields.
- **Markdown to HTML converter**<br/>Converts Markdown code to HTML code.
- **Serialized tool**<br/>Converts serialized objects between different formats(JSON, XML, YAML, TOML).
- **MSSQL Scaffolder**<br/>Scaffolds C# Models from MSSQL Tables and Stored Procedures.
- **Font Converter**<br/>Converts different Font formats to each other(.ttf, .woff, .woff2, .eot, .svg, .otf).
- **Need more tools?**<br/><a href="#Contribution">Open issue/pull request</a>, Everyone is welcome for contribution.

You can [**Go to Live Website**](https://codechef.ipdotsetaf.ir) or Run the website locally.

## Running CodeChef Frontend Locally

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.9.

### Development server

Run `npm run start` or `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Run `npm run build` or `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `npm run test` or `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## MSSQL Proxy Server

If you want to use any of the tools that need to communicate with the MSSQL database, you need to download and run the proxy server, you can either download the binaries for your machine from the [**Release**](https://github.com/IPdotSetAF/CodeChef/releases) section or download the proxy [**Source Code**](https://github.com/IPdotSetAF/CodeChef/tree/main/CodeChefDatabaseProxy) and run it in your python environment.

### Running MSSQL Proxy Server

Download the proper version from the [release section](https://github.com/IPdotSetAF/CodeChef/releases) and run it!!

#### Args
```
-p --port <proxy port>
-o --allowed-origin <allowed origin (ex. http://localhost:4200)>
```

#### From Source Code
Follow these steps if you want to Run the mssql-proxy from the Python source code: 
1. Download the mssql-proxy Python source code from the [release section](https://github.com/IPdotSetAF/CodeChef/releases).
3. `pip install -r requirements.txt`
4. `python proxy.py`

## Docker

CodeChef docker image contains both the **Frontend** and **mssql-proxy**. 

### Pulling the image
```bash
docker pull ghcr.io/ipdotsetaf/codechef:latest
```

### Running the container
```bash
docker run --name codechef -d -p 4200:4200 -p 50505:50505 ghcr.io/ipdotsetaf/codechef:latest
```

#### Changing the Frontend port
```bash
docker run --name codechef -d -e ALLOWED_ORIGIN="http://localhost:<FRONTEND_PORT>" -p <FRONTEND_PORT>:4200 -p 50505:50505 ghcr.io/ipdotsetaf/codechef:latest
``` 
The allowed origin will be the URL that will serve the Fronend and the browser access it with.

#### Changing the proxy
```bash
docker run --name codechef -d -p 4200:4200 -p <PROXY_PORT>:50505 ghcr.io/ipdotsetaf/codechef:latest
```

### Exposing database to mssql-proxy
> [!IMPORTANT]
> You need to make sure that the CodeChef container and your mssql-server are on the same network and know the mssql-server IP address exposed on that network. that will be the IP address you use on the CodeChef website.
#### Instructions
TBD...

## TODO:
- MSSQL **Diff Tool**
- MSSQL **Search Tool**
- MSSQL **Bulk Scaffolder**
- MSSQL Scaffolder **string search for inputs**
- MSSQL Scaffolder **file export**

## Contribution
- You can open Issues for any bug report or feature request.
- You are free to contribute to this project by following these steps:
   1. Fork this Repo.
   2. Create a new branch for your feature/bugfix in your forked Repo.
   3. Commit your changes to the new branch you just made.
   4. Create a pull request from your branch into the `main` branch of This Repo([https://github.com/IPdotSetAF/CodeChef](https://github.com/IPdotSetAF/CodeChef)).
