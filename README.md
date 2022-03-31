# log_returns


# dependencies

yarn (a js packet manager)


# Front-End

```
cd front-end
yarn dev
```

# Back-end

```
cd front-end
python3 main.py
```

# Docker
To build and launch the python-FastAPI docker navigate to the ``` docker > code ``` directory in the command line and run the command: \
``` docker-compose up ```

### Note 
The docker contains a server file (``` main.py ```) and the possibility to access a DATA folder on the host computer (in order to avoid to copy a heavy DATA file to the docker each time it runs). In order to set the source path of the data directory open the ```docker-compose.yml``` file and select the line of code:
```
    volumes:
      - ~/Documents/DATA_VIZ_DATA:/code/DATA/:ro 
```
Now edit the path before the ``` ':' ``` character with your specific path, for example:
```
    volumes:
      - ~/my/path/to/data:/code/DATA/:ro 
```

Now, once you run ``` docker-compose up ``` and select the docker's command line you should be able to see all files in your ``` ~/my/path/to/data ``` directory in the ```/code/DATA/``` directory of your docker. 

The server (``` main.py ```) for the moment only returns a mock "hello world" message.

### Docker diagram
The docker has the following structure:


![DOCKER DIAGRAM](https://user-images.githubusercontent.com/47753346/161059706-b06bffb8-9fef-4112-8073-e21bffdaa421.jpeg)

