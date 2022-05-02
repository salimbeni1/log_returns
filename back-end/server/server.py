import fastapi
import uvicorn
import helper
import json
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = fastapi.FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open('./sector.json') as sectors:
    sector_json = json.load(sectors)
    
df = pd.read_parquet( '/back-end/server/data/us_equities_logreturns.parquet')
          
@app.get('/mst')
def mst():  
    
    dict_list_MST = helper.get_rolling_dict(sector_json, df, 4100, 10100, 100, 'MST') #df.shape[0]
    
    json_data = {"all": dict_list_MST}
    return json_data

@app.get('/fct')
def phy():
    
    dict_list_FCT = helper.get_rolling_dict(sector_json, df, 4100, 10100, 100, 'FCT') #df.shape[0]
    
    json_data = {"all": dict_list_FCT}
    return json_data
    
if __name__ == '__main__':
    uvicorn.run(app)
    
    