# log_returns  📈

### Team
| Student's name | SCIPER |
| -------------- | ------ |
| Etienne Salimbeni | 270963 | 
| Carlo Musso | 283736 |
| Filippo Salmina | 289092 |

### Context 
Correlation between stock prices gives powerful insights into the evolution of financial systems in interesting periods: during a financial crisis, political instability, or significant economic development of a country. Correlation tells us a lot about how stocks are linked, such as how industries are dependent on or independent of crisis or development in specific economic sectors. 
The goal of this visualization is to represent the evolution in time of correlation, hierarchies and clustering of various financial stocks.

### GitHub repository
**Note** - this private repository will be updated from time to time, specifically for each Milestone. The actual repository of continuous deployment had to be public for practical reasons. The public repository **log_returns** can be found [here](https://github.com/salimbeni1/log_returns)

### Visualization
The web visualization we are currently working on can be found [here](https://log-returns.vercel.app).

## Milestone 1

Download [Milestone 1.pdf](https://github.com/com-480-data-visualization/datavis-project-2022-avanturiais_/files/8449218/Team.AvanTuRiais.-.Milestone.1.pdf) or view it in the ```/milestones/``` [directory](https://github.com/com-480-data-visualization/datavis-project-2022-avanturiais_/tree/main/milestones) on this repository.


## Dependencies

yarn (a js packet manager)


## Front-End

```
cd front-end
yarn dev
```

## Back-end

```
cd back-end
docker compose up
```

## Docker
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

