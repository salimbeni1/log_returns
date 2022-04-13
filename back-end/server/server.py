import fastapi
import uvicorn
import helper
import json
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

    
@app.get('/')
def correlation():

    with open('./sector.json') as sectors:
        sector_json = json.load(sectors)
        
    df = helper.load_clean_data( '/back-end/server/data/us_equities_logreturns.parquet' )
    dict_list = helper.save_json_rolling(df, sector_json, start_=4100, end_= None, rolling_window_=1000, step_=100)
    
    json_data = {"all": dict_list}
    return json_data
    
if __name__ == '__main__':
    uvicorn.run(app)
    
    