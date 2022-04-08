import fastapi
import uvicorn
import helper

app = fastapi.FastAPI()
global df
df = None

global c_df
c_df = None

global d_df
d_df = None

@app.get('/')
def index():
    # path for shared parquet file in docker image: 'back-end/server/data/us_equities_logreturns.parquet'
    global df
    df = helper.load_clean_data( '/back-end/server/data/us_equities_logreturns.parquet' )
    return { "message" : 'Data has loaded visit correlation page ' }

    
@app.get('/correlation/{from_}:{to_}/{percentage}')
def correlation(from_: int, to_: int, percentage: float):
    if (df is None):
        return {'Load data before demanding correlation. Visit index page. '}
    
    if (from_ == None or to_ == None or percentage == None):
        from_ = 0
        to_ = 1000
        percentage = 0.3

    c_df = helper.get_correlation(df, from_, to_) # !! if interval to small result in nan value
    d_df = helper.get_distance(c_df)
    final_dict = helper.generate_dict(d_df, percentage_keep_=percentage)
    
    return final_dict
    
if __name__ == '__main__':
    uvicorn.run(app)
    
    